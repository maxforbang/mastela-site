import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function BlogSection() {
  const posts = [
    {
      id: "post-1",
      title: "Best family-friend beaches in Cape Coral",
      href: "/cape-coral-guide",
      description:
        "Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.",
      imageUrl:
        "https://images.unsplash.com/photo-1472586662442-3eec04b9dbda?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&h=640&q=80",
      date: "Mar 16, 2023",
      datetime: "2020-03-16",
      author: {
        name: "Mastela Vacations",
        imageUrl: "/favicon.png",
      },
    },
    {
      id: "post-2",
      title: "Fourth of July Activities near Cape Coral & Fort Meyers",
      href: "/cape-coral-guide",
      description:
        "Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.",
      imageUrl:
        "https://images.unsplash.com/photo-1473090826765-d54ac2fdc1eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&h=1000&q=80",
      date: "Jun 16, 2023",
      datetime: "2020-03-16",
      author: {
        name: "Mastela Vacations",
        imageUrl: "/favicon.png",
      },
    },
    {
      id: "post-3",
      title: "Must-see hiking locations while staying in Cape Coral",
      href: "/cape-coral-guide",
      description:
        "Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.",
      imageUrl:
        "https://images.unsplash.com/photo-1611024847487-e26177381a3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&h-640&q=80",
      date: "May, 29th, 2023",
      datetime: "2020-03-16",
      author: {
        name: "Mastela Vacations",
        imageUrl: "/favicon.png",
      },
    },

    // More posts...
  ];

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
          {posts.map((post) => (
            <article
              key={post.id}
              className="relative isolate flex transform cursor-pointer flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pb-8 pt-80 transition duration-300 ease-out hover:scale-105 sm:pt-48 lg:pt-80"
            >
              <Link href="/cape-coral-guide" >
                
                <Image
                fill
                  src={post.imageUrl}
                  alt=""
                  className="absolute h-full w-full inset-0 -z-10  object-cover"
                />
                
              </Link>
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40" />
              <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10" />

              <div className="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm leading-6 text-gray-300">
                <time dateTime={post.datetime} className="mr-8">
                  {post.date}
                </time>
                <div className="-ml-4 flex items-center gap-x-4">
                  <svg
                    viewBox="0 0 2 2"
                    className="-ml-0.5 h-0.5 w-0.5 flex-none fill-white/50"
                  >
                    <circle cx={1} cy={1} r={1} />
                  </svg>
                  <div className="flex gap-x-2.5">
                    <div className="relative h-6 w-6 flex-none">
                      <Image
                        fill
                        src={post.author.imageUrl}
                        alt=""
                        className="h-6 w-6 flex-none rounded-full bg-white/10"
                      />
                    </div>
                    {post.author.name}
                  </div>
                </div>
              </div>
              <h3 className="mt-3 text-lg font-semibold leading-6 text-white">
                <Link href={post.href}>
                  <span className="absolute inset-0" />
                  {post.title}
                </Link>
              </h3>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
