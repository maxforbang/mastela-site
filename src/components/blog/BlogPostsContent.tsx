import Link from "next/link";
import { classNames } from "~/utils/functions/functions";

import { BlogSearchBar } from "~/components/blog/BlogSearchBar";
import { BlogCategory, BlogPost } from "types";
import BlogPostPreview from "./BlogPostPreview";
import SkeletonBlogPostPreview from "./SkeletonBlogPostPreview";

type BlogPostsPageProps = {
  posts: BlogPost[];
  categories: BlogCategory[];
  currentCategory: BlogCategory;
  postsLoading?: boolean;
  searchString?: string;
};

export default function BlogPostsContent({
  props,
}: {
  props: BlogPostsPageProps;
}) {
  const { posts, categories, currentCategory, postsLoading, searchString } =
    props;

  return (
    <div className="bg-white">
      <div className="mx-auto mt-2 max-w-7xl px-6 lg:px-8">
        <div className="flex w-full justify-between">
          <div className="flex w-full flex-col border-b py-7">
            <h2 className="text-3xl  font-bold  tracking-tight text-gray-900 sm:text-4xl">
              {currentCategory?.title === "All Articles"
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
            {categories?.map((category) => (
              <Link
                href={
                  category.slug?.current
                    ? "/cape-coral-guides/[category]"
                    : "/cape-coral-guides"
                }
                as={`/cape-coral-guides/${category.slug?.current ?? ""}`}
                className={classNames(
                  "relative z-10 rounded-full  px-3 py-1.5 text-xl font-medium text-gray-600 hover:bg-gray-100",
                  currentCategory?.slug?.current === category.slug?.current && !searchString?.length
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
        {!postsLoading && searchString?.length ? (
          <p className="-mt-2 ml-1 mb-2 text-xl font-medium text-gray-600">
            {posts?.length > 0
              ? `${posts.length} results for "${searchString}"`
              : `Zero results for "${searchString}"`}
          </p>
        ) : null}
        <div
          className={classNames(
            "mx-auto grid grid-cols-1 gap-x-8 gap-y-20 py-2 sm:grid-cols-2 lg:mx-0 lg:grid-cols-3"
          )}
        >
          {postsLoading ? (
            Array.from(Array(3)).map((_, index) => <SkeletonBlogPostPreview />)
          ) : posts.length ? (
            posts.map((post) => <BlogPostPreview post={post} />)
          ) : (
            <div className="h-80"></div>
          )}
        </div>
      </div>
    </div>
  );
}
