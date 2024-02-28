import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
// import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { formatDateEnglish } from "~/utils/functions/dates/formatDateEnglish";
import { classNames, formatDateUrl } from "~/utils/functions/functions";
import { DateRangePicker } from "../DateRangePicker";
import { useRouter } from "next/router";
import type { CalendarDates } from "types";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
function HeroSection() {
  return (
    <div className="">
      <div className="relative -mx-8 h-75vh lg:-mx-12 ">
        <Image
          priority
          className="-z-10"
          fill
          style={{ objectFit: "cover" }}
          src="https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80"
          alt="Family holding hands on the beach in the sunset"
        />
        <div className="absolute bottom-80 flex h-auto w-full justify-center">
          <p className="text-center text-6xl capitalize italic text-white shadow-black [text-shadow:_2px_4px_20px_rgb(0_0_0_/_100%)] lg:text-7xl">
            Start your vacation here
          </p>
        </div>
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
  dates: initialDates = {
    startDate: formatDateUrl(new Date()),
    endDate: formatDateUrl(new Date()),
  },
}: {
  displayTop?: boolean;
  overLay?: boolean;
  dates?: CalendarDates;
}) {
  const router = useRouter();
  const [dates, setDates] = useState<CalendarDates>(initialDates);
  const [calendarShowing, setCalendarShowing] = useState(false);
  const isValidEntry = !!dates.startDate && !!dates.endDate && (dates.startDate !== dates.endDate);

  useEffect(() => {
    if (router.isReady && isValidEntry) {
      void router.push(
        `/search?arrival=${dates.startDate as string}&departure=${dates.endDate as string}`
      );
    }
  }, [dates, router.isReady, isValidEntry]);

  return (
    <div
      className={classNames(
        "relative flex flex-col",
        displayTop ? "flex-col-reverse" : ""
      )}
    >
      <div className="flex w-full rounded-full border-2 border-slate-300 bg-white py-2 shadow-sm">
        <div className="flex flex-grow w-full">
          {/* Below div was hidden on mobile before */}
          <div className="flex w-full">
            <input
              className={classNames(
                "mx-2 w-full cursor-pointer text-center bg-transparent text-gray-500 outline-none",
                isValidEntry ? "text-inherit" : ""
              )}
              type="text"
              placeholder="Check-in"
              value={
                isValidEntry ? formatDateEnglish(dates?.startDate) : "Check-in"
              }
              readOnly
              onClick={() => setCalendarShowing(true)}
            />
            <div className="w-1.5 h-full rounded bg-gray-200"></div>
            <input
              className={classNames(
                "mx-2 w-full text-center cursor-pointer bg-transparent text-gray-500 outline-none",
                isValidEntry ? "text-inherit" : ""
              )}
              type="text"
              placeholder="Check-out"
              value={
                isValidEntry ? formatDateEnglish(dates?.endDate) : "Check-out"
              }
              readOnly
              onClick={() => setCalendarShowing(true)}
            />

            {/* <input
              className="mx-2 mr-0 w-1/3 bg-transparent placeholder-gray-500 outline-none"
              type="text"
              placeholder="Guests"
              onClick={() => setCalendarShowing(false)}
            /> */}
          </div>
          {/* <div className="flex gap-4 items-center sm:hidden mr-3 pl-6">
            <CalendarDaysIcon className="h-7 w-7" />
            <p className="text-gray-500">
              View Availability
              </p>
          </div> */}
        </div>
        <Link
          onClick={() => setCalendarShowing(false)}
          href={
            isValidEntry
              ? `/search?arrival=${dates.startDate as string}&departure=${dates?.endDate as string}`
              : `/our-villas`
          }
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
              strokeWidth="3"
            />
            <line
              x1="32.4492"
              y1="33.0508"
              x2="26.0852"
              y2="26.6869"
              stroke="white"
              strokeWidth="3"
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
                <stop stopColor="#0694D8" />
                <stop offset="1" stopColor="#00DFD8" />
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
        <DateRangePicker
          dates={dates}
          setDates={setDates}
          setCalendarShowing={setCalendarShowing}
        />
      </div>
    </div>
  );
}
