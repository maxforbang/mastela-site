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

function HeroSection() {
  return (
    <div className="">
      <div className="relative -mx-8 h-75vh lg:-mx-12 ">
        <Image
        priority
          className="-z-10"
          fill
          style={{ objectFit: "cover" }}
          src='https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80'
          alt=""
        />
        <div className="absolute bottom-48 flex h-auto w-full justify-center">
          <p className="[text-shadow:_2px_4px_20px_rgb(0_0_0_/_100%)] lg:text-7xl text-6xl text-white shadow-black text-center capitalize italic">
            Start your vacation now
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

//TODO: Clean up styling. Disable auto-search on Homepage unless Guests field is also filled in.
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
  dates?: { startDate: string; endDate: string };
}) {
  const router = useRouter();
  const [dates, setDates] = useState(initialDates);
  const [calendarShowing, setCalendarShowing] = useState(false);
  const isValidEntry = dates?.startDate !== dates?.endDate;

  useEffect(() => {
    if (router.isReady && isValidEntry) {
      router.push(
        `/search?arrival=${dates?.startDate}&departure=${dates?.endDate}`
      );
    }
  }, [dates]);

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
              className={classNames(
                "mx-2 w-1/3 cursor-pointer bg-transparent text-gray-500 outline-none",
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
            <input
              className={classNames(
                "mx-2 w-1/3 cursor-pointer bg-transparent text-gray-500 outline-none",
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

            <input
              className="mx-2 mr-0 w-1/3 bg-transparent placeholder-gray-500 outline-none"
              type="text"
              placeholder="Guests"
              onClick={() => setCalendarShowing(false)}
            />
          </div>
        </div>
        <Link
          onClick={() => setCalendarShowing(false)}
          href={
            isValidEntry
              ? `/search?arrival=${dates?.startDate}&departure=${dates?.endDate}`
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
