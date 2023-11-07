import Layout from "~/components/Layout";
import type { NextPageWithLayout } from "./_app";
import { type ReactElement } from "react";
import { api } from "~/utils/api";
import Link from "next/link";
import { format } from "date-fns";
import { dateToStringNumerical } from "./property/[property]";
import { formatCurrencyExact } from "~/utils/functions/formatCurrency";
import type { PaymentMethod, SanityImage } from "types";
import { formatPhoneNumber } from "~/utils/functions/dates/formatPhoneNumber";
import Image from "next/image";
import { urlFor } from "../../sanity/lib/urlFor";
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { propertiesRouter } from "../server/api/routers/properties";
import sanityClient from "../server/sanityClient";
import { prisma } from "../server/db";
import { resend } from "../server/resend";
import type { DehydratedState } from "@tanstack/react-query";
import superjson from "superjson";

type ConfirmationPageProps = {
  trpcState: DehydratedState;
  payment_intent: string;
};

const ConfirmationPage: NextPageWithLayout<ConfirmationPageProps> = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { payment_intent } = props;

  if (!payment_intent) {
    return null;
  }

  const {
    data: {
      customer: { name = "", email = "", phone = "" } = {},
      propertyName = "",
      propertySlug,
      dates: { arrival = "", departure = "" } = {},
      totalPrice = "",
      amountDetails,
      pricePerNight = "",
      createdDate = new Date(),
      paymentMethod = {},
    } = {},
  } = api.properties.getBookingPaymentInformation.useQuery({
    paymentIntent: payment_intent as string,
  });

  const {
    brand = "",
    exp_month = 0,
    exp_year = 0,
    last4 = "",
  } = paymentMethod as PaymentMethod;

  const { data: mainImage }: { data: SanityImage | undefined } =
    api.properties.getMainImage.useQuery(
      {
        slug: propertySlug as string,
      },
      {
        enabled: !!propertySlug,
      }
    );

  const mainImageSrc = mainImage ? urlFor(mainImage).url() : "";

  return (
    <>
      <main className="lg:min-h-full">
        <div className="relative h-80 overflow-hidden lg:absolute lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12">
          <Image
            src="https://images.unsplash.com/photo-1509233725247-49e657c54213?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1049&q=80&crop=entropy,edges&entropy=1.0&edges=0.1"
            alt="Palm trees in south florida"
            fill
            className="h-full w-full object-cover object-left"
          />
        </div>

        <div>
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24">
            <div className="lg:col-start-2">
              <h1 className="text-md font-medium text-sky-600">Thank you!</h1>
              <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Your booking has been confirmed!
              </p>
              {/* Add hyperlink to digital guidebook */}
              <p className="mt-2 text-base text-gray-500">
                {`You'll receive a confirmation email soon. In the meantime, feel
              free to take a look at your digital guidebook for ${propertyName} before your stay.`}
              </p>

              <dl className="mt-16 text-sm font-medium">
                <dt className="text-gray-900">Booking placed on</dt>
                <dd className="mt-2 text-sky-600">
                  {format(createdDate, "MMMM do, yyyy")}
                </dd>
              </dl>

              <ul
                role="list"
                className="mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-gray-500"
              >
                <div className="flex space-x-6 py-6">
                  <div className="relative h-24 w-24">
                    <Image
                      priority
                      className="rounded-md"
                      fill
                      style={{ objectFit: "cover" }}
                      src={mainImageSrc}
                      sizes="256px" // inputs w=640 in sanity url
                      // blurDataURL={blurImageSrc}
                      alt="Luxury Villa Vacation Rental in Cape Coral"
                    />
                  </div>
                  <div className="flex-auto space-y-1">
                    <h3 className="text-gray-900">
                      <div>{propertyName}</div>
                    </h3>

                    <p>{`${dateToStringNumerical(
                      arrival
                    )} - ${dateToStringNumerical(departure)}`}</p>
                  </div>
                  <p className="flex-none font-medium text-gray-900">
                    {pricePerNight} per night
                  </p>
                </div>
              </ul>

              <dl className="space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-gray-500">
                {amountDetails &&
                  Object.entries(amountDetails).map(([key, value]) => (
                    <div className="flex justify-between" key={key}>
                      <dt>{key}</dt>
                      <dd className="text-gray-900">
                        {formatCurrencyExact(value)}
                      </dd>
                    </div>
                  ))}
                <div className="flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900">
                  <dt className="text-base">Total</dt>
                  <dd className="text-base">
                    {formatCurrencyExact(totalPrice)}
                  </dd>
                </div>
              </dl>

              <dl className="mt-16 grid grid-cols-2 gap-x-4 text-sm text-gray-600">
                <div>
                  <dt className="font-medium text-gray-900">
                    Guest Information
                  </dt>
                  <dd className="mt-2">
                    <address className="not-italic">
                      <span className="block">{name}</span>
                      <span className="block">{formatPhoneNumber(phone)}</span>
                      <span className="block">{email}</span>
                    </address>
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-900">
                    Payment Information
                  </dt>
                  <dd className="mt-2 space-y-2 sm:flex sm:space-x-4 sm:space-y-0">
                    <div className="flex-none">
                      <svg
                        aria-hidden="true"
                        width={36}
                        height={24}
                        viewBox="0 0 36 24"
                        className="h-6 w-auto"
                      >
                        <rect width={36} height={24} rx={4} fill="#224DBA" />
                        <path
                          d="M10.925 15.673H8.874l-1.538-6c-.073-.276-.228-.52-.456-.635A6.575 6.575 0 005 8.403v-.231h3.304c.456 0 .798.347.855.75l.798 4.328 2.05-5.078h1.994l-3.076 7.5zm4.216 0h-1.937L14.8 8.172h1.937l-1.595 7.5zm4.101-5.422c.057-.404.399-.635.798-.635a3.54 3.54 0 011.88.346l.342-1.615A4.808 4.808 0 0020.496 8c-1.88 0-3.248 1.039-3.248 2.481 0 1.097.969 1.673 1.653 2.02.74.346 1.025.577.968.923 0 .519-.57.75-1.139.75a4.795 4.795 0 01-1.994-.462l-.342 1.616a5.48 5.48 0 002.108.404c2.108.057 3.418-.981 3.418-2.539 0-1.962-2.678-2.077-2.678-2.942zm9.457 5.422L27.16 8.172h-1.652a.858.858 0 00-.798.577l-2.848 6.924h1.994l.398-1.096h2.45l.228 1.096h1.766zm-2.905-5.482l.57 2.827h-1.596l1.026-2.827z"
                          fill="#fff"
                        />
                      </svg>
                      <p className="sr-only">Payment Information</p>
                    </div>
                    <div className="flex-auto">
                      <p className="text-gray-900">{`${
                        brand.charAt(0).toUpperCase() + brand.slice(1)
                      } ending with ${last4}`}</p>
                      <p>{`Expires ${exp_month} / ${exp_year % 100}`}</p>
                    </div>
                  </dd>
                </div>
              </dl>

              <div className="mt-16 border-t border-gray-200 py-6 text-right">
                <Link
                  href="/cape-coral-guide"
                  className="text-sm font-medium text-sky-600 hover:text-sky-500"
                >
                  Explore Cape Coral
                  <span aria-hidden="true"> &rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ConfirmationPage;

ConfirmationPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ payment_intent: string }>
) {
  const helpers = createServerSideHelpers({
    router: propertiesRouter,
    ctx: { prisma, sanityClient, resend },
    transformer: superjson,
  });

  const payment_intent = context.query?.payment_intent;

  await helpers.getBookingPaymentInformation.prefetch({
    paymentIntent: payment_intent as string,
  });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      payment_intent,
    },
  };
}
