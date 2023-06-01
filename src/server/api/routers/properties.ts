import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import sanityClient from "~/server/sanityClient";

export const propertiesRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    const properties =  sanityClient.fetch('*')
    return properties;
  }),
});
