import Image from "next/image";
import { urlFor } from "../../../sanity/lib/urlFor";
import type { PropertyListing } from "types";
import { api } from "~/utils/api";
import Link from "next/link";

const properties = [
  {
    name: "Villa Encore",
    occupancy: "5 Bed | 5 Bath | 10 Guests",
    imageUrl: "/images/Encore.jpg",
    price: "289",
  },
  // More people...
];

export default function PropertiesSection() {
  const { data: properties = [] }: {data: PropertyListing[] | undefined} =
    api.properties.getAllProperties.useQuery();

  return (
    <div className="bg-white py-12">
      <div className="mx-auto  px-6 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Welcome to the Neighborhood
          </h2>
          <p className="mt-6 text-left text-lg leading-8 text-gray-600 sm:text-center">
            Choose from our small selection of luxury villas - all included with
            our complementary Phone + iPad Smart Home Controls.
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-20 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4"
        >
          {properties.map((property: PropertyListing) => {
            const {
              name,
              slug,
              mainImage,
              occupancy: { bathrooms = 0, bedrooms = 0, guests = 0 } = {},
            } = property;

            const imageUrl = mainImage
              ? urlFor(mainImage).height(640).url()
              : "";
            return (
              <li key={`${name}-neighborhood-card`}>
                <Link href={`/properties/${slug.current}`}>
                <div className="aspect-[21/20] w-full transform cursor-pointer transition duration-300 ease-out hover:scale-105">
                  <Image
                    className="  rounded-2xl object-cover"
                    fill
                    src={imageUrl}
                    alt=""
                  />
                </div>
                <h3 className="mt-6 text-lg font-semibold leading-8 tracking-tight text-gray-900">
                  {name}
                </h3>
                </Link>
                <p className="text-base leading-7 text-gray-600">
                  {`${bedrooms} Bed | ${bathrooms} Bath | ${guests} Guests`}
                </p>
                <p className="mt-2 text-base font-bold leading-7 text-gray-600">
                  $250+ night
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
