import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import { AxiomWebVitals } from "next-axiom";

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

const MyApp: AppType = ({
  Component,
  pageProps,
}: {
  Component: NextPageWithLayout;
  pageProps: Record<string, never>;
}) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <AxiomWebVitals />
      {getLayout(<Component {...pageProps} />)}
    </>
  );
};

export default api.withTRPC(MyApp);
