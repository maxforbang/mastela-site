import Image from "next/image";
import { HeartIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import type { UnitDetails } from "~/pages/our-villas";
import Link from "next/link";

export function InfoCard({
  img,
  location,
  title,
  description,
  star,
  price,
  total,
}: UnitDetails) {
  return (
    <div className="flex transform cursor-pointer flex-col border-b px-2 py-7 pr-4 transition duration-200 ease-out first:border-t hover:scale-105 hover:opacity-80 hover:shadow-lg sm:flex-row">
      <div className="relative aspect-[5/3] w-full flex-shrink-0 sm:h-48 sm:w-80">
        <Image
          src={img}
          fill
          objectFit="cover"
          className="rounded-2xl"
          alt="Cape Coral Villa Property"
        />
      </div>
      <div className="flex flex-grow flex-col pt-6 sm:pl-5 sm:pt-0">
        <div className="flex justify-between">
          <p>{location}</p>
          <HeartIcon className="h-7 cursor-pointer" />
        </div>
        <Link href="/villas/[property]" as={`/villas/villa-encore`}>
          <h4 className="text-xl">{title}</h4>
        </Link>

        <div className="w-10 border-b pt-2" />

        <p className="flex-grow pt-2 text-sm text-gray-500">{description}</p>
        <div className="item-end flex justify-between pt-5">
          <div>
            <p className="flex items-center">
              <StarIcon className="h-5 text-red-400" />
              {star}
            </p>
          </div>

          <div>
            <p className="pb-2 text-lg font-semibold lg:text-2xl">{price}</p>
            <p className="text-right font-extralight">{total}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoCard;
