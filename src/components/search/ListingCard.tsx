import Image from "next/image";
import { ArrowUpOnSquareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { urlFor } from "../../../sanity/lib/urlFor";
import { PortableText } from "@portabletext/react";
import { formatCurrencyRounded } from "~/utils/functions/formatCurrency";
import { api } from "~/utils/api";
import type { DateStringRange, Occupancy, PropertyListing, Slug } from "types";
interface ListingCardProps {
  listing: PropertyListing;
  arrival?: string;
  departure?: string;
}

// TODO: Add an explicit CTA (Book Now) somewhere
export function ListingCard({ listing, arrival, departure }: ListingCardProps) {
  const { name, slug, mainImage, occupancy, preview } = listing;

  const imageSrc = urlFor(mainImage).height(1000).url();
  const blurImageSrc = urlFor(mainImage).width(24).height(24).blur(10).url();

  const occupancyString = createOccupancyString(occupancy);

  return (
    <Link
      href="/properties/[property]"
      as={`/properties/${slug.current}${
        arrival && departure ? `?arrival=${arrival}&departure=${departure}` : ""
      }`}
      className="flex transform cursor-pointer flex-col border-b px-2 py-7 pr-4 transition duration-200 ease-out first:border-t hover:scale-105 hover:opacity-80 hover:shadow-lg sm:flex-row"
    >
      <div className="relative aspect-[5/3] w-full flex-shrink-0 sm:h-48 sm:w-80">
        <Image
          src={imageSrc}
          fill
          objectFit="cover"
          className="rounded-2xl"
          alt={mainImage.alt}
          blurDataURL={blurImageSrc}
        />
      </div>
      <div className="flex flex-grow flex-col pt-6 sm:pl-8 sm:pt-0">
        <div className="flex justify-between">
          <h4 className="text-3xl">{name}</h4>

          <ArrowUpOnSquareIcon className="h-7 cursor-pointer" />
        </div>
        <p className="flex-grow pt-2 text-gray-500">{occupancyString}</p>

        <div className="w-32 border-b pt-4" />

        <div className="flex-grow pt-4 text-sm text-gray-500">
          <PortableText value={preview ?? []} />
        </div>
        <div className="flex items-end justify-between pt-5">
          <div>
            {/* REVIEWS */}
            {/* <p className="flex items-center">
              <StarIcon className="h-5 text-red-400" />
              {4.5}
            </p> */}
          </div>

          <ListingPrice
            slug={slug}
            arrival={arrival ?? ""}
            departure={departure ?? ""}
          />
        </div>
      </div>
    </Link>
  );
}

export default ListingCard;

function ListingPrice({ slug, arrival, departure }: DateStringRange) {
  const defaultDisplay = !arrival.length || !departure.length;

  const {
    data: pricingInfo,
    isLoading,
    isError,
    error,
  } = api.properties.getQuote.useQuery(
    {
      slug: (slug as Slug)?.current,
      startDate: arrival,
      endDate: departure,
    },
    {
      retry: 0,
      enabled: !defaultDisplay,
    }
  );

  let totalPrice = 0;
  let pricePerNight;

  if (pricingInfo && !isError) {
    ({ totalPrice, pricePerNight } = pricingInfo);
  }

  return (
    <>
      {defaultDisplay ? (
        <div>
          <p className="text-lg font-semibold lg:pb-1 lg:text-2xl">
            Starting at $250 / night
          </p>
        </div>
      ) : isError ? (
        <div>
          <p className="text-lg font-semibold lg:pb-1 lg:text-2xl">
            Starting at $250 / night
          </p>
          <p className="text-right font-extralight">
            {/* Show minimum stay if that was the error */}
            {error.message.indexOf("days")
              ? `${error.message.substring(
                  error.message.indexOf("days") - 2,
                  error.message.indexOf("days") - 1
                )}-day minimum stay`
              : ""}
          </p>
        </div>
      ) : isLoading ? (
        <ListingPriceSkeleton />
      ) : (
        <div>
          <p className="text-lg font-semibold lg:pb-1 lg:text-2xl">
            {`${
              pricePerNight
                ? formatCurrencyRounded(pricePerNight as number)
                : "Starting at $250"
            } / night`}
          </p>
          <p className="text-right font-extralight">
            {formatCurrencyRounded(totalPrice)} total
          </p>
        </div>
      )}
    </>
  );
}

function ListingPriceSkeleton() {
  return (
    <div className="flex w-full flex-col  gap-3">
      <div className="h-8 w-5/12 animate-pulse self-end rounded-md bg-gray-300 " />
      <div className="h-6 w-3/12 animate-pulse self-end rounded-md bg-gray-300 " />
    </div>
  );
}

export function createOccupancyString(occupancy: Occupancy, seperator = '•') {
  const { guests, bedrooms, beds, bathrooms } = occupancy;
  return `${guests} guest${guests > 1 ? "s" : ""} ${seperator} ${bedrooms} bedroom${
    bedrooms > 1 ? "s" : ""
  } ${seperator} ${beds} bed${beds > 1 ? "s" : ""} ${seperator} ${bathrooms} bathroom${
    bathrooms > 1 ? "s" : ""
  }`;
}
