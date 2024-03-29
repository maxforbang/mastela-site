import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "~/env.mjs";
import { groq } from "next-sanity";
import { differenceInDays, parseISO } from "date-fns";
import { formatCurrencyRounded } from "~/utils/functions/formatCurrency";
import { utcDate } from "~/utils/functions/dates/utcDate";
import { TRPCError } from "@trpc/server";
import type {
  BookingInformation,
  BookingQuoteInfo,
  DateRange,
  InvoiceItem,
  LodgifyAvailabilityPeriod,
  PaymentMethod,
  PropertyListing,
  Property,
  LodgifyPropertyAvailabilities,
  LodgifyQuote,
  LodgifyError,
  SanityImage,
  StripePaymentIntent,
} from "types";
import { stripe } from "../stripe";
import type {
  PrismaClient,
  Prisma,
  Property as PropertyIdentifier,
} from "@prisma/client";

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
          name, slug, occupancy, mainImage, coords, preview, description, images
      }`;

      const property: Property = await ctx.sanityClient.fetch(propertyQuery, {
        slug: input.slug,
      });

      return property;
    }),
  getAllProperties: publicProcedure.query(async ({ ctx }) => {
    const allPropertiesQuery = groq`
      *[_type == 'property'] {
        name, slug, occupancy, mainImage, coords, preview
    }`;

    const properties: PropertyListing[] = await ctx.sanityClient.fetch(
      allPropertiesQuery
    );

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
        const lodgifyPropertyAvailabilities = (await fetch(
          // Get all availabilities - https://docs.lodgify.com/reference/getcalendarbyuser
          `https://api.lodgify.com/v2/availability?start=${input.startDate}&end=${input.endDate}&includeDetails=false`,
          {
            method: "GET",
            headers: lodgifyHeaders,
          }
        ).then((response) =>
          response.json()
        )) as LodgifyPropertyAvailabilities[];

        const availablePropertiesLodgifyIds: number[] = [];
        for (const property of lodgifyPropertyAvailabilities) {
          const available = !property.periods.some(
            (period: LodgifyAvailabilityPeriod) =>
              period.available === 0 && period.start !== input.endDate // edge case: API returns {available: 0} for a range of 1 day if the next booking starts on your endDate param
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
        // Use Promise.all() to fetch prices while sanity is fetching Listing info: https://chat.openai.com/share/1f94a5a3-500c-4d33-833c-0824c01f1fbe
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

        const availableListings: PropertyListing[] =
          await ctx.sanityClient.fetch(listingsQuery, {
            availablePropertiesSanityIds,
          });

        return availableListings;
      } catch (error) {
        console.error(error);
        throw new Error(
          `Failed to fetch available properties. Error: ${error as string}`
        );
      }
    }),
  getBlockedDatesForProperty: publicProcedure
    .input(
      z.object({
        slug: z.string(),
        startDate: z.string(),
        endDate: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const property = await getPropertyBySlug(ctx.prisma, input.slug);

      const { lodgifyPropertyId } = property;

      const availabilityPeriods = (await fetch(
        // Get all availabilities - https://docs.lodgify.com/reference/getcalendarbyuser
        `https://api.lodgify.com/v2/availability/${lodgifyPropertyId}?start=${input.startDate}&end=${input.endDate}&includeDetails=false`,
        {
          method: "GET",
          headers: lodgifyHeaders,
        }
      ).then((response) => response.json())) as LodgifyPropertyAvailabilities[];

      const unavailablePeriods = availabilityPeriods[0]?.periods.filter(
        (period: LodgifyAvailabilityPeriod) => period.available === 0
      );

      const unavailableDateRanges = unavailablePeriods?.map(
        (period: LodgifyAvailabilityPeriod) => {
          return {
            startDate: utcDate(period.start),
            endDate: utcDate(period.end),
          };
        }
      );

      return unavailableDateRanges
        ? getDatesInRanges(unavailableDateRanges)
        : undefined;
    }),
  getQuote: publicProcedure
    .input(
      z.object({
        slug: z.string(),
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

      const property = await getPropertyBySlug(ctx.prisma, input.slug);
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

      return pricingInfo;
    }),
  getMainImage: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const imageQuery = groq`
        *[_type == 'property' && slug.current == $slug][0] {
          mainImage
      }`;

      const { mainImage }: { mainImage: SanityImage } =
        await ctx.sanityClient.fetch(imageQuery, {
          slug: input.slug,
        });

      return mainImage;
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
          propertySlug: input.slug,
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
    .query(async ({ input }) => {
      const paymentIntent = (await stripe.paymentIntents.retrieve(
        input.paymentIntent
      )) as StripePaymentIntent;

      const {
        payment_method,
        created,
        metadata: {
          propertyName,
          propertySlug,
          totalPrice,
          pricePerNight,
          pricing,
          arrival,
          departure,
        },
        receipt_email: email,
        shipping,
      } = paymentIntent;

      const { name, phone } = shipping || { name: null, phone: null };

      const paymentMethodPromise =
        stripe.paymentMethods.retrieve(payment_method);

      const priceDetails = JSON.parse(pricing as string) as Record<
        string,
        number
      >[];
      const amountDetails: { [key: string]: number } = {};
      priceDetails.forEach((item) => {
        const key: string = Object.keys(item)[0] ?? "";
        const value: number = item[key] ?? 0;
        amountDetails[key] = value;
      });

      const createdDate = new Date(0);
      createdDate.setUTCSeconds(created);

      let brand = "";
      let exp_month = 0;
      let exp_year = 0;
      let last4 = "";

      const paymentMethodInfo = await paymentMethodPromise;
      const isCard = paymentMethodInfo.type === "card";

      if (isCard) {
        if (paymentMethodInfo.card) {
          ({
            card: { brand, exp_month, exp_year, last4 },
          } = paymentMethodInfo);
        }
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
          name: name ?? "",
          email: email ?? "",
          phone: phone ?? "",
        },
        propertyName: propertyName ?? "",
        propertySlug: propertySlug ?? "",
        dates: { arrival: arrival ?? "", departure: departure ?? "" },
        totalPrice: totalPrice ?? "",
        amountDetails,
        pricePerNight: pricePerNight ?? "",
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
        guestEmail: z.string(),
        guestPhone: z.string(),
        arrival: z.string(),
        departure: z.string(),
        totalPrice: z.string(),
      })
    )
    .query(async ({ input }) => {
      const {
        propertyId,
        roomId,
        guestName,
        guestEmail,
        guestPhone,
        arrival,
        departure,
        totalPrice,
      } = input;

      const bookingId = (await fetch(
        // Creates a booking - https://docs.lodgify.com/reference/post_v1-reservation-booking-1
        `https://api.lodgify.com/v1/reservation/booking`,
        {
          method: "POST",
          headers: { ...lodgifyHeaders, "content-type": "application/*+json" },
          body: `{"rooms":[{"room_type_id":${roomId}}],"guest":{"name":"${guestName}","email":"${guestEmail}","phone":"${guestPhone}"},"source":"Manual","source_text":"mastelavacations.com","arrival":"${arrival}","departure":"${departure}","property_id":${propertyId},"status":"Booked","total":${parseFloat(
            totalPrice
          )},"currency_code":"usd","origin":"Mastela Vacations Site"}`,
        }
      ).then((response) => response.json())) as number | LodgifyError;

      return bookingId;
    }),
});

