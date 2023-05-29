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
          {[properties[0], properties[0], properties[0], properties[0]].map(
            (property) => (
              <li key={property?.name}>
                <div className="transform transition duration-300 ease-out hover:scale-105 cursor-pointer">
                  <img
                    className="aspect-[21/20] w-full rounded-2xl object-cover"
                    src={property?.imageUrl}
                    alt=""
                  />
                </div>
                  <h3 className="mt-6 text-lg font-semibold leading-8 tracking-tight text-gray-900">
                    {property?.name}
                  </h3>
                  <p className="text-base leading-7 text-gray-600">
                    {property?.occupancy}
                  </p>
                  <p className="mt-2 text-base font-bold leading-7 text-gray-600">
                    ${property?.price}+ night
                  </p>
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
}
