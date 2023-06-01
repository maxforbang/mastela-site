import Layout from "~/components/Layout";
import type { NextPageWithLayout } from "../_app";
import { ReactElement, useState } from "react";
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
import { addDays, addYears } from "date-fns";
import { GetServerSideProps, GetServerSidePropsResult } from "next";
import {fetchProperties} from "../../utils/endpoints/fetchProperties"
import { PortableText } from "@portabletext/react";


const price = 350;
const guests = 10;
const bedrooms = 5;
const bathrooms = 4;
const beds = 6;

const checkoutItems = [
  {
    name: "$426 x 7 nights",
    price: 2982,
  },
  {
    name: "Weekly discount",
    price: 276,
  },
  {
    name: "Cleaning fee",
    price: 315,
  },
  {
    name: "Service fee",
    price: 105,
  },
  {
    name: "Taxes",
    price: 450,
  },
];

const PropertyPage: NextPageWithLayout = ({propertyInfo}) => {
  const {name, slug, preview} = propertyInfo[0];
  return (
    <>
      <div className="mx-auto max-w-7xl text-gray-800 sm:px-6 lg:px-8">
        <PropertyImages />

        <div className="max-w-7xl gap-16 lg:flex">
          <div className="flex w-full basis-2/3 flex-col justify-center px-6">
            <PropertyHeader name={name} />
            <PropertyFeatures />
            <PropertyDescription preview={preview}/>
            <PropertyMap />
            <AvailabilityCalendar />
            {/* Reviews */}
            {/* Contact Host */}
            {/* FAQ's / Refund */}
          </div>

          <div className="sticky top-32 mx-auto mt-12 hidden h-max w-full basis-1/3 rounded-xl border p-8 shadow-xl lg:block">
            <div className="flex items-center gap-1">
              <p className="text-xl font-semibold">$426</p>/<p> night</p>
            </div>
            <div className="mt-5 rounded-lg border">Check-in</div>
            <div className="py-5">
              <Link
                href="/checkout"
                className="text-md flex w-full rounded-lg bg-sky-500 px-6 py-3 text-center font-semibold text-white shadow-sm hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <p className="mx-auto">Reserve</p>
              </Link>
            </div>
            <div className="mt-4 flex flex-col gap-3 border-b pb-4">
              {checkoutItems.map((item) => {
                return (
                  <div className="text flex justify-between">
                    <p>{item.name}</p>
                    <p>${item.price}</p>
                  </div>
                );
              })}

            </div>
              <div className="text flex justify-between pt-4">
                <p className="font-semibold">Total</p>
                <p className="font-semibold">$3576</p>
              </div>
          </div>
        </div>
      </div>
      {/* Sticky Book Now Desktop */}

      <BookNowMobile />
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
function BookNowMobile() {
  return (
    <div className="fixed bottom-0 flex w-full items-center justify-between border-t bg-white px-6 py-5 md:hidden">
      <div className="text-sm">
        <p>${price} night</p>
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

function AvailabilityCalendar() {
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);
  return (
    <div className="border-t py-8">
      <p className="text-center text-xl font-semibold">Availability</p>
      <div className="flex sm:hidden">
        <DateRange
          className=""
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

      <div className="hidden lg:block">
        <DateRange
          className=""
          onChange={(item) => setState([item.selection])}
          months={3}
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

      <div className="hidden sm:block lg:hidden">
        <DateRange
          className=""
          onChange={(item) => setState([item.selection])}
          months={2}
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
  );
}

function PropertyMap() {
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

function PropertyImages() {
  return (
    <div className="relative aspect-[3/2] w-full">
      <Image
        className="lg:rounded-2xl"
        fill
        style={{ objectFit: "cover" }}
        src={"/images/Encore.jpg"}
        alt=""
      />
    </div>
  );
}

function PropertyHeader({name}) {
  return (
    <div className="mt-4 py-8 text-center  text-4xl">
      <p className="">{name}</p>
      <p className="border-b py-3 pb-8 text-lg">
        {guests} guests • {bedrooms} bedrooms • {beds} beds • {bathrooms} baths
      </p>
    </div>
  );
}

function PropertyDescription({preview}) {
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
// function PropertyDescription() {
//   return (

//   )
// }

export const getServerSideProps: GetServerSideProps = async (context) => {
  // const { data } = await api.properties.getAll.useQuery();
  const propertyInfo = await fetchProperties();
  
  //const {data} = api.properties.getAll.useQuery();
  //console.log(data)
  return {
    props: {
      propertyInfo
    },
  } as GetServerSidePropsResult<{ [key: string]: any }>;
};