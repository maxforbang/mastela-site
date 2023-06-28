import Layout from "~/components/Layout";
import type { NextPageWithLayout } from "../_app";
import type { ReactElement } from "react";
import { BlogCategory, BlogPost, Slug } from "types";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import sanityClient from "../../../sanity/lib/sanityClient";
import { groq } from "next-sanity";
import BlogPostsContent from "~/components/blog/BlogPostsContent";
import { featuredCategoriesQuery } from "~/utils/sanityQueries";

type BlogPostsPageProps = {
  posts: BlogPost[];
  categories: BlogCategory[];
  currentCategory: BlogCategory;
};

const BlogPostsPage: NextPageWithLayout<BlogPostsPageProps> = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  return <BlogPostsContent props={props} />;
};

export default BlogPostsPage;

BlogPostsPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export async function getStaticPaths() {
  const featuredCategoriesQuery = groq`*[_type == 'category' && slug != null] {
    title,
    slug,


    
  }`;

  const categorySlugs: { slug: Slug }[] = await sanityClient.fetch(
    featuredCategoriesQuery
  );

  const paths = categorySlugs.map((category) => ({
    params: { category: category.slug.current },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps(
  context: GetStaticPropsContext<{ category: string }>
) {
  const category = context.params?.category || "";

  const postsOfCategoryQuery = groq`*[_type == 'post' && $category in categories[]->slug.current && dateTime(publishedAt) <= dateTime(now())] | order(publishedAt desc) {
    title,
    author->{name, slug, image, role},
    "categories": categories[]->{title, slug},
    mainImage,
    "textPreview": body[style == 'normal'][0].children[0].text, 
    publishedAt,
    slug,
  }`;

  const currentCategoryQuery = groq`*[_type == 'category' && slug.current == $category][0] {
    title,
    slug,
    description,
  }`;

  const posts: BlogPost[] = await sanityClient.fetch(postsOfCategoryQuery, {
    category,
  });

  const categories: BlogCategory[] = await sanityClient.fetch(
    featuredCategoriesQuery
  );

  const currentCategory: BlogCategory = await sanityClient.fetch(
    currentCategoryQuery,
    { category }
  );

  // await helpers.getProperty.prefetch({ slug: slug });

  return {
    props: {
      // trpcState: helpers.dehydrate(),
      posts,
      categories,
      currentCategory,
    },
    revalidate: 60,
  };
}

// *[_type == 'category' && slug.current in ["dining", "beaches", "events"]] {
//   slug
// }
