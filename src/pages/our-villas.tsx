// import { format } from "date-fns";

// import { useRouter } from "next/router";
import type { NextPageWithLayout } from "./_app";
import ListingCard from "~/components/search/ListingCard";
import Map from "~/components/search/Map";
import Layout from "~/components/Layout";
import type { ReactElement } from "react";
import { SearchBar } from "~/components/home/HeroSection";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { formatDateUrl } from "~/utils/functions/functions";
import { addDays } from "date-fns";
import { ListingsLayout } from "./search";
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

const VillasPage: NextPageWithLayout = () => {
  //TODO: GetStaticProps instead of client fetching here
  const { data: properties = [], isLoading } = api.properties.getAllProperties.useQuery();

  return (
    <ListingsLayout>
      {isLoading
        ? Array.from(Array(3)).map(() => <SkeletonInfoCard />)
        : properties.map((property) => <ListingCard listing={property} />)}
    </ListingsLayout>
  );
};

export default VillasPage;

VillasPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
