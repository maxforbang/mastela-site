import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import sanityClient from "../../../../sanity/lib/sanityClient";
import { env } from "~/env.mjs";
import { groq } from "next-sanity";
import { differenceInDays } from "date-fns";
import { formatCurrencyRounded } from "~/utils/functions/formatCurrency";
import { TRPCError } from "@trpc/server";
import {
  BookingInformation,
  BookingQuoteInfo as BookingQuoteInfo,
  InvoiceItem,
  PaymentMethod,
} from "types";
import Stripe from "stripe";
import { stripe } from "../stripe";
import { Input } from "postcss";

export const lodgifyHeaders = {
  accept: "application/json",
  "X-ApiKey": env.LODGIFY_API_KEY,
};

export const propertiesRouter = createTRPCRouter({
  getProperty: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const propertyQuery = groq`
    *[_type == 'property' && slug.current == $slug][0] {
      name, slug, occupancy, mainImage, coords, preview, description
    }`;

      const property = await sanityClient.fetch(propertyQuery, {
        slug: input.slug,
      });
      return property;
    }),
  getAllProperties: publicProcedure.query(async ({ ctx }) => {
    const allPropertiesQuery = groq`
    *[_type == 'property'] {
      name, slug, occupancy, mainImage, coords, preview
    }`;

    const properties = await sanityClient.fetch(allPropertiesQuery);
    return properties;
  }),
  getAvailableProperties: publicProcedure
    .input(
      z.object({
        startDate: z.optional(z.string()),
        endDate: z.optional(z.string()),
      })
    )
    .query(async ({ ctx, input }) => {
      if (
        !input.startDate ||
        !input.endDate ||
        input.startDate >= input.endDate
      ) {
        return null;
      }

      try {
        const lodgifyPropertyAvailabilities = await fetch(
          // Get all availabilities - https://docs.lodgify.com/reference/getcalendarbyuserF
          `https://api.lodgify.com/v2/availability?start=${input.startDate}&end=${input.endDate}&includeDetails=false`,
          {
            method: "GET",
            headers: lodgifyHeaders,
          }
        ).then((response) => response.json());

        let availablePropertiesLodgifyIds = [];
        for (let property of lodgifyPropertyAvailabilities) {
          const available = !property.periods.some(
            (period) => period.available === 0 && period.start !== input.endDate // edge case: API returns {available: 0} for a range of 1 day if the next booking starts on your endDate param
          );
          if (available) {
            availablePropertiesLodgifyIds.push(property.property_id);
          }
        }

        const availableProperties = await ctx.prisma.property.findMany({
          where: {
            lodgifyPropertyId: {
              in: availablePropertiesLodgifyIds,
            },
          },
        });

        const availablePropertiesSanityIds = availableProperties.map(
          (property) => property.sanityId
        );

        //TODO: Get price and combine with sanity objects (https://docs.lodgify.com/reference/listproperties)
        // Total price along with a field for average price which you calculate here on server

        // Return an array of ListingViews
        // propertyListings : ListingView[] =  [
        // {...lodgifyDataProperty1,  ...sanityDataProperty1},
        // {...lodgifyDataProperty2,  ...sanityDataProperty2},
        // {etc}
        // ]

        const listingsQuery = groq`
        *[_type == 'property' && _id in $availablePropertiesSanityIds] {
          name, slug, occupancy, mainImage, coords, preview
        }`;

        const availableListings = await sanityClient.fetch(listingsQuery, {
          availablePropertiesSanityIds,
        });

        return availableListings;
      } catch (error) {
        console.error(error);
        throw new Error(
          `Failed to fetch available properties. Error: ${error}`
        );
      }
    }),
  getQuote: publicProcedure
    .input(
      z.object({
        slug: z.string(),
        startDate: z.string(),
        endDate: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (
        !input.startDate ||
        !input.endDate ||
        input.startDate >= input.endDate
      ) {
        return null;
      }

      const property = await getPropertyBySlug(ctx.prisma, input.slug);
      const quote = await getLodgifyQuote(
        property,
        input.startDate,
        input.endDate
      );

      if (quote.code === 666) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: quote.message + `, please change your selection.`, //${property.name} from ${input.startDate} to ${input.endDate}`,
        });
      }

      const pricingInfo = calculateLodgifyPricingInfo(
        quote,
        property.name,
        input.startDate,
        input.endDate
      );

      return pricingInfo;
    }),
  getClientSecret: publicProcedure
    .input(
      z.object({
        slug: z.string(),
        startDate: z.string(),
        endDate: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const property = await getPropertyBySlug(ctx.prisma, input.slug);
      const { name: propertyName, lodgifyPropertyId, lodgifyRoomId } = property;

      const quote = await getLodgifyQuote(
        property,
        input.startDate,
        input.endDate
      );

      const pricingInfo = calculateLodgifyPricingInfo(
        quote,
        property.name,
        input.startDate,
        input.endDate
      );
      const { invoiceItems, pricePerNight, totalPrice } = pricingInfo;
      const totalPriceInCents = Math.round(totalPrice * 100);

      const pricingDetails = invoiceItems.map((invoiceItem) => {
        return { [invoiceItem.description]: invoiceItem.subtotal };
      });

      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalPriceInCents,
        metadata: {
          arrival: input.startDate,
          departure: input.endDate,
          lodgifyPropertyId,
          lodgifyRoomId,
          propertyName,
          totalPrice,
          pricePerNight,
          pricing: JSON.stringify(pricingDetails),
        },
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return paymentIntent.client_secret;
    }),
  getBookingPaymentInformation: publicProcedure
    .input(
      z.object({
        paymentIntent: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        input.paymentIntent
      );

      const {
        payment_method,
        created,
        metadata: {
          propertyName,
          totalPrice,
          pricePerNight,
          pricing,
          arrival,
          departure,
        },
        receipt_email: email,
        shipping: { name, phone },
      } = paymentIntent;

      const paymentMethodPromise =
        stripe.paymentMethods.retrieve(payment_method);

      const priceDetails = JSON.parse(pricing);
      const amountDetails: { [key: string]: number } = {};
      priceDetails.forEach((item: { [key: string]: number }, index: number) => {
        const key: string = Object.keys(item)[0];
        const value: number = item[key];
        amountDetails[key] = value;
      });

      const createdDate = new Date(0);
      createdDate.setUTCSeconds(created);

      let brand, exp_month, exp_year, last4;
      const paymentMethodInfo = await paymentMethodPromise;
      const isCard = paymentMethodInfo.type === "card";

      if (isCard) {
        ({
          card: { brand, exp_month, exp_year, last4 },
        } = paymentMethodInfo);
      }

      const paymentMethod: PaymentMethod = {
        type: isCard ? "card" : "",
        brand,
        exp_month,
        exp_year,
        last4,
      };

      const bookingInformation: BookingInformation = {
        customer: {
          name,
          email,
          phone,
        },
        propertyName,
        dates: { arrival, departure },
        totalPrice,
        amountDetails,
        pricePerNight,
        createdDate,
        paymentMethod,
      };

      return bookingInformation;
    }),
  createBooking: publicProcedure
    .input(
      z.object({
        propertyId: z.string(),
        roomId: z.string(),
        guestName: z.string(),
        arrival: z.string(),
        departure: z.string(),
        totalPrice: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { propertyId, roomId, guestName, arrival, departure, totalPrice } =
        input;

      
      console.log(`{"rooms":[{"room_type_id":${parseInt(roomId)}}],"guest":{"name":"${guestName}"},"source":"Manual","source_text":"mastelavacations.com","arrival":"${arrival}","departure":"${departure}","property_id":${parseInt(propertyId)},"status":"Booked","total":${parseFloat(
        totalPrice
      )},"currency_code":"usd","origin":"Mastela Vacations Site"}`)

      const bookingId = await fetch(
        // Get all availabilities - https://docs.lodgify.com/reference/getcalendarbyuserF
        `https://api.lodgify.com/v1/reservation/booking`,
        {
          method: "POST",
          headers: { ...lodgifyHeaders, "content-type": "application/*+json" },
          body: `{"rooms":[{"room_type_id":${roomId}}],"guest":{"name":"${guestName}"},"source":"Manual","source_text":"mastelavacations.com","arrival":"${arrival}","departure":"${departure}","property_id":${propertyId},"status":"Booked","total":${parseFloat(
            totalPrice
          )},"currency_code":"usd","origin":"Mastela Vacations Site"}`,
        }
      ).then((response) => response.json());

      return bookingId;
    }),
});

