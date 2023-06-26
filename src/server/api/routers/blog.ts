import { BlogCategory, BlogPost } from "types";
import { createTRPCRouter, publicProcedure } from "../trpc";
import {
  allArticlesCategoryQuery,
  allPostsQuery,
  featuredCategoriesQuery,
  searchPostsQuery,
} from "~/utils/sanityQueries";
import { z } from "zod";

export const blogRouter = createTRPCRouter({
  // getPosts: publicProcedure.query(async ({ ctx }) => {
  //   const posts: BlogPost[] = await ctx.sanityClient.fetch(allPostsQuery);

  //   const categories: BlogCategory[] = await ctx.sanityClient.fetch(
  //     featuredCategoriesQuery
  //   );

  //   const currentCategory: BlogCategory = await ctx.sanityClient.fetch(
  //     allArticlesCategoryQuery
  //   );

  //   return { posts, categories, currentCategory };
  // }),
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
