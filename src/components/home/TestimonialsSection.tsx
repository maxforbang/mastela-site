import { StarIcon } from "@heroicons/react/20/solid";

const reviews = [
  {
    name: "Shannon J",
    date: "May 2023",
    imageUrl:
      "https://a0.muscache.com/im/pictures/user/373705b5-f4de-402f-b243-1cfa0a69eb0c.jpg?aki_policy=profile_x_medium",
    text: "We absolutely fell in love with this place! Stunning house with so much to do without leaving, if you do choose to leave the area is also absolutely gorgeous with so much to see and explore. The hosts were also amazing and so helpful and accommodating 10/5 stars!",
  },
  { name: "Emily M", date: "May 2023", imageUrl: "https://a0.muscache.com/im/pictures/user/2480a6e9-f512-4c0b-8329-4beb71bf9a5b.jpg?aki_policy=profile_x_medium", text: "Mastela’s place was absolutely perfect for us, our 4 adult boys and 3 of their girlfriends. There was a room for each couple and there was plenty of lounging space that we never felt crowded whatsoever. The place was just perfect for us! I can’t speak highly enough for this place. We spent all of our time in the outdoor space enjoying the kayaks, fishing, the pool, hot tub and outdoor furniture. This will definitely be our first choice when we come back in the future!" },
  { name: "Amie L", date: "November 2022", imageUrl: "https://a0.muscache.com/im/pictures/user/080f7ec7-adf1-4276-8652-e6961f793694.jpg?aki_policy=profile_x_medium", text: "If I can stay at any of Thomases locations here in Cape Coral, I would again. He was a very responsive host, extremely accommodating, friendly, and provided a really outstanding experience for our team. This particular Airbnb is stocked full of appliances that are amenities, which added a touch of epicure class to our time here. An espresso maker! a smoothie maker! And just an all together beautiful house, highly recommended" },
  { name: "Megan T", date: "May 2023", imageUrl: "https://a0.muscache.com/im/pictures/user/User-72596762/original/07300167-f163-463e-b5d8-c59fe4b976df.jpeg?aki_policy=profile_x_medium", text: "We had a wonderful stay at this beautiful home! Anna and Thomas were easy to work with and maintained great communication. This was the definitely cleanest Airbnb I’ve ever stayed at— inside and out! There was not a speck of dust in the whole house, and the patio/pool were spotless too. The screened in pool makes all the difference.. I don’t think I saw a single bug! " },
];

interface TestimonialProps {
  name: string;
  date: string;
  imageUrl: string;
  text: string;
}

export default function TestimonialsSection() {
  return (
    <div className="bg-white py-8 sm:py-32 sm:pb-16">
      <div className="mx-auto lg:px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            What Our Guests Are Saying
          </h2>
          <p className="mt-6 text-left text-lg leading-8 text-gray-600 sm:text-center">
            Don’t take our word for it - have a look at some of the many reviews
            we’ve received from sites like AirBnB, Vrbo, and Booking.com
          </p>
        </div>
        <div className="grid grid-cols-1 pt-6 lg:grid-cols-2 2xl:grid-cols-3">
          {reviews.map((review, index) => (
            <TestimonialCard review={review} key={`amenities-${index}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TestimonialCard({review} : {review: TestimonialProps}) {
  return (
    <section className="bg-white px-6 py-8 last-of-type:hidden last-of-type:lg:block last-of-type:2xl:hidden">
      <figure className="mx-auto h-fmax  max-w-2xl rounded-2xl border p-12 shadow-lg">
        <p className="sr-only">5 out of 5 stars</p>
        <div className="flex gap-x-2 text-yellow-400">
          <StarIcon className="h-5 w-5 flex-none" aria-hidden="true" />
          <StarIcon className="h-5 w-5 flex-none" aria-hidden="true" />
          <StarIcon className="h-5 w-5 flex-none" aria-hidden="true" />
          <StarIcon className="h-5 w-5 flex-none" aria-hidden="true" />
          <StarIcon className="h-5 w-5 flex-none" aria-hidden="true" />
        </div>
        <blockquote className="mt-10 text-xl leading-8 tracking-tight text-gray-900 lg:text-2xl ">
          <p>
            {review.text}
          </p>
        </blockquote>
        <figcaption className="mt-10 flex items-center gap-x-6">
          <img
            className="h-12 w-12 rounded-full bg-gray-50"
            src={review.imageUrl}
            alt=""
          />
          <div className="text-sm leading-6">
            <div className="font-semibold text-gray-900">{review.name}</div>
            <div className="mt-0.5 text-gray-600">{review.date}</div>
          </div>
        </figcaption>
      </figure>
    </section>
  );
}
