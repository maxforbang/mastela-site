import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import sanityClient from "../../../../sanity/lib/sanityClient";
import { env } from "~/env.mjs";
import { groq } from "next-sanity";
import { differenceInDays } from "date-fns";
import { formatCurrency } from "~/utils/functions/formatCurrency";
import { TRPCError } from "@trpc/server";
import { BookingPrice, InvoiceItem } from "types";

const lodgifyHeaders = {
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

      const property = await ctx.prisma.property.findFirst({
        where: {
          slug: input.slug,
        },
      });

      const { lodgifyPropertyId, lodgifyRoomId } = property;

      const quote = await fetch(
        // Gets a quote - https://docs.lodgify.com/reference/get_v2-quote-propertyid
        `https://api.lodgify.com/v2/quote/${lodgifyPropertyId}?arrival=${input.startDate}&departure=${input.endDate}&roomTypes[0].Id=${lodgifyRoomId}&roomTypes[0].People=4`,
        {
          method: "GET",
          headers: lodgifyHeaders,
        }
      ).then((response) => response.json());
      
      
      if (quote.code === 666) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: quote.message + `, please change your selection.`//${property.name} from ${input.startDate} to ${input.endDate}`,
        });
      }

      let { total_including_vat: totalPrice, room_types } = quote[0];
      const invoiceItems: InvoiceItem[] = room_types[0].price_types.filter(invoiceItem => invoiceItem.subtotal > 0);

      const numNights = differenceInDays(
        new Date(input.endDate),
        new Date(input.startDate)
      );

      let pricePerNight = "";
      findRoomRate: for (let invoiceItem of invoiceItems) {
        for (let subItem of invoiceItem.prices) {
          if (subItem.room_rate_type === 0) {
            pricePerNight = formatCurrency(subItem.amount / numNights);
            break findRoomRate;
          }
        }
      }

      const bookingPrice: BookingPrice = {
        invoiceItems,
        pricePerNight,
        totalPrice,
      };

      return bookingPrice;
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
});


