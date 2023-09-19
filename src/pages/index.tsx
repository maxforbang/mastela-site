//TODO: Console cleanup (Observe browser console end-to-end, remove errors/warnings)
// 1. Unique key for each list in app
// 2. No unnecessary queries (calling queries with undefined)

import Layout from "~/components/Layout";
import type { NextPageWithLayout } from "./_app";
import type { ReactElement } from "react";
import AboutUsSection from "~/components/home/AboutUsSection";
import FAQSection from "~/components/home/FAQSection";
import PropertiesSection from "~/components/home/PropertiesSection";

import AmenitiesSection from "~/components/home/AmenitiesSections";
import HeroSection from "~/components/home/HeroSection";
import SupportSection from "~/components/home/SupportSection";
import BlogSection from "~/components/home/BlogSection";
import { BlogPost, Review } from "types";
import { InferGetStaticPropsType } from "next";
import TestimonialsSection from "~/components/home/TestimonialsSection/TestimonialsSection";
import { fetchFeaturedPosts } from "~/utils/fetch/fetchFeaturedPosts";
import { fetchReviews } from "~/utils/fetch/fetchReviews";
import { prisma } from "~/server/db";

type HomePageProps = {
  featuredPosts: BlogPost[];
  reviews: Review[];
};

const HomePage: NextPageWithLayout<HomePageProps> = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  const { featuredPosts, reviews = [] } = props;

  return (
    <>
      <main className="mx-auto px-8 lg:px-12">
        <HeroSection />
        <AmenitiesSection />
        <AboutUsSection />
        <TestimonialsSection reviews={reviews} />
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
  const reviews = await fetchReviews();
  const featuredPosts = await fetchFeaturedPosts();

  return {
    props: {
      reviews: JSON.parse(JSON.stringify(reviews)) as Review[],
      featuredPosts,
    },
    revalidate: 60,
  };
}
