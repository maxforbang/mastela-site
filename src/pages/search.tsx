// import { format } from "date-fns";

// import { useRouter } from "next/router";
import type { NextPageWithLayout } from "./_app";
import ListingCard from "~/components/search/ListingCard";
import Map from "~/components/search/Map";
import Layout from "~/components/Layout";
import { ReactElement, ReactNode, useEffect } from "react";
import { SearchBar } from "~/components/home/HeroSection";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { formatDateUrl } from "~/utils/functions/functions";
import { addDays } from "date-fns";
import SkeletonInfoCard from "~/components/search/SkeletonInfoCard";

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

// type SearchPageProps = {
//   searchResults: UnitDetails[];
// };
export const searchResults = [
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
  {
    img: "https://links.papareact.com/hz2",
    location: "Private room in center of London",
    title: "Independant luxury studio apartment",
    description:
      "2 guest · 3 bedroom · 1 bed · 1.5 shared bthrooms · Wifi · Kitchen",
    star: 4.3,
    price: "£40 / night",
    total: "£157 total",
    long: -0.095091,
    lat: 51.48695,
  },
  {
    img: "https://links.papareact.com/uz7",
    location: "Private room in center of London",
    title: "London Studio Apartments",
    description:
      "4 guest · 4 bedroom · 4 bed · 2 bathrooms · Free parking · Washing Machine",
    star: 3.8,
    price: "£35 / night",
    total: "£207 total",
    long: -0.135638,
    lat: 51.521916,
  },
  {
    img: "https://links.papareact.com/6as",
    location: "Private room in center of London",
    title: "30 mins to Oxford Street, Excel London",
    description:
      "1 guest · 1 bedroom · 1 bed · 1.5 shared bthrooms · Wifi · Kitchen · Free parking · Washing Machine",
    star: 4.1,
    price: "£55 / night",
    total: "£320 total",
    long: -0.069961,
    lat: 51.472618,
  },
  {
    img: "https://links.papareact.com/xhc",
    location: "Private room in center of London",
    title: "Spacious Peaceful Modern Bedroom",
    description:
      "3 guest · 1 bedroom · 1 bed · 1.5 shared bthrooms · Wifi · Free parking · Dry Cleaning",
    star: 5.0,
    price: "£60 / night",
    total: "£450 total",
    long: -0.08472,
    lat: 51.510794,
  },
  {
    img: "https://links.papareact.com/pro",
    location: "Private room in center of London",
    title: "The Blue Room In London",
    description:
      "2 guest · 1 bedroom · 1 bed · 1.5 shared bthrooms · Wifi · Washing Machine",
    star: 4.23,
    price: "£65 / night",
    total: "£480 total",
    long: -0.094116,
    lat: 51.51401,
  },
  {
    img: "https://links.papareact.com/8w2",
    location: "Private room in center of London",
    title: "5 Star Luxury Apartment",
    description:
      "3 guest · 1 bedroom · 1 bed · 1.5 shared bthrooms · Wifi · Kitchen · Free parking · Washing Machine",
    star: 3.85,
    price: "£90 / night",
    total: "£650 total",
    long: -0.109889,
    lat: 51.521245,
  },
];

//const SearchPage: NextPageWithLayout<SearchPageProps> = ({ searchResults }: {searchResults: UnitDetails[]}) => {
const SearchPage: NextPageWithLayout = () => {
  const router = useRouter();

  if (!router.isReady) {
    return null
  }

  const { arrival, departure, noOfGuests } = router.query;

  const {
    data: properties,
    isLoading,
    isSuccess,
  } = api.properties.getAvailableProperties.useQuery({
    startDate: arrival,
    endDate: departure,
  });

  if (!isLoading && !properties) {
    router.push("/our-villas");
    return null;
  }

  return (
    <ListingsLayout arrival={arrival} departure={departure}>
      {isLoading
        ? Array.from(Array(3)).map(() => <SkeletonInfoCard />)
        : properties.map((property) => (
            <ListingCard
              listing={property}
              arrival={arrival}
              departure={departure}
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
            {children?.length ? (
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
              {children?.length ? children : searchMessage}
            </div>
          </>
        </section>

        <section className="hidden cursor-pointer lg:inline-flex lg:min-w-[600px]">
          {/* TODO: Make map screen height and sticky  
          (right now, map height fits to first render - on search page it's the skeleton cards, on our-villas it's no properties) */}
          <Map searchResults={searchResults} />
        </section>
      </main>
    </div>
  );
}
