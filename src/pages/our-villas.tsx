// import { format } from "date-fns";

// import { useRouter } from "next/router";
import type { NextPageWithLayout } from "./_app";
import InfoCard from "~/components/search/InfoCard";
import Map from "~/components/search/Map";
import Layout from "~/components/Layout";
import type { ReactElement } from "react";
import { SearchBar } from "~/components/home/HeroSection";

export type UnitDetails = {
  img: string;
  location: string;
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


//const SearchPage: NextPageWithLayout<SearchPageProps> = ({ searchResults }: {searchResults: UnitDetails[]}) => {
const SearchPage: NextPageWithLayout = () => {

  // const router = useRouter();
  // const { location, startDate, endDate, noOfGuests } = router.query;
  // const formattedStartDate = format(new Date(2023, 4, 28), "dd MMMM yy");
  // const formattedEndDate = format(new Date(2023, 4, 28), "dd MMMM yy");

  //const dateRange = `${formattedStartDate} - ${formattedEndDate}`;


  const searchResults = [{"img":"https://links.papareact.com/xqj","location":"Private room in center of London","title":"Stay at this spacious Edwardian House","description":"1 guest · 1 bedroom · 1 bed · 1.5 shared bthrooms · Wifi · Kitchen · Free parking · Washing Machine","star":4.73,"price":"£30 / night","total":"£117 total","long":-0.0022275,"lat":51.5421655},{"img":"https://links.papareact.com/hz2","location":"Private room in center of London","title":"Independant luxury studio apartment","description":"2 guest · 3 bedroom · 1 bed · 1.5 shared bthrooms · Wifi · Kitchen","star":4.3,"price":"£40 / night","total":"£157 total","long":-0.095091,"lat":51.48695},{"img":"https://links.papareact.com/uz7","location":"Private room in center of London","title":"London Studio Apartments","description":"4 guest · 4 bedroom · 4 bed · 2 bathrooms · Free parking · Washing Machine","star":3.8,"price":"£35 / night","total":"£207 total","long":-0.135638,"lat":51.521916},{"img":"https://links.papareact.com/6as","location":"Private room in center of London","title":"30 mins to Oxford Street, Excel London","description":"1 guest · 1 bedroom · 1 bed · 1.5 shared bthrooms · Wifi · Kitchen · Free parking · Washing Machine","star":4.1,"price":"£55 / night","total":"£320 total","long":-0.069961,"lat":51.472618},{"img":"https://links.papareact.com/xhc","location":"Private room in center of London","title":"Spacious Peaceful Modern Bedroom","description":"3 guest · 1 bedroom · 1 bed · 1.5 shared bthrooms · Wifi · Free parking · Dry Cleaning","star":5.0,"price":"£60 / night","total":"£450 total","long":-0.08472,"lat":51.510794},{"img":"https://links.papareact.com/pro","location":"Private room in center of London","title":"The Blue Room In London","description":"2 guest · 1 bedroom · 1 bed · 1.5 shared bthrooms · Wifi · Washing Machine","star":4.23,"price":"£65 / night","total":"£480 total","long":-0.094116,"lat":51.51401},{"img":"https://links.papareact.com/8w2","location":"Private room in center of London","title":"5 Star Luxury Apartment","description":"3 guest · 1 bedroom · 1 bed · 1.5 shared bthrooms · Wifi · Kitchen · Free parking · Washing Machine","star":3.85,"price":"£90 / night","total":"£650 total","long":-0.109889,"lat":51.521245}]

  return (
    <div>
      <main className="flex">
        <section className="flex-grow px-6 pt-8">
          <h2 className="text-center text-3xl tracking-tight text-gray-900 sm:text-4xl">
            Our Luxury Villas
          </h2>

          {/* <h1 className=" mt-2 text-3xl font-semibold">
            4 villas available
          </h1>
          <p className="text-xs mb-6">
            April 1st - June 30th             
          </p> */}
          <div className="mx-auto my-8 lg:mb-16 w-full md:w-2/3">
            <SearchBar />
          </div>
          <div className="">
            <div className="my-5 space-x-3 whitespace-nowrap text-gray-800">
              <p className="button">Cancellation Flexibility</p>
              <p className="button">Type of Place</p>
              <p className="button">Price</p>
              <p className="button">Rooms and Beds</p>
              <p className="button">More filters</p>
            </div>
          </div>

          <div className="flex flex-col">
            {searchResults.map(
              ({ img, location, title, description, star, price, total }: UnitDetails) => (
                <InfoCard
                  key={img}
                  img={img}
                  location={location}
                  title={title}
                  description={description}
                  star={star}
                  price={price}
                  total={total}
                  long={0}
                  lat={0}
                />
              )
            )}
          </div>
        </section>

        <section className="hidden lg:inline-flex lg:min-w-[600px] cursor-pointer">
          <Map searchResults={searchResults} />
        </section>
      </main>
    </div>
  );
};

export default SearchPage;

SearchPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// export async function getServerSideProps() {
//   const searchResults = await fetch("https://links.papareact.com/isz").then(res => res.json());

//   return {
//     props: {
//       searchResults,
//     },
//   };
// }
