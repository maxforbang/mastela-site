import Image from "next/image";
import { ArrowUpOnSquareIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import type { UnitDetails } from "~/pages/our-villas";
import Link from "next/link";
import { urlFor } from "~/utils/functions/urlFor";
import { PortableText } from "@portabletext/react";
import { formatCurrency } from "~/utils/functions/formatCurrency";

export function ListingCard({ listing, arrival, departure }) {
  const { name, slug, mainImage, occupancy, preview } = listing;
  

  const imageSrc = urlFor(mainImage).height(1000).url();
  const blurImageSrc = urlFor(mainImage).width(24).height(24).blur(10).url();

  const { guests, bedrooms, beds, bathrooms } = occupancy;
  const occupancyString = `${guests} guest${
    guests > 1 ? "s" : ""
  } · ${bedrooms} bedroom${bedrooms > 1 ? "s" : ""} · ${beds} bed${
    beds > 1 ? "s" : ""
  } · ${bathrooms} bathroom${bathrooms > 1 ? "s" : ""}`;

  const price = 426;
  const total = 1690;

  return (
    <Link
      href="/properties/[property]"
      as={`/properties/${slug.current}${arrival && departure ? `?arrival=${arrival}&departure=${departure}` : ''}`}
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

        <p className="flex-grow pt-4 text-sm text-gray-500">
          <PortableText value={preview} />
        </p>
        <div className="items-end flex justify-between pt-5">
          <div>
            {/* REVIEWS */}
            {/* <p className="flex items-center">
              <StarIcon className="h-5 text-red-400" />
              {4.5}
            </p> */}
          </div>

          <div>
            <p className="lg:pb-1 text-lg font-semibold lg:text-2xl">
              {formatCurrency(price)} / night
            </p>
            <p className="text-right font-extralight">
              {formatCurrency(total)} total
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ListingCard;

