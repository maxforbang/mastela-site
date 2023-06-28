import Layout from "~/components/Layout";
import type { NextPageWithLayout } from "../_app";
import type { ReactElement } from "react";
import { groq } from "next-sanity";
import sanityClient from "../../../sanity/lib/sanityClient";
import { BlogPost, Slug } from "types";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { PortableText } from "@portabletext/react";
import { urlFor } from "../../../sanity/lib/urlFor";
import Image from "next/image";
import Link from "next/link";
import { TypedObject } from "sanity";
import BlogPostPreview from "~/components/blog/BlogPostPreview";

type ArticlePageProps = {
  post: BlogPost;
  suggestedPosts: BlogPost[];
};

const ArticlePage: NextPageWithLayout<ArticlePageProps> = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  const { post, suggestedPosts } = props;

  return (
    <div>
      <Article post={post} />
      <SuggestedPosts suggestedPosts={suggestedPosts} />
    </div>
  );
};

export default ArticlePage;

ArticlePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export async function getStaticPaths() {
  const postSlugsQuery = groq`*[_type == 'post' && slug != null && dateTime(publishedAt) <= dateTime(now())] {
    slug
  }`;

  const postSlugs: { slug: Slug }[] = await sanityClient.fetch(postSlugsQuery);

  const paths = postSlugs.map((post) => ({
    params: { slug: post.slug.current },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps(
  context: GetStaticPropsContext<{ slug: string }>
) {
  const slug = context.params?.slug;

  const postQuery = groq`*[_type == 'post' && slug.current == $slug][0] {
    title,
    author->{name, slug, image, role, bio},
    "categories": categories[]->{title, slug},
    mainImage,
    body,
    publishedAt,
    slug,
  }`;

  const suggestedPostsFromCategory = groq`*[_type == 'post' && dateTime(publishedAt) <= dateTime(now()) && slug.current != $slug && $category in categories[]->slug.current ][0..2] | order(publishedAt desc) {
  title,
  author->{name, slug, image, role},
  "categories": categories[]->{title, slug},
  mainImage,
  "textPreview": body[style == 'normal'][0].children[0].text, 
  publishedAt,
  slug,
}`;

  const post: BlogPost = await sanityClient.fetch(postQuery, {
    slug,
  });

  const suggestedCategory = (post.categories && post.categories[0]?.slug?.current) ?? "activities"

  const suggestedPosts: BlogPost[] = await sanityClient.fetch(
    suggestedPostsFromCategory,
    {
      category: suggestedCategory,
      slug: post.slug.current,
    }
  );

  return {
    props: {
      post,
      suggestedPosts,
    },
    revalidate: 60,
  };
}

function Article({ post }: { post: BlogPost }) {
  const { body, mainImage, author } = post;
  const firstParagraph = body?.find((child) => child.style === "normal");
  const introductionIndex = firstParagraph
    ? body?.indexOf(firstParagraph) ?? 1
    : 1;

  const postImageUrl = mainImage
    ? urlFor(mainImage).width(1024).height(768).url()
    : "";

  const authorImageUrl = author?.image
    ? urlFor(author.image).width(320).height(320).url()
    : "";

  return (
    <div className="bg-white px-6 py-16 lg:px-8">
      <article className="prose mx-auto max-w-3xl text-base leading-7 text-gray-700">
        <PortableText
          value={body?.slice(0, introductionIndex + 1) as TypedObject[]}
        />
        <div className="relative mb-24 aspect-[16/9] w-full lg:aspect-[3/2]">
          <Image
            fill
            src={postImageUrl}
            alt={mainImage.alt}
            className=" w-full rounded-2xl bg-gray-100 object-cover "
          />
        </div>
        <PortableText
          value={body?.slice(introductionIndex + 1) as TypedObject[]}
        />
        <div className="relative mt-8 flex items-center gap-x-4">
          {/* Sanity Image */}
          <Image
            src={authorImageUrl}
            alt=""
            height={320}
            width={320}
            className="rounded-full bg-white"
          />
          <div className="text-sm leading-6">
            <p className="-mb-2 text-xl font-semibold text-gray-900">
              {/* Link to bio pages for authors (/team/thomas-forbang) */}
              <Link href={"/" + author?.slug.current}>
                <span className="absolute inset-0" />
                {author?.name}
              </Link>
            </p>
            <PortableText value={author?.bio as TypedObject[]} />
          </div>
        </div>
      </article>
    </div>
  );
}

const posts = [
  {
    id: 1,
    title: "Boost your conversion rate",
    href: "#",
    description:
      "Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.",
    imageUrl:
      "https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3603&q=80",
    date: "Mar 16, 2020",
    datetime: "2020-03-16",
    category: { title: "Marketing", href: "#" },
    author: {
      name: "Michael Foster",
      role: "Co-Founder / CTO",
      href: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    id: 1,
    title: "Boost your conversion rate",
    href: "#",
    description:
      "Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.",
    imageUrl:
      "https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3603&q=80",
    date: "Mar 16, 2020",
    datetime: "2020-03-16",
    category: { title: "Marketing", href: "#" },
    author: {
      name: "Michael Foster",
      role: "Co-Founder / CTO",
      href: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    id: 1,
    title: "Boost your conversion rate",
    href: "#",
    description:
      "Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.",
    imageUrl:
      "https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3603&q=80",
    date: "Mar 16, 2020",
    datetime: "2020-03-16",
    category: { title: "Marketing", href: "#" },
    author: {
      name: "Michael Foster",
      role: "Co-Founder / CTO",
      href: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  // More posts...
];

function SuggestedPosts({ suggestedPosts }: { suggestedPosts: BlogPost[] }) {
  return (
    <div className="border-t bg-white py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            More posts like this
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            All the information you need to take Cape Coral by storm.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {suggestedPosts.map((post) => (
            <BlogPostPreview key={`blog-post-preview-${post?.slug?.current}`} post={post} />
          ))}
        </div>

        
      </div>
    </div>
  );
}