const getPropertyBySlug = async (
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >,
  slug: string
) => {
  const property = await prisma.property.findFirst({
    where: {
      slug: slug,
    },
  });

  if (!property) {
    throw new Error(`Failed to fetch property from database [${slug}]`);
  }

  return property;
};

const getLodgifyQuote = async (
  property: PropertyIdentifier,
  startDate: string,
  endDate: string
) => {
  const { lodgifyPropertyId, lodgifyRoomId } = property;

  const quote = (await fetch(
    // Gets a quote - https://docs.lodgify.com/reference/get_v2-quote-propertyid
    `https://api.lodgify.com/v2/quote/${lodgifyPropertyId}?arrival=${startDate}&departure=${endDate}&roomTypes[0].Id=${lodgifyRoomId}&roomTypes[0].People=4`,
    {
      method: "GET",
      headers: lodgifyHeaders,
    }
  ).then((response) => response.json())) as LodgifyQuote[] | LodgifyError;

  if (isLodgifyError(quote)) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: quote.message + `, please change your selection.`,
    });
  }

  return quote;
};

function calculateLodgifyPricingInfo(
  quote: LodgifyQuote[],
  propertyName: string,
  startDate: string,
  endDate: string
) {
  const { total_including_vat: totalPrice, room_types } = quote[0] ?? {
    total_including_vat: 0,
    room_types: [{ price_types: [] }],
  };

  const invoiceItems: InvoiceItem[] =
    room_types[0]?.price_types.filter(
      (invoiceItem: InvoiceItem) => invoiceItem.subtotal > 0
    ) ?? []; // TODO: Add discount items (remove filter)

  const numNights = differenceInDays(new Date(endDate), new Date(startDate));

  let pricePerNight = "";
  for (const invoiceItem of invoiceItems) {
    if (invoiceItem.prices.length === 1) {
      invoiceItem.description =
        invoiceItem.prices[0]?.description || invoiceItem.description;
    }
    for (const subItem of invoiceItem.prices) {
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

function getDatesInRanges(dateRanges: DateRange[]) {
  const dates = [];

  for (const dateRange of dateRanges) {
    const startDate = dateRange.startDate.getTime();
    const endDate = dateRange.endDate.getTime();

    for (
      let date = startDate + 24 * 60 * 60 * 1000;
      date <= endDate;
      date += 24 * 60 * 60 * 1000
    ) {
      dates.push(new Date(date));
    }
  }

  return dates;
}

function isLodgifyError(
  error: LodgifyQuote[] | LodgifyError
): error is LodgifyError {
  return typeof error === "object" && error !== null && "code" in error;
}
