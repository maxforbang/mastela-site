import { addDays, addYears } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { DateRange } from "react-date-range";
// import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { formatDate } from "~/utils/functions/functions";

function HeroSection() {
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);

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
        <div className=" absolute bottom-20 left-1/2 flex w-2/3 -translate-x-1/2 flex-col items-center md:w-7/12 lg:w-1/2 xl:w-1/3">
          <SearchBar dates={state} />
          <DateRange
            className="mt-10"
            onChange={(item) => setState([item.selection])}
            months={1}
            ranges={state}
            direction="horizontal"
            // editableDateInputs={true}
            minDate={new Date()}
            maxDate={addYears(new Date(), 2)}
            disabledDates={[]}
            // disabledDay={(date) => date.getDay() === 4}
            preventSnapRefocus={true}
          />
        </div>
      </div>
    </div>
  );
}

export default HeroSection;

export function SearchBar({ dates }) {
  const { startDate = new Date(), endDate = new Date() } = dates[0];

  console.log("start");
  console.log(startDate);

  console.log("end");
  console.log(endDate);

  const arrival = formatDate(startDate);
  const departure = formatDate(endDate);

  console.log(startDate);

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
      <Link href={`/search?arrival=${arrival}&departure=${departure}`}>
        <svg
          className="mr-2 h-10 drop-shadow"
          width="49"
          height="49"
          viewBox="0 0 49 49"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="24.5"
            cy="24.5"
            r="24"
            fill="url(#paint0_linear_32_2605)"
          />
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
      </Link>
      {/* <MagnifyingGlassIcon className="shadow mx-4 h-10 flex-shrink-0 rounded-full bg-sky-500 p-2 text-white" /> */}
    </div>
  );
}
