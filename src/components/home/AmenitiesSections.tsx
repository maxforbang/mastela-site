import Image from "next/image";
import { classNames } from "~/utils/functions/functions";

const amenities = [
{text: `Smart Home Controls`, imageUrl:'https://images.unsplash.com/photo-1558002038-1055907df827?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'},
{text: 'Heated Pools & Spas', imageUrl:"https://cdn.sanity.io/images/n9q65f5k/production/41aecff97aeaf842c995a25d10d3fdf1ce34787d-3000x2000.jpg?w=1000"},
{text: 'Gulf-Access Boat Docks', imageUrl:'https://cdn.sanity.io/images/n9q65f5k/production/62f2f8adef0bd62739016504464d55959ba04f00-3000x2000.jpg?w=800'},
{text: 'Pet-Friendly Spaces', imageUrl:'https://images.unsplash.com/photo-1618173745276-71981719c0ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=512&q=80'},
{text: 'Kayaks & Bikes', imageUrl:'https://images.unsplash.com/photo-1450500392544-c2cb0fd6e3b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&h=400&q=80'},
{text: 'BBQ Grills', imageUrl:'https://cdn.sanity.io/images/n9q65f5k/production/18e5bc99ac80f7cf30befc08263ceee9520b54c0-1800x1200.jpg?w=800'},
]

export default function AmenitiesSection() {
  return (
    <div className="mx-auto min-h-screen bg-white py-8 sm:py-32 sm:pb-16 sm:pt-12">
      <div className="mx-auto lg:px-4">
        <div className="mx-auto sm:text-center ">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Luxury Waterfront Smart Homes
          </h1>
          <p className="mx-auto mt-3 sm:mt-4 max-w-2xl text-lg leading-8 text-gray-600">
            Enjoy the comfort and convenience of state-of-the-art technology,
            premium amenities, and stunning waterfront views in Cape Coral, FL.
          </p>
        </div>
        <div className="mt-10 grid w-full grid-cols-1 gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 [&>*:nth-child(1)]:xl:col-span-2 [&>*:nth-child(2)]:xl:col-span-2 [&>*:nth-child(5)]:hidden [&>*:nth-child(5)]:lg:block [&>*:nth-child(6)]:hidden [&>*:nth-child(6)]:lg:block">
          {amenities.map((amenity, index) => (
            <AmenitiesCard key={`amenities-${index}`} large={index <= 1} amenity={amenity} width={index > 1 ? 340 : 680}/>
          ))}
        </div>
      </div>
    </div>
  );
}

function AmenitiesCard({ large = false, amenity, width }) {
  return (
    <section className="">
      <div
        className={classNames(
          "relative mx-auto h-64 transform cursor-pointer overflow-hidden rounded-2xl shadow-md transition duration-300 ease-out first-of-type:hover:z-10 md:h-96",
          large ? "hover:scale-102" : "hover:scale-104"
        )}
      >
        <Image
          className="rounded-2xl"
          fill
          style={{ objectFit: "cover" }}
          src={amenity.imageUrl}
          alt=""
        />
        <div className="absolute inset-0 rounded-2xl bg-black bg-opacity-30 flex items-center justify-center "><p className="[text-shadow:_0_4px_1px_rgb(0_0_0_/_50%)] text-white font-semibold text-4xl text-center  w-2/3">{amenity.text}</p></div>
      </div>
    </section>
  );
}
