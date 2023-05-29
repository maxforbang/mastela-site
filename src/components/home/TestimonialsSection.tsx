import { StarIcon } from "@heroicons/react/20/solid";

export default function TestimonialsSection() {
  return (
    <div className="bg-white py-8 sm:py-32 sm:pb-16">
      <div className="mx-auto lg:px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            What Our Guests Are Saying
          </h2>
          <p className="mt-6 text-lg leading-8 text-left sm:text-center text-gray-600">
            Don’t take our word for it - have a look at some of the many reviews
            we’ve received from sites like AirBnB, Vrbo, and Booking.com
          </p>
        </div>
        <div className="grid grid-cols-1 pt-6 lg:grid-cols-2 2xl:grid-cols-3">
          {[0, 0, 0, 0].map((item, index) => (
            <TestimonialCard key={`amenities-${index}`}/>
          ))}
        </div>
      </div>
    </div>
  );
}

function TestimonialCard() {
  return (
    <section className="bg-white px-6 py-8 last-of-type:hidden last-of-type:lg:block last-of-type:2xl:hidden">
      <figure className="mx-auto h-full  max-w-2xl rounded-2xl border p-12 shadow-lg">
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
            “Qui dolor enim consectetur do et non ex amet culpa sint in ea non
            dolore. Enim minim magna anim id minim eu cillum sunt dolore
            aliquip.”
          </p>
        </blockquote>
        <figcaption className="mt-10 flex items-center gap-x-6">
          <img
            className="h-12 w-12 rounded-full bg-gray-50"
            src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=1024&h=1024&q=80"
            alt=""
          />
          <div className="text-sm leading-6">
            <div className="font-semibold text-gray-900">Judith Black</div>
            <div className="mt-0.5 text-gray-600">CEO of Workcation</div>
          </div>
        </figcaption>
      </figure>
    </section>
  );
}
