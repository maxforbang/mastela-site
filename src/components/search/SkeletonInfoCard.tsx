import Image from "next/image";
import { HeartIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import type { UnitDetails } from "~/pages/our-villas";
import Link from "next/link";

export function SkeletonInfoCard() {
  return (
    <div className="flex transform cursor-pointer flex-col border-b px-2 py-7 pr-4 transition duration-200 ease-out first:border-t hover:scale-105 hover:opacity-80 hover:shadow-lg sm:flex-row">
      <div className="relative aspect-[5/3] w-full flex-shrink-0 sm:h-48 sm:w-80">
        <div className="animate-pulse h-full w-full rounded-2xl bg-gray-300 " />
      </div>
      <div className="flex flex-grow flex-col justify-between pt-6 sm:pl-5 sm:pt-0">
        <div className="flex flex-col gap-4">
          <div className="animate-pulse h-6 w-1/6 rounded-md bg-gray-300 " />
          <div className="animate-pulse h-6 w-1/3 rounded-md bg-gray-300 " />
          <div className="animate-pulse h-6 w-2/5 rounded-md bg-gray-300 " />
        </div>
        <div className="flex flex-col gap-3">
        <div className="animate-pulse self-end h-6 w-1/6 rounded-md bg-gray-300 " />
        <div className="animate-pulse self-end h-6 w-1/12 rounded-md bg-gray-300 " />
        </div>
      </div>
    </div>
  );
}

export default SkeletonInfoCard;
