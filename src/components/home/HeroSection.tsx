import Image from "next/image";
import React from "react";
// import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

function HeroSection() {
  return (
    <div className="">
      <div className="relative -mx-8 h-75vh lg:-mx-12 ">
        <Image
          className="-z-10"
          fill
          style={{ objectFit: "cover" }}
          src={"/images/Encore.jpg"}
          alt=""
        />
        <div className=" absolute bottom-20 left-1/2 flex w-2/3 -translate-x-1/2 items-center md:w-7/12 lg:w-1/2 xl:w-1/3">
          <SearchBar />
        </div>
      </div>
    </div>
  );
}

export default HeroSection;

export function SearchBar() {
  return (
    <div className="flex w-full rounded-full border-2 border-slate-300 bg-white py-2 shadow-sm">
      <div className="flex flex-grow pl-6">
        <div className="flex">
          <input
            className="mx-2 w-1/3 bg-transparent outline-none"
            type="text"
            placeholder="Check-in"
          />
          <input
            className="mx-2 w-1/3 bg-transparent outline-none"
            type="text"
            placeholder="Check-out"
          />

          <input
            className="mx-2 mr-0 w-1/3 bg-transparent outline-none"
            type="text"
            placeholder="Guests"
          />
        </div>
      </div>
      <svg
        className="mr-2 h-10 drop-shadow"
        width="49"
        height="49"
        viewBox="0 0 49 49"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="24.5" cy="24.5" r="24" fill="url(#paint0_linear_32_2605)" />
        <circle cx="23" cy="23" r="5.98611" stroke="white" stroke-width="3" />
        <line
          x1="32.4492"
          y1="33.0508"
          x2="26.0852"
          y2="26.6869"
          stroke="white"
          stroke-width="3"
        />
        <defs>
          <linearGradient
            id="paint0_linear_32_2605"
            x1="24.5"
            y1="0.5"
            x2="24.5"
            y2="48.5"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#0694D8" />
            <stop offset="1" stop-color="#00DFD8" />
          </linearGradient>
        </defs>
      </svg>
      {/* <MagnifyingGlassIcon className="shadow mx-4 h-10 flex-shrink-0 rounded-full bg-sky-500 p-2 text-white" /> */}
    </div>
  );
}
