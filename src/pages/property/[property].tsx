import Layout from "~/components/Layout";
import type { NextPageWithLayout } from "../_app";
import { type ReactElement, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  DevicePhoneMobileIcon,
  WifiIcon,
  CalendarDaysIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import Map from "~/components/search/Map";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import {
  addDays,
  differenceInCalendarDays,
  format,
  parseISO,
  subDays,
} from "date-fns";
import type { GetStaticPropsContext, InferGetStaticPropsType } from "next";

import { createServerSideHelpers } from "@trpc/react-query/server";
import { propertiesRouter } from "../../server/api/routers/properties";
import { prisma } from "~/server/db";
import { resend } from "~/server/resend";
import { api } from "~/utils/api";
import sanityClient from "../../../sanity/lib/sanityClient";
import { groq } from "next-sanity";
import { useRouter } from "next/router";
import { formatCurrencyRounded } from "~/utils/functions/formatCurrency";
import {
  SkeletonBookNowDesktop,
  SkeletonBookNowMobile,
  SkeletonPropertyDescription,
  SkeletonPropertyHeader,
  SkeletonPropertyImages,
} from "~/components/property/LoadingPropertyPage";
import type {
  CalendarComponent,
  CalendarDates,
  InvoiceItem,
  Occupancy,
  RichText,
  SanityImage,
} from "types";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { classNames } from "~/utils/functions/functions";
import { getUrlParams } from "~/utils/functions/getUrlParams";
import { DateRangePicker } from "~/components/DateRangePicker";
import { urlFor } from "../../../sanity/lib/urlFor";
import type { DehydratedState } from "@tanstack/react-query";
import { createOccupancyString } from "~/components/search/ListingCard";
import { formatDateEnglish } from "~/utils/functions/dates/formatDateEnglish";
import ImageGallery from "~/components/property/ImageGallery";
import PortableText from "react-portable-text";
import DescriptionPopUp from "~/components/property/DescriptionPopUp";
import DescriptionContent from "~/components/property/DescriptionContent";

type PropertyPageProps = {
  trpcState: DehydratedState;
  slug: string;
};

const PropertyPage: NextPageWithLayout<PropertyPageProps> = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  const router = useRouter();
  const { slug } = props;

  useEffect(() => {
    if (router.isReady) {
      const { arrival, departure } = getUrlParams(router.asPath);
      setDates({
        startDate: arrival,
        endDate: departure,
      });
    }
  }, [router.isReady, slug, router.asPath]);

  const [dates, setDates] = useState<CalendarDates>({
    startDate: undefined,
    endDate: undefined,
  });

  const {
    data: {
      name = "",
      occupancy,
      // coords,
      preview = [],
      description = [],
      images = [],
    } = {},
  } = api.properties.getProperty.useQuery(
    { slug: slug ?? "" },
    {
      enabled: !!slug,
    }
  );

  const imageSources = images
    ? images.map((image: SanityImage) => urlFor(image).url())
    : [];

  const [galleryIsShowing, setGalleryIsShowing] = useState(false);

  return (
    <>
      <div className="mx-auto max-w-7xl text-gray-800 sm:px-6 lg:px-8">
        <ImageGallery
          imageSources={imageSources}
          galleryIsShowing={galleryIsShowing}
          setGalleryIsShowing={setGalleryIsShowing}
          slug={slug}
        />
        <PropertyImages
          imageSources={imageSources.slice(0, 5)}
          setGalleryIsShowing={setGalleryIsShowing}
        />
        <div className="max-w-7xl sm:flex lg:gap-8">
          <div className="flex flex-col justify-center px-6 md:w-2/3">
            <PropertyHeader
              name={name}
              occupancy={
                occupancy ?? { guests: 0, bedrooms: 0, beds: 0, bathrooms: 0 }
              }
            />
            <PropertyFeatures dates={dates} />
            <PropertyDescription name={name} preview={preview} description={description} />
            <PropertyMap />
            <AvailabilityCalendar
              dates={dates}
              setDates={setDates}
              property={slug}
            />
          </div>
          <BookNowDesktop
            property={slug ?? ""}
            dates={dates}
            setDates={setDates}
            guests={occupancy?.guests ?? 0}
          />
        </div>
      </div>

      {/* Possibly set to scroll=enabled for mobile */}
      <BookNowMobile property={slug ?? ""} dates={dates} setDates={setDates} />

      {/* Possibly add: */}
      {/* Reviews */}
      {/* Contact Host */}
      {/* FAQ's / Refund */}
    </>
  );
};

