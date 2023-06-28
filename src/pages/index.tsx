//TODO: Console cleanup (Observe browser console end-to-end, remove errors/warnings)
// 1. Unique key for each list in app
// 2. No unnecessary queries (calling queries with undefined)

import Layout from "~/components/Layout";
import type { NextPageWithLayout } from "./_app";
import type { ReactElement } from "react";
import AboutUsSection from "~/components/home/AboutUsSection";
import FAQSection from "~/components/home/FAQSection";
import PropertiesSection from "~/components/home/PropertiesSection";
import TestimonialsSection from "~/components/home/TestimonialsSection";
import AmenitiesSection from "~/components/home/AmenitiesSections";
import HeroSection from "~/components/home/HeroSection";
import SupportSection from "~/components/home/SupportSection";
import BlogSection from "~/components/home/BlogSection";
import { groq } from "next-sanity";
import sanityClient from "../../sanity/lib/sanityClient";
import { BlogPost } from "types";
import { InferGetStaticPropsType } from "next";
import { allPostsQuery } from "~/utils/sanityQueries";

type HomePageProps = {
  featuredPosts: BlogPost[];
};

const HomePage: NextPageWithLayout<HomePageProps> = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  const { featuredPosts } = props;

  return (
    <>
      <main className="mx-auto px-8 lg:px-12">
        <HeroSection />
        <AmenitiesSection />
        <AboutUsSection />
        <TestimonialsSection />
        <PropertiesSection />
        <BlogSection blogPosts={featuredPosts} />
        <FAQSection />
        <SupportSection />
      </main>
    </>
  );
};

export default HomePage;

HomePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export async function getStaticProps() {
  const secondsInADay = 60 * 60 * 24;
  // How far in advance you want to show a holiday post on the frontpage (in seconds)
  const featureLength = 14 * secondsInADay;

  const featuredPostsQueryCalendarEvents = groq`*[
    _type == 'post' &&
    (
      dateTime(publishedAt) <= dateTime(now()) &&
      calendarEvent.isCalendarEvent && 
      dateTime(calendarEvent.eventDate) > dateTime(now()) &&
      dateTime(calendarEvent.eventDate) <= dateTime(now()) + $featureLength
    ) 
  ] | order(priority desc, publishedAt desc)[0..2] {
    mainImage,
    publishedAt,
    slug,
    title,
    author-> {
      name, image
    },
    calendarEvent
  }  `;

  const featuredPosts: BlogPost[] = await sanityClient.fetch(
    featuredPostsQueryCalendarEvents,
    {
      featureLength: featureLength,
    }
  );

  // TODO: Replace morePosts below code once sanity.io land answers question on how to order posts based on boolean value.
  // Combine allPostsQuery and featuredPostsQueryCalendarEvents on this page into one: featuredPostsQuery

  const morePostsQuery = groq`*[_type == 'post' && !calendarEvent.isCalendarEvent && dateTime(publishedAt) <= dateTime(now())] | order(priority desc, publishedAt desc)[0..2] {
    title,
    author->{name, slug, image, role},
    "categories": categories[]->{title, slug},
    mainImage,
    "textPreview": body[style == 'normal'][0].children[0].text, 
    publishedAt,
    slug,
  }`;

  const morePosts: BlogPost[] = await sanityClient.fetch(morePostsQuery);

  const combinedPosts = featuredPosts.concat(morePosts).slice(0, 3)

  return {
    props: {
      featuredPosts: combinedPosts,
    },
    revalidate: 60,
  };
}
