import Layout from "~/components/Layout";
import type { NextPageWithLayout } from "../_app";
import type { ReactElement } from "react";
import { BlogCategory, BlogPost } from "types";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import sanityClient from "../../../sanity/lib/sanityClient";
import { groq } from "next-sanity";
import BlogPostsContent from "~/components/blog/BlogPostsContent";
import { allPostsQuery, featuredCategoriesQuery } from "~/utils/sanityQueries";

type BlogPostsPageProps = {
  posts: BlogPost[];
  categories: BlogCategory[];
  currentCategory: BlogCategory;
};

const BlogPostsPage: NextPageWithLayout<BlogPostsPageProps> = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  return <BlogPostsContent props={props} />;
};

export default BlogPostsPage;

BlogPostsPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const searchString = context.query?.search;

  const searchPostsQuery = groq`*[_type == 'post' && dateTime(publishedAt) <= dateTime(now()) && (title match $searchString + "*" || body[].children[].text match $searchString)] {
    title,
    author->{name, slug, image, role},
    "categories": categories[]->{title, slug},
    mainImage,
    // TODO: make the text preview the same text that contains the matched searchString
    "textPreview": body[style == 'normal'][0].children[0].text, 
    //  "textPreview": body[_type == 'block' && children[]._type == 'span' && children[].text match $searchString][0].children[].text,

    publishedAt,
    slug,
  } | order(publishedAt desc) | score(title match $searchString + "*")`;

  const allArticlesCategoryQuery = groq`*[_type == 'category' && title == 'All Articles'][0] {
    title,
    slug,
    description,
  }`;

  const posts: BlogPost[] = await sanityClient.fetch(
    searchString ? searchPostsQuery : allPostsQuery,
    {
      searchString: searchString ?? "",
    }
  );

  const categories: BlogCategory[] = await sanityClient.fetch(
    featuredCategoriesQuery
  );

  const currentCategory: BlogCategory = await sanityClient.fetch(
    allArticlesCategoryQuery
  );

  // await helpers.getProperty.prefetch({ slug: slug });

  return {
    props: {
      // trpcState: helpers.dehydrate(),
      posts,
      categories,
      currentCategory,
    },
  };
}

// *[_type == 'category' && slug.current in ["dining", "beaches", "events"]] {
//   slug
// }
