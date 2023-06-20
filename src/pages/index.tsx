//TODO: Console cleanup (Observe browser console end-to-end, remove errors/warnings)
// 1. Unique key for each list in app  
// 2. No unnecessary queries (calling queries with undefined)

import Head from "next/head";
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

const HomePage: NextPageWithLayout = () => {
  
  return (
    <>
      <main className="mx-auto px-8 lg:px-12">
        <HeroSection />
        <AmenitiesSection />
        <AboutUsSection />
        <TestimonialsSection />
        <PropertiesSection />
        <BlogSection />
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



