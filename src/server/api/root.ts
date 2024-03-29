import { propertiesRouter } from "~/server/api/routers/properties";
import { createTRPCRouter } from "~/server/api/trpc";
import { blogRouter } from "./routers/blog";
import { emailRouter } from "./routers/email";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  properties: propertiesRouter,
  blog: blogRouter,
  email: emailRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
