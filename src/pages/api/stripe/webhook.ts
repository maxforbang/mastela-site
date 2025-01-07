import { prisma } from "./../../../server/db";
import sanityClient from "../../../../sanity/lib/sanityClient";
import getRawBody from "raw-body";
import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "~/env.mjs";
import { stripe } from "~/server/api/stripe";
import {
  lodgifyHeaders,
  propertiesRouter,
} from "~/server/api/routers/properties";
import type { StripePaymentIntent } from "types";
import { resend } from "./../../../server/resend";
import { emailRouter } from "~/server/api/routers/email";
const STRIPE_SIGNATURE_HEADER = "stripe-signature";

// NB: we disable body parser to receive the raw body string. The raw body
// is fundamental to verify that the request is genuine
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function checkoutsWebhooksHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const signature = req.headers[STRIPE_SIGNATURE_HEADER];
  const rawBody = await getRawBody(req);

  const event = stripe.webhooks.constructEvent(
    rawBody,
    signature as string,
    env.WEBHOOK_SECRET_KEY
  );

  const propertiesRouterCaller = propertiesRouter.createCaller({
    prisma,
    sanityClient,
    resend,
  });

  const emailRouterCaller = emailRouter.createCaller({
    prisma,
    sanityClient,
    resend,
  });

  // NB: if stripe.webhooks.constructEvent fails, it would throw an error

  // here we handle each event based on {event.type}

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const { created, data } = event;

        const {
          receipt_email: email,
          shipping: { name, phone },
          metadata: {
            pricing = "",
            pricePerNight = "",
            propertyName = "",
            totalPrice = "",
            arrival = "",
            departure = "",
            lodgifyPropertyId = "",
            lodgifyRoomId = "",
            source, // Update (12/16/2024): This source is not used anymore. Potential Lodgify documentation change.
          },
        } = data.object as StripePaymentIntent;

        if (propertyName.length === 0) {
          return res.status(200).json({
            message:
              "Webhook ignored. Webhook will only trigger on bookings made through the website.",
          });
        }

        const priceDetails: Record<string, number>[] = JSON.parse(
          pricing
        ) as Record<string, number>[];
        const amountDetails: Record<string, number> = {};

        priceDetails.forEach((item) => {
          const key: string = Object.keys(item)[0] ?? "";
          const value: number = item[key] ?? 0;
          amountDetails[key] = value;
        });

        const bookingId = await propertiesRouterCaller.createBooking({
          propertyId: lodgifyPropertyId,
          roomId: lodgifyRoomId,
          guestName: name,
          guestEmail: email,
          guestPhone: phone,
          arrival: arrival,
          departure: departure,
          totalPrice: totalPrice,
        });

        if (typeof bookingId !== "number") {
          // Send some alert (email, text) to the team to resolve this. Customer has paid but Lodgify was unable to create the booking.
          await emailRouterCaller.sendDatesNotBlockedAfterPaymentEmail({
            name,
            email,
            phone,
            arrival,
            departure,
            errorMsg: `Customer has paid but Lodgify was unable to create the booking. \nError:${bookingId.message} \nGuest:${name} \nArrival:${arrival} \nDeparture:${departure} \nTotal Price:${totalPrice}`,
          });

          return res.status(400).json({
            message:
              "Customer has paid but Lodgify was unable to create the booking.",
            lodgifyError: bookingId,
            customer: { name, email, phone },
            propertyName,
            dates: { arrival, departure },
            totalPrice,
          });
        }

        const bookingResponse: { status: string } = (await fetch(
          // Gets a quote - https://docs.lodgify.com/reference/get_v2-quote-propertyid
          `https://api.lodgify.com/v2/reservations/bookings/${bookingId}`,
          {
            method: "GET",
            headers: lodgifyHeaders,
          }
        ).then((response) => response.json())) as { status: string };

        if (bookingResponse.status !== "Booked") {
          // Send some alert (email, text) to the team to resolve this. Customer has paid but Lodgify was unable to create the booking.
          await emailRouterCaller.sendDatesNotBlockedAfterPaymentEmail({
            name,
            email,
            phone,
            arrival,
            departure,
            errorMsg: `Customer has paid but Lodgify was unable to create the booking.  \nGuest:${name} \nArrival:${arrival} \nDeparture:${departure} \nTotal Price:${totalPrice}`,
          });

          return res.status(403).json({
            message:
              "Customer has already paid but the booking dates conflict with another booking, therefore it was not created.",
            lodgifyBookingId: bookingId,
            lodgifyBookingStatus: bookingResponse.status,
            customer: { name, email, phone },
            propertyName,
            dates: { arrival, departure },
            totalPrice,
          });
        }

        // Send guest a confirmation email
        await emailRouterCaller.sendConfirmationEmail({
          name,
          propertyName,
          email,
        });

        return res.status(200).json({
          customer: { name, email, phone },
          propertyName,
          dates: { arrival, departure },
          totalPrice,
          pricePerNight,
          amountDetails,
          bookingId: bookingId,
          created,
        });
      }
    }

    return res
      .status(200)
      .json({ responseMessage: "not payment_intent.succeeded" });
  } catch (e) {
    return res.status(500).json({ responseMessage: "Server Error" });
  }
}
