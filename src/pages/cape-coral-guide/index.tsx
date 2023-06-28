import Layout from "~/components/Layout";
import type { NextPageWithLayout } from "../_app";
import type { ReactElement } from "react";
import Link from "next/link";
import { classNames } from "~/utils/functions/functions";
import { BlogCategory } from "types";
import Image from "next/image";
import sanityClient from "../../../sanity/lib/sanityClient";
import { InferGetStaticPropsType } from "next/types";
import { groq } from "next-sanity";
import { urlFor } from "../../../sanity/lib/urlFor";
import { BlogSearchBar } from "~/components/blog/BlogSearchBar";

type BlogPageProps = {
  categories: BlogCategory[];
};

const BlogPage: NextPageWithLayout<BlogPageProps> = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  const { categories } = props;

  return (
    <div className="bg-white py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto pb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Explore Cape Coral
            </h2>
            <div className="hidden md:block">
              <BlogSearchBar sort={false} />
            </div>
          </div>
          <p className="mt-5 hidden text-lg leading-8 text-gray-600 sm:block">
            Explore the stunning islands of Sanibel and Captiva, or venture into
            the Gulf of Mexico to discover hidden gems like Cayo Costa. Cape
            Coral offers something for everyone, from exciting water sports to
            charming downtown shops and top-rated restaurants. Unwind in your
            vacation rental and soak in the breathtaking sunset views, or embark
            on thrilling adventures.
          </p>
        </div>
        <div className=" my-4 grid grid-cols-2 gap-5 sm:my-6 md:grid-cols-3 ">
          {categories?.map((category) => {
            return (
              <CategoryCard
                key={`category-card-${category?.slug?.current}`}
                category={category}
              />
            );
          })}
        </div>
        <div className="ml-auto mt-10 w-max">
          <Link
            href="/cape-coral-guides"
            className="text-xl font-semibold leading-7 hover:opacity-60 duration-100 ease-out"
          >
            View all guides <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;

BlogPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

function CategoryCard({ category }: { category: BlogCategory }) {
  const imageUrl = category.image
    ? urlFor(category.image).width(784).height(512).url()
    : "";

  // TODO: Add Tilt.js with glare effect
  return (
    <Link
      href="/cape-coral-guides/[category]"
      as={`/cape-coral-guides/${category?.slug?.current}`}
    >
      <section>
        <div
          className={classNames(
            "relative mx-auto h-52 transform cursor-pointer overflow-hidden rounded-2xl shadow-md transition duration-300 ease-out hover:scale-102 hover:drop-shadow-2xl first-of-type:hover:z-10 md:h-64"
          )}
        >
          <Image
            className="rounded-2xl"
            fill
            style={{ objectFit: "cover" }}
            src={imageUrl}
            alt={category?.image?.alt ?? "cape coral guide category picture"}
          />
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black bg-opacity-30 hover:bg-opacity-10 transition duration-300 ease-out">
            <p className="w-2/3 text-center text-4xl font-semibold text-white  [text-shadow:_0_4px_1px_rgb(0_0_0_/_50%)]">
              {category?.title}
            </p>
          </div>
        </div>
      </section>
    </Link>
  );
}

export async function getStaticProps() {
  const onlyFeaturedCategoriesQuery = groq`*[_type == 'category' && slug != null] {
    title,
    slug,
    image
  }`;

  const categories: BlogCategory[] = await sanityClient.fetch(
    onlyFeaturedCategoriesQuery
  );

  // await helpers.getProperty.prefetch({ slug: slug });

  return {
    props: {
      // trpcState: helpers.dehydrate(),
      categories: categories.sort((category1, category2) => {
        return category1.slug.current.localeCompare(category2.slug.current);
      }),
    },
  };
}
