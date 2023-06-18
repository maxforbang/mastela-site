import Layout from "~/components/Layout";
import type { NextPageWithLayout } from "../_app";
import { ReactElement, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  DevicePhoneMobileIcon,
  WifiIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import Map from "~/components/search/Map";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRange } from "react-date-range";
import {
  addDays,
  addYears,
  differenceInDays,
  format,
  parseISO,
} from "date-fns";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { PortableText } from "@portabletext/react";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { propertiesRouter } from "../../server/api/routers/properties";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";
import sanityClient from "../../../sanity/lib/sanityClient";
import { groq } from "next-sanity";
import { useRouter } from "next/router";
import { formatCurrencyRounded } from "~/utils/functions/formatCurrency";
import {
  SkeletonBookNowDesktop,
  SkeletonPropertyDescription,
  SkeletonPropertyHeader,
  SkeletonPropertyImages,
} from "~/components/property/LoadingPropertyPage";
import { RouterOutputs } from "~/utils/api";
import { InvoiceItem } from "types";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import {
  classNames,
  formatDateRangeUrl,
  formatDateUrl,
} from "~/utils/functions/functions";
import { getUrlParams } from "~/utils/functions/getUrlParams";
import { datesEqual } from "~/utils/functions/dates/datesEqual";
import { DateRangePicker } from "~/components/DateRangePicker";
import { urlFor } from "../../../sanity/lib/urlFor";

const PropertyPage: NextPageWithLayout = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  const router = useRouter();
  let { slug } = props;

  let arrival;
  let departure;

  useEffect(() => {
    if (router.isReady) {
      ({ arrival, departure } = getUrlParams(router.asPath));
      setDates({
        startDate: arrival,
        endDate: departure,
      });
    }
  }, [router.isReady, slug]);

  const [dates, setDates] = useState({
    startDate: arrival,
    endDate: departure,
  });

  const {
    data: {
      name = "",
      occupancy = {},
      mainImage,
      coords,
      preview,
      description,
      images = [],
    } = {},
    isLoading: propertyIsLoading,
  } = api.properties.getProperty.useQuery({ slug });

  const imageSources = images
    ? images.slice(0, 5).map((image) => urlFor(image).url())
    : [];
  console.log(imageSources);

  return (
    <>
      <div className="mx-auto max-w-7xl text-gray-800 sm:px-6 lg:px-8">
        <PropertyImages imageSources={imageSources} />
        <div className="max-w-7xl sm:flex lg:gap-8">
          <div className="flex flex-col justify-center px-6 md:w-2/3">
            <PropertyHeader name={name} occupancy={occupancy} />
            <PropertyFeatures />
            <PropertyDescription preview={preview} />
            <PropertyMap coords={coords} />
            <AvailabilityCalendar
              dates={dates}
              setDates={setDates}
              property={slug}
            />
          </div>
          <BookNowDesktop
            slug={slug}
            propertyIsLoading={propertyIsLoading}
            dates={dates}
            setDates={setDates}
          />
        </div>
      </div>

      {/* Possibly set to scroll=enabled for mobile */}
      {/* <BookNowMobile slug={slug} arrival={arrival} departure={departure} /> */}

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

function PropertyFeatures() {
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
          <p className="text-lg  font-semibold">
            Free cancellation until Aug 16th
          </p>
          <p className=" text-gray-600">
            100% refund for any reason before the grace period ends.
          </p>
        </div>
      </div>
    </div>
  );
}

