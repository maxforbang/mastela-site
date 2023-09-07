import { Disclosure } from '@headlessui/react'
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline'
import type { FAQ } from 'types'

//TODO: More detailed FAQ's (copy Roelens) + Import from Sanity
const faqs: FAQ[] = [
  {
    question: "What is the cancellation policy?",
    answer:
      "Cancellation policies can vary depending on the season and the specific property, but in general we offer very flexible cancellation options with full refunds if the cancellation is made within a certain timeframe prior to the scheduled stay. This is usually between 1-4 weeks before the stay. Be sure to read your particular contract's cancellation policy carefully when booking to understand the terms and conditions.",
  },
  {
    question: "What times are check-in / check-out?",
    answer:
      "Check-in time is after 4 pm and check-out time is by 10 am. We do our best to make the check-in and check-out process as smooth and convenient as possible for our guests, and we appreciate your cooperation in adhering to these times. If you need to make alternative arrangements for check-in or check-out, please let us know in advance and we will do our best to accommodate your needs.",
  },
  // {
  //   question: "What amenities are included in a luxury villa?",
  //   answer:
  //     "Portable Text from Sanity",
  // },
  {
    question: "Can I bring pets to the villa?",
    answer:
      "Absolutely! At Mastela, we absolutely love pets and are happy to welcome furry friends as long as they are dogs under 50 lbs. We understand that pets are part of the family, and we want you to be able to enjoy your vacation with your furry companion by your side. Just make sure to let us know in advance if you plan on bringing your dog with you so we can make any necessary arrangements. We can't wait to meet your four-legged friend!",
  },
  {
    question: "What's the best way to plan fun activities for my vacation?",
    answer:
      "We recommend that you start by creating an itinerary for your trip, which can help you stay organized and ensure that you don't miss out on any must-see attractions or activities. Mastela offers a local area guide that includes many fun activities and attractions in the area. Our guide can help you discover new and exciting things to do during your stay, whether you're looking for outdoor adventures, cultural experiences, or family-friendly activities. We encourage our guests to take advantage of our local area guide and plan ahead to make the most out of their vacation. Whether you're interested in hiking, sightseeing, or trying out new restaurants and bars, we have plenty of recommendations to help you have an unforgettable trip.",
  },
  // More questions...
]

export default function FAQSection() {
  return (
    <div className="bg-white">
      <div className="mx-auto px-6 py-16 pb-24 lg:px-40">
        <div className="mx-auto  divide-y divide-gray-900/10">
          <h2 className="sm:text-4xl text-3xl font-bold leading-10 text-center tracking-tight text-gray-900">Frequently Asked Questions</h2>
          <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
            {faqs.map((faq) => (
              <Disclosure as="div" key={faq.question} className="pt-6">
                {({ open }) => (
                  <>
                    <dt>
                      <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                        <span className="text-base font-semibold leading-7">{faq.question}</span>
                        <span className="ml-6 flex h-7 items-center">
                          {open ? (
                            <MinusSmallIcon className="h-6 w-6" aria-hidden="true" />
                          ) : (
                            <PlusSmallIcon className="h-6 w-6" aria-hidden="true" />
                          )}
                        </span>
                      </Disclosure.Button>
                    </dt>
                    <Disclosure.Panel as="dd" className="mt-2 pr-12">
                      <p className="text-base leading-7 text-gray-600">{faq.answer}</p>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