export default PropertyPage;

PropertyPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

function PropertyFeatures({ dates }: { dates: CalendarDates }) {
  return (
    <div className="flex flex-col gap-8 border-b pb-8">
      <div className="flex items-center gap-4 ">
        <DevicePhoneMobileIcon height={36} />
        <div className="relative">
          <p className="text-lg  font-semibold">Smart Home Controls</p>
          <p className=" text-gray-600">
            Control the entire home using the provided tablet and app.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4 ">
        <WifiIcon height={36} />
        <div className="relative">
          <p className="text-lg  font-semibold">Self Check-In</p>
          <p className=" text-gray-600">
            Unlock the house with the digital keypad and app.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4 ">
        <CalendarDaysIcon height={36} />
        <div className="relative">
          <p className="text-lg  font-semibold">{refundPolicyString(dates)}</p>
          <p className=" text-gray-600">
            100% refund for any reason before the grace period ends.
          </p>
        </div>
      </div>
    </div>
  );
}

function refundPolicyString(dates: CalendarDates) {
  // The number of days before an arrival date in which a guest will no longer be able to receive a refund
  const gracePeriodDays = 14;

  const { startDate, endDate } = dates;
  if (!startDate || !endDate) {
    return "Free cancellation";
  }

  const currentDate = new Date();
  const arrivalDate = parseISO(startDate);

  const daysUntilBooking = differenceInCalendarDays(arrivalDate, currentDate);
  if (daysUntilBooking <= gracePeriodDays + 3) {
    if (daysUntilBooking <= 3) {
      return "Free cancellation before check-in";
    }
    return `Free cancellation until ${formatDateEnglish(
      addDays(currentDate, 3)
    )}`;
  }

  const gracePeriodEndDate = subDays(arrivalDate, gracePeriodDays);
  return `Free cancellation until ${formatDateEnglish(gracePeriodEndDate)}`;
}

