import Layout from "~/components/Layout";
import type { NextPageWithLayout } from "../_app";
import type { ReactElement } from "react";
import { BlogCategory } from "types";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import sanityClient from "../../../sanity/lib/sanityClient";
import BlogPostsContent from "~/components/blog/BlogPostsContent";
import {
  allArticlesCategoryQuery, featuredCategoriesQuery
} from "~/utils/sanityQueries";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { blogRouter } from "~/server/api/routers/blog";
import { prisma } from "~/server/db";
import { DehydratedState } from "@tanstack/react-query";
import { api } from "~/utils/api";

type BlogPostsPageProps = {
  trpcState: DehydratedState;
  searchString: string;
  categories: BlogCategory[];
  currentCategory: BlogCategory;
};

const BlogPostsPage: NextPageWithLayout<BlogPostsPageProps> = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { categories, currentCategory, searchString } = props;

  const { data: { posts = [] } = {}, isLoading } = api.blog.getPosts.useQuery({
    searchString: searchString as string,
  });

  return <BlogPostsContent props={{ posts, categories, currentCategory, postsLoading: isLoading, searchString: searchString as string }} />;
};

export default BlogPostsPage;

BlogPostsPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const searchString = context.query?.search || "";

  const helpers = createServerSideHelpers({
    router: blogRouter,
    ctx: { prisma, sanityClient },
  });

  await helpers.getPosts.prefetch({ searchString: searchString as string });

  const categories: BlogCategory[] = await sanityClient.fetch(
    featuredCategoriesQuery
  );

  const currentCategory: BlogCategory = await sanityClient.fetch(
    allArticlesCategoryQuery

    
  );

  return {
    props: {
      trpcState: helpers.dehydrate(),
      searchString: searchString,
      currentCategory,
      categories,
    },
  };
}

// *[_type == 'category' && slug.current in ["dining", "beaches", "events"]] {
//   slug
// }
