import { Disclosure } from '@headlessui/react'
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline'

const faqs = [
  {
    question: "How does one become a Chadscaler?",
    answer:
      "Leverage.",
  },
  {
    question: "How does one become a Chadscaler?",
    answer:
      "Leverage.",
  },
  {
    question: "How does one become a Chadscaler?",
    answer:
      "Leverage.",
  },
  {
    question: "How does one become a Chadscaler?",
    answer:
      "Leverage.",
  },
  {
    question: "How does one become a Chadscaler?",
    answer:
      "Leverage.",
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
