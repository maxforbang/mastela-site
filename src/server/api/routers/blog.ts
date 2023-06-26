import { BlogPost } from "types";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { allPostsQuery } from "~/utils/sanityQueries";

export const blogRouter = createTRPCRouter({
  getPosts: publicProcedure.query(async ({ ctx }) => {
    const posts: BlogPost[] = await ctx.sanityClient.fetch(allPostsQuery);
    return posts
  }),
});
