import Layout from '~/components/Layout';
import type { NextPageWithLayout } from "./_app";
import type { ReactElement } from "react";
import Link from 'next/link';



const NotFoundPage: NextPageWithLayout = () => {
  return (
    <main className="relative isolate min-h-full">
    <img
      src="https://images.unsplash.com/photo-1471357674240-e1a485acb3e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2350&q=80"
      alt=""
      className="absolute inset-0 -z-10 h-full w-full object-cover object-top"
    />
    <div className="mx-auto h-65vh px-6 py-32 text-center sm:py-40 lg:px-8 bg-opacity-60 bg-slate-900">
      <p className="text-base font-semibold leading-8 text-white">404</p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">Page not found</h1>
      <p className="mt-4 text-base text-white/70 sm:mt-6">Sorry, we couldn&apos;t find the page you&apos;re looking for. <br /> Either it doesn&apos;t exist or the developer (Max) made a silly mistake. How embarrasing.</p>
      <div className="mt-10 flex justify-center">
        <Link href="/" className="text-sm font-semibold leading-7 text-white">
          <span aria-hidden="true">&larr;</span> Back to home
        </Link>
      </div>
    </div>
  </main>
  );
};

export default NotFoundPage;

NotFoundPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};