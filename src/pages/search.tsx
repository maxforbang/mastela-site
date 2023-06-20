import type { NextPageWithLayout } from "./_app";
import ListingCard from "~/components/search/ListingCard";
import Map from "~/components/search/Map";
import Layout from "~/components/Layout";
import type { ReactElement, ReactNode } from "react";
import { SearchBar } from "~/components/home/HeroSection";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import SkeletonInfoCard from "~/components/search/SkeletonInfoCard";
import React from "react";

export type UnitDetails = {
  img: string;
  title: string;
  description: string;
  star: number;
  price: string;
  total: string;
  long: number;
  lat: number;
};

const SearchPage: NextPageWithLayout = () => {
  const router = useRouter();

  if (!router.isReady) {
    return null;
  }

  const { arrival, departure } = router.query;

  const { data: properties, isLoading } =
    api.properties.getAvailableProperties.useQuery({
      startDate: arrival as string,
      endDate: departure as string,
    });

  if (!isLoading && !properties) {
    void router.push("/our-villas");
    return null;
  }

  return (
    <ListingsLayout arrival={arrival as string} departure={departure as string}>
      {isLoading
        ? Array.from(Array(3)).map((_, index) => <SkeletonInfoCard key={`skeleton-listing-card-${index}`}/>)
        : properties?.map((property) => (
            <ListingCard
              key={`${property.slug.current}-listing-card`}
              listing={property}
              arrival={arrival as string}
              departure={departure as string}
            />
          ))}
    </ListingsLayout>
  );
};

export default SearchPage;

SearchPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export function ListingsLayout({
  children,
  arrival,
  departure,
}: {
  children: ReactNode;
  arrival?: string;
  departure?: string;
}) {
  const searchMessage = (
    <div className="mx-auto flex flex-col text-center text-2xl font-light leading-10">
      <div>There are no available villas for these dates.</div>
      <div>Please try a different selection.</div>
    </div>
  );

  return (
    <div>
      <main className="flex">
        <section className="flex-grow px-6 pt-8">
          <h2 className="text-center text-3xl tracking-tight text-gray-900 sm:text-4xl">
            Our Luxury Villas
          </h2>
          <div className="mx-auto my-8 w-full md:w-2/3 lg:mb-12">
            <SearchBar dates={{ startDate: arrival, endDate: departure }} />
          </div>
          <>
            {/* TODO: Add sorting by price and by room/beds */}
            {React.Children.toArray(children).length ? (
              <div className="">
                <div className="my-5 space-x-3 whitespace-nowrap text-gray-800">
                  <p className="button">Cancellation Flexibility</p>
                  <p className="button">Type of Place</p>
                  <p className="button">Price</p>
                  <p className="button">Rooms and Beds</p>
                  <p className="button">More filters</p>
                </div>
              </div>
            ) : null}

            <div className="flex flex-col">
              {React.Children.toArray(children).length
                ? children
                : searchMessage}
            </div>
          </>
        </section>

        <section className="hidden cursor-pointer lg:inline-flex lg:min-w-[600px]">
          {/* TODO: Make map screen height and sticky  
          (right now, map height fits to first render - on search page it's the skeleton cards, on our-villas it's no properties) */}
          <Map />
        </section>
      </main>
    </div>
  );
}
