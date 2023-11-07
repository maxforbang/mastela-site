import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { ContactFormEmailTemplate } from "~/components/email/ContactFormEmailTemplate";
import { Resend } from "resend";
import { env } from "~/env.mjs";
import { UnblockedDatesTemplate } from "~/components/email/UnblockedDatesTemplate";
import { ConfirmationEmailTemplate } from "~/components/email/ConfirmationEmailTemplate";

export const emailRouter = createTRPCRouter({
  sendContactFormEmail: publicProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        email: z.string(),
        phone: z.string(),
        message: z.string(),
        reason: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { firstName, lastName, email, phone, message, reason } = input;
      const data = await ctx.resend.emails.send({
        from: "Mastela Vacations <info@mastelavacations.com>",
        to: "mastelavacations@gmail.com",
        subject: `Website Inquiry - ${reason}`,
        react: ContactFormEmailTemplate({
          firstName,
          lastName,
          email,
          phone,
          message,
          reason,
        }),
        text: "",
      });

      return { data };
    }),
  sendDatesNotBlockedAfterPaymentEmail: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        phone: z.string(),
        arrival: z.string(),
        departure: z.string(),
        errorMsg: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, email, phone, arrival, departure, errorMsg } = input;
      const data = await ctx.resend.emails.send({
        from: "Mastela Vacations <info@mastelavacations.com>",
        to: "mastelavacations@gmail.com",
        subject: `Website ERROR - Unblocked Dates`,
        react: UnblockedDatesTemplate({
          name,
          email,
          phone,
          arrival,
          departure,
          errorMsg,
        }),
        text: `There was a booking on the website in which a customer successfully paid but Lodgify was unable to block the dates. Block them out manually before a potential double booking. Here is the booking information: Guest name: ${name}, Dates booked: ${arrival} to ${departure}, Phone: ${phone}, Email: ${email}, Lodgify Error Message: ${errorMsg}. See the Stripe's Payment > Webhook Response for more information.`,
      });

      return { data };
    }),
  sendConfirmationEmail: publicProcedure
    .input(
      z.object({
        name: z.string(),
        propertyName: z.string(),
        email: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, propertyName, email } = input;
      const data = await ctx.resend.emails.send({
        from: "Mastela Vacations <noreply@mastelavacations.com>",
        to: email,
        subject: `Mastela Vacations Confirmation`,
        react: ConfirmationEmailTemplate({
          name,
          propertyName,
        }),
        text: `We've received your payment and are so excited to have you in ${propertyName}. We'll send in check-in instructions and your digital keypad code to access the property before your arrival.`,
      });

      return { data };
    }),
});
