import Layout from "~/components/Layout";
import type { NextPageWithLayout } from "../_app";
import type { ReactElement } from "react";
import {
  BarsArrowUpIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import { classNames } from "~/utils/functions/functions";
import Link from "next/link";
import { BlogCategory, BlogPost, Slug } from "types";
import { useRouter } from "next/router";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import sanityClient from "../../../sanity/lib/sanityClient";
import { groq } from "next-sanity";
import { formatDateEnglish } from "~/utils/functions/dates/formatDateEnglish";
import { urlFor } from "../../../sanity/lib/urlFor";
import Image from "next/image";

type BlogPostsPageProps = {
  posts: BlogPost[];
  categories: BlogCategory[];
  currentCategory: BlogCategory;
};

const BlogPostsPage: NextPageWithLayout<BlogPostsPageProps> = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  const { posts, categories, currentCategory } = props;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex w-full justify-between">
          <div className="flex w-full flex-col border-b py-7">
            <h2 className="text-3xl  font-bold  tracking-tight text-gray-900 sm:text-4xl">
              {currentCategory?.slug?.current === "all-articles"
                ? "Cape Coral Guide"
                : currentCategory?.title}
            </h2>
            <p className="mt-3 text-lg leading-8 text-gray-600">
              {currentCategory?.description}
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-between py-10 md:flex-row">
          <div className="flex flex-wrap items-center gap-x-6 text-xs">
            {categories.map((category) => (
              <Link
                href="/cape-coral-guides/[category]"
                as={`/cape-coral-guides/${category.slug?.current}`}
                className={classNames(
                  "relative z-10 rounded-full  px-3 py-1.5 text-xl font-medium text-gray-600 hover:bg-gray-100",
                  currentCategory?.slug.current === category.slug.current
                    ? "pointer-events-none bg-sky-500 text-white shadow"
                    : ""
                )}
              >
                {category.title}
              </Link>
            ))}
          </div>
          <BlogSearchBar />
        </div>
        <div className="mx-auto grid grid-cols-1 gap-x-8 gap-y-20 py-2 sm:grid-cols-2 lg:mx-0 lg:grid-cols-3">
          {posts.map((post) => {
            const {
              mainImage,
              publishedAt,
              slug,
              categories,
              title,
              textPreview,
              author,
            } = post;

            const postImageUrl = mainImage
              ? urlFor(mainImage).width(768).height(520).url()
              : "";

            const authorImageUrl = author?.image
              ? urlFor(author.image).width(80).height(80).url()
              : "";

            return (
              <article
                key={`${slug?.current}-blog-card`}
                className="flex flex-col items-start justify-between"
              >
                <div className="relative aspect-[16/9] w-full lg:aspect-[3/2]">
                  <Image
                    fill
                    src={
                      postImageUrl
                      // "https://images.unsplash.com/photo-1613722434757-e6990063b306?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=988&q=80"
                    }
                    alt={mainImage.alt}
                    className=" w-full rounded-2xl bg-gray-100 object-cover "
                  />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                </div>
                <div className="max-w-xl">
                  <div className="mt-8 flex items-center gap-4 text-xs">
                    <time dateTime={publishedAt} className="text-gray-500">
                      {formatDateEnglish(publishedAt)}
                    </time>
                    {/* TODO: Map over all categories for post instead of just first one */}
                    <div className="flex flex-wrap gap-3">
                      {categories.slice(0, 3).map((category) => {
                        return (
                          <Link
                            href={`/cape-coral-guides/[category]`}
                            as={`/cape-coral-guides/${
                              category?.slug?.current ?? "all-articles"
                            }`}
                            className="relative z-10 rounded-full bg-gray-100 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-300"
                          >
                            {category?.title}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                  <div className="group relative">
                    <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                      <Link
                        href={`/cape-coral-guides/[slug]`}
                        as={`/cape-coral-guides/${slug?.current}`}
                      >
                        <span className="absolute inset-0" />
                        {title}
                      </Link>
                    </h3>
                    <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                      {textPreview}
                    </p>
                  </div>
                  <div className="relative mt-8 flex items-center gap-x-4">
                    {/* Sanity Image */}
                    <Image
                      src={authorImageUrl}
                      alt=""
                      height={40}
                      width={40}
                      className="rounded-full bg-white"
                    />
                    <div className="text-sm leading-6">
                      <p className="font-semibold text-gray-900">
                        {/* Link to bio pages for authors (/team/thomas-forbang) */}
                        <Link href={"/" + author?.slug.current}>
                          <span className="absolute inset-0" />
                          {author?.name}
                        </Link>
                      </p>
                      <p className="text-gray-600">{author?.role}</p>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BlogPostsPage;

BlogPostsPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export function BlogSearchBar({ sort = true }) {
  return (
    <div className="items-center sm:flex sm:justify-between">
      <h3 className="text-base font-semibold leading-6 text-gray-900"></h3>
      <div className="mt-12 sm:ml-3 sm:mt-0">
        <label htmlFor="mobile-search-candidate" className="sr-only">
          Search
        </label>
        <label htmlFor="desktop-search-candidate" className="sr-only">
          Search
        </label>
        <div className="flex rounded-md shadow-sm">
          <div className="relative flex-grow focus-within:z-10">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <input
              type="text"
              name="mobile-search-candidate"
              id="mobile-search-candidate"
              className={classNames(
                !sort ? "rounded-md" : "",
                "block w-full rounded-l-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:hidden"
              )}
              placeholder="Search"
            />
            <input
              type="text"
              name="desktop-search-candidate"
              id="desktop-search-candidate"
              className={classNames(
                !sort ? "rounded-md" : "",
                "hidden w-full rounded-l-md border-0 py-1.5 pl-10 text-sm leading-6 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:block"
              )}
              placeholder="Search..."
            />
          </div>
          <button
            type="button"
            className={classNames(
              !sort ? "hidden" : "",
              "relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            )}
          >
            <BarsArrowUpIcon
              className="-ml-0.5 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            Sort
            <ChevronDownIcon
              className="-mr-1 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

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
  const isAllPosts = !category || category === "all-articles";

  const postsOfCategoryQuery = groq`*[_type == 'post' && $category in categories[]->slug.current && dateTime(publishedAt) <= dateTime(now())] | order(publishedAt desc) {
    title,
    author->{name, slug, image, role},
    "categories": categories[]->{title, slug},
    mainImage,
    "textPreview": body[style == 'normal'][0].children[0].text, 
    publishedAt,
    slug,
  }`;

  const allPostsQuery = groq`*[_type == 'post' && dateTime(publishedAt) <= dateTime(now())] | order(publishedAt desc) {
    title,
    author->{name, slug, image, role},
    "categories": categories[]->{title, slug},
    mainImage,
    "textPreview": body[style == 'normal'][0].children[0].text, 
    publishedAt,
    slug,
  }`;

  const featuredCategoriesQuery = groq`*[_type == 'category' && slug != null] | order(priority asc, slug.current asc) 
  {
    title,
    slug,
  }`;

  const currentCategoryQuery = groq`*[_type == 'category' && slug.current == $category][0] {
    title,
    slug,
    description,
  }`;

  const posts: BlogPost[] = await sanityClient.fetch(
    isAllPosts ? allPostsQuery : postsOfCategoryQuery,
    {
      category,
    }
  );

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
    revalidate: 60
  };
}

// *[_type == 'category' && slug.current in ["dining", "beaches", "events"]] {
//   slug
// }