const getPropertyBySlug = async (prisma, slug: string) => {
  return await prisma.property.findFirst({
    where: {
      slug: slug,
    },
  });
};

const getLodgifyQuote = async (
  property,
  startDate: string,
  endDate: string
) => {
  const { lodgifyPropertyId, lodgifyRoomId } = property;

  const quote = await fetch(
    // Gets a quote - https://docs.lodgify.com/reference/get_v2-quote-propertyid
    `https://api.lodgify.com/v2/quote/${lodgifyPropertyId}?arrival=${startDate}&departure=${endDate}&roomTypes[0].Id=${lodgifyRoomId}&roomTypes[0].People=4`,
    {
      method: "GET",
      headers: lodgifyHeaders,
    }
  ).then((response) => response.json());

  return quote;
};

function calculateLodgifyPricingInfo(
  quote,
  propertyName: string,
  startDate: string,
  endDate: string
) {
  let { total_including_vat: totalPrice, room_types } = quote[0];
  const invoiceItems: InvoiceItem[] = room_types[0].price_types.filter(
    (invoiceItem) => invoiceItem.subtotal > 0
  ); // TODO: Add discount items (remove filter)

  const numNights = differenceInDays(new Date(endDate), new Date(startDate));

  let pricePerNight = "";
  for (let invoiceItem of invoiceItems) {
    if (invoiceItem.prices.length === 1) {
      invoiceItem.description =
        invoiceItem.prices[0]?.description || invoiceItem.description;
    }
    for (let subItem of invoiceItem.prices) {
      if (subItem.room_rate_type === 0) {
        pricePerNight = formatCurrencyRounded(subItem.amount / numNights);
        invoiceItem.description = `${numNights} nights (${pricePerNight}/night)`;
      }
    }
  }

  const pricingInfo: BookingQuoteInfo = {
    propertyName,
    invoiceItems,
    pricePerNight,
    totalPrice,
  };

  return pricingInfo;
}
