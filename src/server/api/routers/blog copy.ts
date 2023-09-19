import { BlogPost } from "types";
import { createTRPCRouter, publicProcedure } from "../trpc";
import {
  allPostsQuery, searchPostsQuery
} from "~/utils/sanityQueries";
import { z } from "zod";

export const blogRouter = createTRPCRouter({
  getPosts: publicProcedure
    .input(
      z.object({
        searchString: z.optional(z.string()),
      })
    )
    .query(async ({ ctx, input }) => {
      const posts: BlogPost[] = await ctx.sanityClient.fetch(input.searchString?.length ? searchPostsQuery : allPostsQuery, {
        searchString: input.searchString ?? '',
      });

      return { posts };
    }),
});
