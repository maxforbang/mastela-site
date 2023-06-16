import Image from "next/image";
import { classNames } from "~/utils/functions/functions";

export default function AmenitiesSection() {
  return (
    <div className="min-h-screen bg-white py-8 sm:py-32 sm:pb-16 sm:pt-10">
      <div className="mx-auto lg:px-4">
        <div className="mx-auto sm:text-center">
          <h2 className="text-3xl text-gray-900 sm:text-5xl">
            Luxury Waterfront Smart Homes
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            Enjoy the comfort and convenience of state-of-the-art technology,
            premium amenities, and stunning waterfront views in Cape Coral, FL.
          </p>
        </div>
        <div className="mt-10 grid w-full grid-cols-1 gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 [&>*:nth-child(1)]:xl:col-span-2 [&>*:nth-child(2)]:xl:col-span-2 [&>*:nth-child(5)]:hidden [&>*:nth-child(5)]:lg:block [&>*:nth-child(6)]:hidden [&>*:nth-child(6)]:lg:block">
          {[0, 0, 0, 0, 0, 0].map((item, index) => (
            <AmenitiesCard key={`amenities-${index}`} large={index <= 1}/>
          ))}
        </div>
      </div>
    </div>
  );
}

function AmenitiesCard({large=false}) {
  return (
    <section className="bg-white">
      <div className={classNames("cursor-pointer relative mx-auto h-64 rounded-2xl  shadow-md md:h-96 transform transition duration-300 ease-out first-of-type:hover:z-10", large ? "hover:scale-102" : "hover:scale-105")}>
        <Image
          className="rounded-2xl"
          fill
          style={{ objectFit: "cover" }}
          src={"/images/Encore.jpg"}
          alt=""
        />
      </div>
    </section>
  );
}