function BookNowDesktop({ slug, propertyIsLoading, dates, setDates }) {
  const enabled = !!dates.startDate && !!dates.endDate;
  const [calendarShowing, setCalendarShowing] = useState(false);

  const {
    data: pricingInfo,
    isLoading,
    isError,
    error,
    isLoadingError,
    isSuccess,
  } = api.properties.getQuote.useQuery(
    {
      slug,
      startDate: dates.startDate,
      endDate: dates.endDate,
    },
    {
      retry: 0,
      enabled: enabled,
    }
  );

  const [errorMsg, setErrorMsg] = useState("");

  if (enabled && isLoading && !isError && !isLoadingError) {
    return <SkeletonBookNowDesktop />;
  }

  let totalPrice = 0;
  let pricePerNight = "Starting at $250";
  let invoiceItems = [];

  if (pricingInfo && !isError) {
    ({ totalPrice, pricePerNight, invoiceItems } = pricingInfo);
  }

  if (isError && errorMsg !== error.message) {
    setErrorMsg(error.message);
  } else if (isSuccess && errorMsg.length) {
    setErrorMsg("");
  }

  return (
    <div className="sticky top-32 mx-auto mt-12 hidden h-max w-1/3 rounded-xl border p-8 shadow-xl md:block">
      <div
        /* Create better way to invalidate query besides clicking dates div */
        // onClick={() => utils.properties.getQuote.invalidate()}
        className="flex items-center gap-1"
      >
        <p className="text-xl font-semibold">{pricePerNight}</p>/<p> night</p>
      </div>
      <StackedSearchBar
        dates={{ startDate: dates.startDate, endDate: dates.endDate }}
        setDates={setDates}
        property={slug}
        calendarShowing={calendarShowing}
        setCalendarShowing={setCalendarShowing}
      />
      <div className="py-5">
        {enabled ? (
          <Link
            href={`/checkout?property=${slug}&arrival=${dates.startDate}&departure=${dates.endDate}`}
          >
            <div className="text-md flex w-full rounded-lg bg-sky-500 px-6 py-3 text-center font-semibold text-white shadow-sm hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              <p className="mx-auto">Reserve</p>
            </div>
          </Link>
        ) : (
          <div 
          onClick={() => setCalendarShowing(true)}
          className="cursor-pointer text-md flex w-full rounded-lg bg-sky-500 px-6 py-3 text-center font-semibold text-white shadow-sm hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            <p className="mx-auto">Add dates</p>
          </div>
        )}
      </div>
      <p className="text-rose-600">{errorMsg}</p>

      {totalPrice > 0 && (
        <>
          <div className="mt-4 flex flex-col gap-4 border-b pb-4">
            {invoiceItems.map((invoiceItem: InvoiceItem, index) => {
              return <InvoiceItemDisplay invoiceItem={invoiceItem} />;
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
  invalidate,
  property,
  calendarShowing,
  setCalendarShowing,
}: {
  dates?: { startDate: string; endDate: string };
}) {
  return (
    <>
      <div className="mt-5 rounded-lg border border-gray-300">
        <div className="flex flex-col">
          <div
            onClick={() => {
              setCalendarShowing(!calendarShowing);
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
            <p>
              {property === "the-twins-villa" || property === "villa-encore"
                ? "Up to 10 guests"
                : "Up to 8 guests"}
            </p>
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

function BookNowMobile({ slug, arrival, departure }) {
  if (!arrival || !departure) {
    return <p>hi</p>;
  }

  const { data: quote = [], isLoading } = api.properties.getQuote.useQuery({
    slug,
    startDate: arrival,
    endDate: departure,
  });

  if (isLoading) {
    return <p>Loading</p>; //BookNowMobile Skeleton
  }

  let totalPrice = 0;
  let room_types = [];
  //TODO: Instead of messy destructuring, return a custom type with only the data you need from server (int totalPrice, InvoiceItem[])
  if (quote && quote[0]) {
    ({ total_including_vat: totalPrice = 0, room_types = [] } = quote[0]) ?? {};
  }

  // TODO: Include subitems (price_types[].prices) from API
  let invoiceItems = [];
  let pricePerNight = "";

  if (room_types && room_types[0]) {
    invoiceItems = room_types[0].price_types
      .map((item) => {
        let description = item.description;
        if (item.description === "Room Rate") {
          const nights = differenceInDays(
            new Date(departure),
            new Date(arrival)
          );
          pricePerNight = formatCurrencyRounded(item.subtotal / nights);
          description = `${pricePerNight} x ${nights} nights`;
        }
        return {
          description: description,
          price: item.subtotal,
        };
      })
      .filter((item) => item.price > 0);
  }
  return (
    <div className="fixed bottom-0 flex w-full items-center justify-between border-t bg-white px-6 py-5 md:hidden">
      <div className="text-sm">
        <p>{pricePerNight} night</p>
        <p className="underline">Sep 9 - 14</p>
      </div>
      <div className="">
        <Link
          href="/checkout"
          className="text-md rounded-lg bg-sky-500 px-6 py-3.5 text-center font-semibold text-white shadow-sm hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Reserve
        </Link>
      </div>
    </div>
  );
}

function AvailabilityCalendar({ dates, setDates, property }) {
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

function PropertyMap({ coords }) {
  // TODO: Add coords for marker
  return (
    <>
      <p className="my-4 mt-8 text-center text-xl font-semibold">
        Surrounding Area
      </p>
      <div className="mb-8 h-30vh overflow-hidden rounded-lg">
        <Map
          searchResults={[
            {
              img: "https://links.papareact.com/xqj",
              location: "Private room in center of London",
              title: "Stay at this spacious Edwardian House",
              description:
                "1 guest · 1 bedroom · 1 bed · 1.5 shared bthrooms · Wifi · Kitchen · Free parking · Washing Machine",
              star: 4.73,
              price: "£30 / night",
              total: "£117 total",
              long: -0.0022275,
              lat: 51.5421655,
            },
          ]}
        />
      </div>
    </>
  );
}

function PropertyImages({ imageSources: images }) {
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
      <div className="relative w-full sm:w-1/2">
        <Image
          priority
          className="sm:rounded-l-xl"
          fill
          style={{ objectFit: "cover" }}
          src={images[0]}
          sizes="(min-width: 640px) 50vw, (min-width: 1536px) 40vw, 100vw"
          // blurDataURL={blurImageSrc}
          alt=""
        />
      </div>
      <div className="relative hidden w-1/2 grid-cols-2 grid-rows-2 gap-2 sm:grid">
        <div className="relative">
          <Image
            className=""
            fill
            style={{ objectFit: "cover" }}
            src={images[1]}
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
            src={images[2]}
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
            src={images[3]}
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
            src={images[4]}
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
  occupancy: number;
}) {
  if (!name || !occupancy) {
    return <SkeletonPropertyHeader />;
  }

  const { guests = 0, bedrooms = 0, beds = 0, bathrooms = 0 } = occupancy;

  return (
    <div className="mt-4 py-8 text-center text-4xl">
      <p className="">{name}</p>
      <p className="border-b py-3 pb-8 text-lg">
        {guests} guests • {bedrooms} bedrooms • {beds} beds • {bathrooms} baths
      </p>
    </div>
  );
}

function PropertyDescription({ preview }) {
  if (!preview) {
    return <SkeletonPropertyDescription />;
  }

  return (
    <div className="border-b py-8">
      <PortableText value={preview} />
      {/* &nbsp;&hellip; */}
      <div
        // TODO: Add model for description's Show More
        onClick={() => console.log("Description Pop-Up")}
        className="mt-4 flex cursor-pointer gap-2 text-base font-semibold"
      >
        <p className="underline">Show more</p>{" "}
        <span className="no-underline" aria-hidden="true">
          →
        </span>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const paths = await sanityClient.fetch(
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
    ctx: { prisma },
  });

  const slug = context.params?.property;

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
                key={`bn-desktop-subitem-${price.uid}`}
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

export function dateToStringNumerical(date: string | Date): string {
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