function BookNowDesktop({
  property = "",
  dates,
  setDates,
  guests,
}: CalendarComponent & {
  guests: number;
}) {
  const enabled = dates && !!dates.startDate && !!dates.endDate;
  const [calendarShowing, setCalendarShowing] = useState(false);

  const {
    data: pricingInfo,
    isLoading,
    isError,
    error,
    isSuccess,
  } = api.properties.getQuote.useQuery(
    {
      slug: property,
      startDate: dates?.startDate,
      endDate: dates?.endDate,
    },
    {
      retry: 0,
      enabled: enabled,
    }
  );

  const [errorMsg, setErrorMsg] = useState("");

  if (enabled && isLoading && !isError) {
    return <SkeletonBookNowDesktop />;
  }

  let totalPrice = 0;
  let pricePerNight = "Starting at $250";
  let invoiceItems: InvoiceItem[] = [];

  if (pricingInfo && !isError) {
    ({ totalPrice, invoiceItems } = pricingInfo);
    pricePerNight = pricingInfo.pricePerNight as string;
  }

  if (isError && errorMsg !== error.message) {
    setErrorMsg(error.message);
  } else if (isSuccess && errorMsg.length) {
    setErrorMsg("");
  }

  return (
    <div className="sticky top-32 mx-auto mt-12 hidden h-max w-1/3 rounded-xl border p-8 shadow-xl md:block">
      <div className="flex items-center gap-1">
        <p className="text-xl font-semibold">{pricePerNight}</p>/<p> night</p>
      </div>
      <StackedSearchBar
        dates={{ startDate: dates?.startDate, endDate: dates?.endDate }}
        setDates={setDates}
        property={property}
        calendarShowing={calendarShowing}
        setCalendarShowing={setCalendarShowing}
        guests={guests}
      />
      <div className="py-5">
        {enabled ? (
          <Link
            href={`/checkout?property=${property}&arrival=${
              dates.startDate as string
            }&departure=${dates.endDate as string}`}
          >
            <div className="text-md flex w-full rounded-lg bg-sky-500 px-6 py-3 text-center font-semibold text-white shadow-sm hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              <p className="mx-auto">Reserve</p>
            </div>
          </Link>
        ) : (
          <div
            onClick={() => setCalendarShowing(true)}
            className="text-md flex w-full cursor-pointer rounded-lg bg-sky-500 px-6 py-3 text-center font-semibold text-white shadow-sm hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <p className="mx-auto cursor-pointer">Add dates</p>
          </div>
        )}
      </div>
      <p className="animate-pulse text-rose-600">{errorMsg}</p>

      {totalPrice > 0 && (
        <>
          <div className="mt-4 flex flex-col gap-4 border-b pb-4">
            {invoiceItems.map((invoiceItem: InvoiceItem) => {
              return (
                <InvoiceItemDisplay
                  key={`invoice-item-${invoiceItem.description}`}
                  invoiceItem={invoiceItem}
                />
              );
            })}
          </div>
          <div className="text flex justify-between pt-4">
            <p className="text-lg font-bold">Total</p>
            <p className="text-lg font-bold">
              {formatCurrencyRounded(totalPrice)}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function StackedSearchBar({
  dates,
  setDates,
  property,
  calendarShowing,
  setCalendarShowing,
  guests,
}: CalendarComponent & { guests: number }) {
  return (
    <>
      <div className="mt-5 rounded-lg border border-gray-300">
        <div className="flex flex-col">
          <div
            onClick={() => {
              setCalendarShowing && setCalendarShowing(!calendarShowing);
            }}
            className="flex items-center"
          >
            <div className="flex flex-1 flex-col gap-1 border-r p-3 ">
              <p className="thin text-xs font-bold uppercase tracking-tight">
                Check-in
              </p>
              <p className="text-ellipsis">
                {dates?.startDate
                  ? dateToStringNumerical(dates?.startDate)
                  : "Add date"}
              </p>
            </div>
            <div className="flex flex-1 flex-col gap-1 truncate p-3">
              <p className="thin text-xs font-bold uppercase tracking-tight">
                Checkout
              </p>
              <p>
                {dates?.endDate
                  ? dateToStringNumerical(dates?.endDate)
                  : "Add date"}
              </p>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-1 border-t p-3">
            <p className="thin text-xs font-bold uppercase tracking-tight">
              Guests
            </p>
            <p>{`Up to ${guests} guests`}</p>
          </div>
        </div>
      </div>
      <div
        className={classNames(
          "absolute top-40 z-10 w-full -translate-x-8",
          !calendarShowing ? "hidden" : ""
        )}
      >
        <DateRangePicker
          dates={dates}
          setDates={setDates}
          setCalendarShowing={setCalendarShowing}
          property={property}
        />
      </div>
    </>
  );
}

function BookNowMobile({ property = "", dates, setDates }: CalendarComponent) {
  const enabled = dates && !!dates.startDate && !!dates.endDate;
  const [calendarShowing, setCalendarShowing] = useState(false);

  const {
    data: pricingInfo,
    isLoading,
    isError,
    error,
    isSuccess,
  } = api.properties.getQuote.useQuery(
    {
      slug: property,
      startDate: dates?.startDate,
      endDate: dates?.endDate,
    },
    {
      retry: 0,
      enabled: enabled,
    }
  );

  const [errorMsg, setErrorMsg] = useState("");

  if (enabled && isLoading && !isError) {
    return <SkeletonBookNowMobile />;
  }

  let totalPrice = 0;
  let pricePerNight = "Starting at $250";
  let invoiceItems: InvoiceItem[] = [];

  if (pricingInfo && !isError) {
    ({ totalPrice, invoiceItems } = pricingInfo);
    pricePerNight = pricingInfo.pricePerNight as string;
  }

  if (isError && errorMsg !== error.message) {
    setErrorMsg(error.message);
  } else if (isSuccess && errorMsg.length) {
    setErrorMsg("");
  }

  return (
    <div className="fixed bottom-0 w-full">
      <div className="flex flex-col">
        <div
          className={classNames(
            "-mb-1 w-full",
            calendarShowing ? "" : "hidden"
          )}
        >
          <DateRangePicker
            dates={dates}
            setDates={setDates}
            setCalendarShowing={setCalendarShowing}
            property={property}
          />
        </div>
        <div className="flex h-24  items-center justify-between border-t bg-white px-6 py-5 md:hidden">
          {isError ? (
            <p
              onClick={() => setCalendarShowing(!calendarShowing)}
              className=" animate-pulse pr-6 text-sm text-rose-600"
            >
              {errorMsg}
            </p>
          ) : (
            <div
              onClick={() => setCalendarShowing(!calendarShowing)}
              className="cursor-pointer text-sm"
            >
              <p>{pricePerNight} night</p>
              {enabled ? (
                <p className="underline">{`${formatDateEnglish(
                  dates?.startDate,
                  true
                )} - ${formatDateEnglish(dates?.endDate, true)}`}</p>
              ) : (
                <p
                  className="underline"
                  onClick={() => setCalendarShowing(true)}
                >
                  Add dates
                </p>
              )}
            </div>
          )}
          <div>
            {enabled && !isError ? (
              <Link
                href={`/checkout?property=${property}&arrival=${
                  dates.startDate as string
                }&departure=${dates.endDate as string}`}
              >
                <div className="text-md cursor-pointer rounded-lg bg-sky-500 px-6 py-3.5 text-center font-semibold text-white shadow-sm hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600">
                  Reserve
                </div>
              </Link>
            ) : (
              <div
                onClick={() => setCalendarShowing(!calendarShowing)}
                className="text-md cursor-pointer whitespace-nowrap rounded-lg bg-sky-500 px-6 py-3.5 text-center font-semibold text-white shadow-sm hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
              >
                {calendarShowing
                  ? "Cancel"
                  : isError
                  ? "Change dates"
                  : "Add dates"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AvailabilityCalendar({
  dates,
  setDates,
  property,
}: CalendarComponent) {
  return (
    <div className="border-t py-8">
      <p className="text-center text-xl font-semibold">Availability</p>
      <div className="flex sm:hidden">
        <DateRangePicker
          dates={dates}
          setDates={setDates}
          months={1}
          direction="horizontal"
          property={property}
        />
      </div>

      <div className="hidden sm:block lg:hidden">
        <DateRangePicker
          dates={dates}
          setDates={setDates}
          months={2}
          direction="horizontal"
          property={property}
        />
      </div>

      <div className="hidden lg:block">
        <DateRangePicker
          dates={dates}
          setDates={setDates}
          months={3}
          direction="horizontal"
          property={property}
        />
      </div>
    </div>
  );
}

function PropertyMap() {
  // TODO: Add coords for marker
  return (
    <>
      <p className="my-4 mt-8 text-center text-xl font-semibold">
        Surrounding Area
      </p>
      <div className="mb-8 h-30vh overflow-hidden rounded-lg">
        <Map />
      </div>
    </>
  );
}

function PropertyImages({
  imageSources: images,
  setGalleryIsShowing,
}: {
  imageSources: string[];
  setGalleryIsShowing: (state: boolean) => void;
}) {
  if (!images.length) {
    return <SkeletonPropertyImages />;
  }

  // const { mainImage = "" } = props;

  // const imageSrc = mainImage ? urlFor(mainImage).height(1000).url() : "";
  // const blurImageSrc = mainImage
  //   ? urlFor(mainImage).width(24).height(24).blur(10).url()
  //   : "";

  return (
    <div className="relative flex aspect-[3/2] w-full gap-2 sm:mt-6 sm:aspect-[2]">
      <div
        onClick={() => setGalleryIsShowing(true)}
        className="absolute bottom-6 right-6 z-10 flex h-9 w-40 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-slate-600 bg-white active:bg-gray-200"
      >
        <Squares2X2Icon className="h-6" />
        <p className="text-sm font-medium tracking-tight ">Show all photos</p>
      </div>
      <div className="relative w-full sm:w-1/2">
        <Image
          priority
          className="sm:rounded-l-xl"
          fill
          style={{ objectFit: "cover" }}
          src={images[0] ?? ""}
          sizes="(min-width: 640px) 50vw, (min-width: 1536px) 40vw, 100vw"
          // TODO: Add blur data url
          // blurDataURL={blurImageSrc}
          alt=""
          // TODO: Add alt pictures for property pictures
        />
      </div>
      <div className="relative hidden w-1/2 grid-cols-2 grid-rows-2 gap-2 sm:grid">
        <div className="relative">
          <Image
            className=""
            fill
            style={{ objectFit: "cover" }}
            src={images[1] ?? ""}
            sizes="(min-width: 640px) 25vw, (min-width: 1536px) 20vw, 100vw"
            // blurDataURL={blurImageSrc}
            alt=""
          />
        </div>
        <div className="relative">
          <Image
            className="rounded-tr-xl"
            fill
            style={{ objectFit: "cover" }}
            src={images[2] ?? ""}
            sizes="(min-width: 640px) 25vw, (min-width: 1536px) 20vw, 100vw"
            // blurDataURL={blurImageSrc}
            alt=""
          />
        </div>
        <div className="relative">
          <Image
            className=" "
            fill
            style={{ objectFit: "cover" }}
            src={images[3] ?? ""}
            sizes="(min-width: 640px) 25vw, (min-width: 1536px) 20vw, 100vw"
            // blurDataURL={blurImageSrc}
            alt=""
          />
        </div>
        <div className="relative">
          <Image
            className="rounded-br-xl"
            fill
            style={{ objectFit: "cover" }}
            src={images[4] ?? ""}
            sizes="(min-width: 640px) 25vw, (min-width: 1536px) 20vw, 100vw"
            // blurDataURL={blurImageSrc}
            alt=""
          />
        </div>
      </div>
    </div>
  );
}

function PropertyHeader({
  name,
  occupancy,
}: {
  name: string;
  occupancy: Occupancy;
}) {
  if (!name || !occupancy) {
    return <SkeletonPropertyHeader />;
  }

  return (
    <div className="mt-4 py-8 text-center text-4xl">
      <p className="">{name}</p>
      <p className="border-b py-3 pb-8 text-lg">
        {createOccupancyString(occupancy)}
      </p>
    </div>
  );
}

function PropertyDescription({
  name,
  preview,
  description,
}: {
  name: string;
  preview: RichText[];
  description: RichText[];
}) {
  const [open, setOpen] = useState(false);

  if (!preview) {
    return <SkeletonPropertyDescription />;
  }

  return (
    <div className="border-b py-8">
      <PortableText content={preview} />
      <DescriptionPopUp open={open} setOpen={setOpen}>
        <DescriptionContent name={name} text={description}/>
      </DescriptionPopUp>

      {/* &nbsp;&hellip; */}
      <div
        // TODO: Add modal/slide-over for description's Show More
        onClick={() => setOpen(true)}
        className="mt-4 flex cursor-pointer gap-2 text-base font-semibold text-sky-600 duration-200 hover:text-sky-300"
      >
        <p className="underline">Read more</p>{" "}
        <span className="no-underline" aria-hidden="true">
          →
        </span>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const paths: string[] = await sanityClient.fetch(
    groq`*[_type == "property" && defined(slug.current)][].slug.current`
  );

  return {
    paths: paths.map((slug) => ({ params: { property: slug } })),
    fallback: false,
  };
}

export async function getStaticProps(
  context: GetStaticPropsContext<{ property: string }>
) {
  const helpers = createServerSideHelpers({
    router: propertiesRouter,
    ctx: { prisma, sanityClient, resend},
  });

  const slug = context.params?.property || "";

  await helpers.getProperty.prefetch({ slug: slug });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      slug,
    },
  };
}

function InvoiceItemDisplay({ invoiceItem }: { invoiceItem: InvoiceItem }) {
  const { description, prices, subtotal } = invoiceItem;
  const hasBreakdown = prices.length > 1;

  const [showSubItems, setShowSubItems] = useState(false);

  return (
    <>
      <div
        key={`bn-desktop-price-item-${description}-invoice-item`}
        className="text flex justify-between gap-2"
      >
        {
          <>
            <div
              onClick={() => setShowSubItems(!showSubItems)}
              className={classNames(
                "flex gap-3",
                hasBreakdown ? "cursor-pointer" : ""
              )}
            >
              {description}
              {hasBreakdown ? (
                showSubItems ? (
                  <ChevronRightIcon className="h-6 rounded-md border" />
                ) : (
                  <ChevronDownIcon className="h-6 rounded-md border" />
                )
              ) : null}
            </div>
            <p className="font-semibold">{formatCurrencyRounded(subtotal)}</p>
          </>
        }
      </div>

      {hasBreakdown && showSubItems ? (
        <div className="-mt-2 mb-3 flex flex-col gap-1 border-l-2 pl-4">
          {prices.map((price) => {
            return (
              <div
                key={`bn-desktop-subitem-${price.description}`}
                className="flex justify-between gap-2"
              >
                <p>{price.description}</p>
                <p>{formatCurrencyRounded(price.amount)}</p>
              </div>
            );
          })}
        </div>
      ) : null}
    </>
  );
}

export function dateToStringNumerical(date: string | Date | undefined): string {
  if (!date) {
    return "";
  }

  if (typeof date === "string") {
    if (!date.length) {
      return "";
    }
    date = parseISO(date);
  }

  if (date.getFullYear() !== new Date().getFullYear()) {
    return format(date, "M/dd/yyyy");
  }

  return format(date, "M/dd/yy");
}
