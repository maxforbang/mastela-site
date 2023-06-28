import Image from "next/image";
import Link from "next/link";
import React from "react";
import { urlFor } from "../../../sanity/lib/urlFor";
import { BlogPost } from "types";
import { formatDateEnglish } from "~/utils/functions/dates/formatDateEnglish";

export default function BlogSection({ blogPosts }: { blogPosts: BlogPost[] }) {
  return (
    <div className="bg-white py-16 ">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Explore Cape Coral
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            See some of our featured guides on making the most of your vacation.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {blogPosts.map((post) => {
            const { mainImage, publishedAt, slug, title, author, calendarEvent } = post;

            const postImageUrl = mainImage
              ? urlFor(mainImage).width(1050).height(700).url()
              : "";

            const authorImageUrl = author?.image
              ? urlFor(author.image).width(80).height(80).url()
              : "";

            return (
              <article
                key={`blog-post-preview-${slug?.current}`}
                className="relative isolate flex transform cursor-pointer flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pb-8 pt-80 transition duration-300 ease-out hover:scale-105 sm:pt-48 lg:pt-80"
              >
                { calendarEvent?.isCalendarEvent && calendarEvent?.dateChangesAnnually ?
                  <div className="absolute right-10 top-7">
                    <p className="animate-pulse text-2xl font-bold italic text-white">
                      Event {formatDateEnglish(calendarEvent.eventDate)}
                    </p>
                  </div> : null
                }

                <Link href="/cape-coral-guide">
                  <Image
                    fill
                    src={postImageUrl}
                    alt={post?.mainImage?.alt}
                    className="absolute inset-0 -z-10 h-full w-full  object-cover"
                  />
                </Link>
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40" />
                <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10" />

                <div className="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm leading-6 text-gray-300">
                  <time dateTime={publishedAt} className="mr-8">
                    {formatDateEnglish(publishedAt)}
                  </time>
                  <div className="-ml-4 flex items-center gap-x-4">
                    <div className="flex gap-x-2.5">
                      <div className="relative h-6 w-6 flex-none">
                        <Image
                          fill
                          src={authorImageUrl}
                          alt={author?.image?.alt}
                          className="h-6 w-6 flex-none rounded-full"
                        />
                      </div>
                      {author?.name}
                    </div>
                  </div>
                </div>
                <h3 className="mt-3 text-lg font-semibold leading-6 text-white">
                  <Link href={`/cape-coral-guide/${slug.current}`}>
                    <span className="absolute inset-0" />
                    {title}
                  </Link>
                </h3>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
