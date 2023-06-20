// import { format } from "date-fns";

// import { useRouter } from "next/router";
import type { NextPageWithLayout } from "./_app";
import ListingCard from "~/components/search/ListingCard";
import Layout from "~/components/Layout";
import type { ReactElement } from "react";
import { api } from "~/utils/api";
import { ListingsLayout } from "./search";
import SkeletonInfoCard from "~/components/search/SkeletonInfoCard";
import type { PropertyListing } from "types";

const VillasPage: NextPageWithLayout = () => {
  //TODO: GetStaticProps instead of client fetching here
  const { data: properties = [], isLoading } =
    api.properties.getAllProperties.useQuery();

  return (
    <ListingsLayout>
      {isLoading
        ? Array.from(Array(3)).map((_, index) => (
            <SkeletonInfoCard key={`skeleton-listing-card-${index}`} />
          ))
        : properties.map((property: PropertyListing) => (
            <ListingCard
              key={`${property.slug.current}-listing-card`}
              listing={property}
            />
          ))}
    </ListingsLayout>
  );
};

export default VillasPage;

VillasPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
