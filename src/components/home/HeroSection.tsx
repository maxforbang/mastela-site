import { addDays, addYears, format, parseISO } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { DateRange } from "react-date-range";
// import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { formatDateEnglish } from "~/utils/functions/dates/formatDateEnglish";
import { classNames, formatDateUrl } from "~/utils/functions/functions";

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
        <div className=" absolute bottom-20 left-1/2 flex w-2/3 -translate-x-1/2 flex-col items-center md:w-7/12 lg:w-1/2 xl:w-1/3">
          <SearchBar displayTop />
        </div>
      </div>
    </div>
  );
}

export default HeroSection;

export function SearchBar({
  displayTop = false,
  overLay = false,
  dates,
}: {
  displayTop?: boolean;
  overLay?: boolean;
  dates?: { startDate: string; endDate: string };
}) {
  const currentDate = new Date();

  const intialCalendarDates = [
    {
      startDate: dates?.startDate ? parseISO(dates.startDate) : currentDate,
      endDate: dates?.endDate ? parseISO(dates.endDate) : currentDate,
      key: "selection",
    },
  ];
  const [calendarDates, setCalendarDates] = useState(intialCalendarDates);
  const [calendarShowing, setCalendarShowing] = useState(false);

  const { startDate, endDate } = calendarDates[0];

  // const arrival = formatDate(startDate);
  // const departure = formatDate(endDate);

  return (
    <div
      className={classNames(
        "relative flex flex-col",
        displayTop ? "flex-col-reverse" : ""
      )}
    >
      <div className="flex w-full rounded-full border-2 border-slate-300 bg-white py-2 shadow-sm">
        <div className="flex flex-grow pl-6">
          <div className="flex">
            <input
              className="mx-2 w-1/3 cursor-pointer bg-transparent outline-none"
              type="text"
              placeholder="Check-in"
              value={
                startDate !== endDate
                  ? formatDateEnglish(startDate)
                  : "Check-in"
              }
              readOnly
              onClick={() => setCalendarShowing(true)}
            />
            <input
              className="mx-2 w-1/3 cursor-pointer bg-transparent outline-none"
              type="text"
              placeholder="Check-out"
              value={
                startDate !== endDate
                  ? formatDateEnglish(endDate)
                  : "Check-out"
              }
              readOnly
              onClick={() => setCalendarShowing(true)}
            />

            <input
              className="mx-2 mr-0 w-1/3 bg-transparent outline-none"
              type="text"
              placeholder="Guests"
              onClick={() => setCalendarShowing(false)}
            />
          </div>
        </div>
        <Link
        onClick={() => setCalendarShowing(false)}
          href={`/search?arrival=${formatDateUrl(
            startDate
          )}&departure=${formatDateUrl(endDate)}`}
        >
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
            <circle
              cx="23"
              cy="23"
              r="5.98611"
              stroke="white"
              stroke-width="3"
            />
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
      </div>
      <div
        className={classNames(
          "w-full",
          !calendarShowing ? "hidden" : "",
          overLay
            ? displayTop
              ? "absolute bottom-full z-10"
              : "absolute top-full z-10"
            : ""
        )}
      >
        <DateRange
          className={classNames("my-1 rounded-2xl")}
          onChange={(item) => setCalendarDates([item.selection])}
          months={1}
          ranges={calendarDates}
          direction="vertical"
          minDate={new Date()}
          maxDate={addYears(new Date(), 2)}
          disabledDates={[]}
          // disabledDay={(date) => date.getDay() === 4}
          preventSnapRefocus={true}
          fixedHeight
          // scroll={{ enabled: true }}
        />
      </div>
    </div>
  );
}
