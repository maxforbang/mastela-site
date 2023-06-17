import Layout from "~/components/Layout";
import type { NextPageWithLayout } from "./_app";
import { useState, type ReactElement, useEffect } from "react";
import { Disclosure } from "@headlessui/react";
import {
  ChevronDownIcon,
  ChevronRightIcon
} from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import { parseISO } from "date-fns";
import { dateToStringNumerical } from "./properties/[property]";
import { api } from "~/utils/api";
import Link from "next/link";
import { InvoiceItem } from "types";
import { classNames } from "~/utils/functions/functions";
import {
  formatCurrencyExact
} from "~/utils/functions/formatCurrency";
import { env } from "~/env.mjs";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe
} from "@stripe/react-stripe-js";
import { getBaseUrl } from "~/utils/functions/getBaseUrl";
import { DateRangePicker } from "~/components/DateRangePicker";

const subtotal = "$19,483.00";
const discount = { code: "CHEAPSKATE", amount: "$24.00" };
const taxes = "$00.03";
const fees = "$1024.00";
const total = "$20,483.03";
const products = [
  {
    id: 1,
    name: "Villa Encore",
    href: "#",
    price: "$426.00",
    dates: "4/1/2023 - 6/30/2023",
    size: "",
    imageSrc: "images/Encore.jpg",
    imageAlt:
      "Moss green canvas compact backpack with double top zipper, zipper front pouch, and matching carry handle and backpack straps.",
  },
  // More products...
];

const stripe = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// const appearance = {
//   theme: 'stripe'
// };

// loader = 'auto'

// TODO: Add getServerSideProps
const CheckoutPage: NextPageWithLayout = () => {
  return <Checkout />;
};

export default CheckoutPage;

CheckoutPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

function Checkout() {
  const router = useRouter();

  if (!router.isReady) {
    return null;
  }

  const { property: slug, arrival, departure } = router.query;

  if (!slug || !arrival || !departure) {
    let message = "";
    if (!slug) {
      message = "Please pick a property before proceeding to checkout.";
    }

    if (!arrival) {
      message = "Please select an arrival date before proceeding to checkout.";
    }

    if (!departure) {
      message = "Please select a departure date before proceeding to checkout.";
    }

    return (
      <div className="mt-12 flex flex-col justify-center">
        <p className="mx-auto text-xl">{message}</p>
        <div className="mx-auto mt-4">
          <Link href="/our-villas" className="text-l font-semibold leading-7 ">
            <span aria-hidden="true">&larr;</span> Back to Our Villas
          </Link>
        </div>
      </div>
    );
  }

  const utils = api.useContext();
  const [dates, setDates] = useState({
    startDate: arrival,
    endDate: departure,
  });

  const [paymentIntentQueryEnabled, setPaymentIntentQueryEnabled] =
    useState(true);

  const { data: clientSecret } = api.properties.getClientSecret.useQuery(
    {
      slug: slug as string,
      startDate: dates.startDate as string,
      endDate: dates.endDate as string,
    },
    {
      enabled: paymentIntentQueryEnabled,
    }
  );

  useEffect(() => {
    if (clientSecret) {
      setPaymentIntentQueryEnabled(false);
    }
  }, [clientSecret]);

  useEffect(() => {
    if (arrival !== dates.startDate || departure !== dates.endDate) {
      setPaymentIntentQueryEnabled(true);
      router.push(
        `/checkout?property=${slug}&arrival=${dates.startDate}&departure=${dates.endDate}`
      );
    }
  }, [dates]);

  return (
    <div className="mx-auto h-full max-w-7xl">
      <main className="lg:flex lg:min-h-full lg:flex-row-reverse lg:overflow-hidden">
        <h1 className="sr-only">Checkout</h1>

        <OrderSummary slug={slug} dates={dates} setDates={setDates} />

        {/* Checkout form */}
        <section
          aria-labelledby="payment-heading"
          className="flex-auto overflow-y-auto px-4 pb-16 pt-7 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-lg">
            <div className="flex gap-4">
              <p className="pb-6 text-2xl">Checkout</p>
              {/* {!clientSecret && <LoadingSpinner />} */}
            </div>

            {clientSecret ? (
              <Elements stripe={stripe} options={{ clientSecret }}>
                <CheckoutForm />
              </Elements>
            ) : (
              <SkeletonCheckoutForm />
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function CheckoutInvoiceItemDisplay({
  invoiceItem,
}: {
  invoiceItem: InvoiceItem;
}) {
  const { description, prices, subtotal } = invoiceItem;
  const hasBreakdown = prices.length > 1;

  const [showSubItems, setShowSubItems] = useState(false);

  return (
    <div className="flex flex-col">
      <div
        key={`checkout-item-${description}-invoice-item`}
        className="flex justify-between"
      >
        <div
          onClick={() => setShowSubItems(!showSubItems)}
          className={classNames(
            "flex gap-3",
            hasBreakdown ? "cursor-pointer" : ""
          )}
        >
          {description}
          {hasBreakdown ? (
            showSubItems ? (
              <ChevronRightIcon className="h-6 rounded-md border" />
            ) : (
              <ChevronDownIcon className="h-6 rounded-md border" />
            )
          ) : null}
        </div>
        <div className="text-gray-900">{formatCurrencyExact(subtotal)}</div>
      </div>

      {hasBreakdown && showSubItems ? (
        <div className="mt-2 flex flex-col gap-2 border-l-2 pl-4">
          {prices.map((price) => {
            return (
              <div
                key={`checkout-subitem-${price.description}-${price.uid}`}
                className="flex justify-between gap-2"
              >
                <p>{price.description}</p>
                <p className="">{formatCurrencyExact(price.amount)}</p>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );

  // TODO: Add discount item displays:
  //   <div className="flex justify-between">
  //   <dt className="flex">
  //     Discount
  //     <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs tracking-wide text-gray-600">
  //       {discount.code}
  //     </span>
  //   </dt>
  //   <dd className="text-gray-900">-{discount.amount}</dd>
  // </div>
}

function OrderSummary({ slug, dates, setDates }) {
  const {
    data: pricingInfo,
    isLoading,
    isError,
    error,
    isLoadingError,
    isSuccess,
  } = api.properties.getQuote.useQuery(
    {
      slug: slug as string,
      startDate: dates.startDate as string,
      endDate: dates.endDate as string,
    },
    {
      retry: 0,
    }
  );

  const [errorMsg, setErrorMsg] = useState("");

  if (isError && errorMsg !== error.message) {
    setErrorMsg(error.message);
  } else if (isSuccess && errorMsg.length) {
    setErrorMsg("");
  }

  let propertyName = "";
  let totalPrice = 0;
  let pricePerNight = "";
  let invoiceItems = [];

  if (isSuccess && pricingInfo !== null) {
    ({ propertyName, totalPrice, pricePerNight, invoiceItems } = pricingInfo);
  }

  return (
    <>
      {/* Mobile order summary */}
      <section
        aria-labelledby="order-heading"
        className="bg-gray-50 px-4 py-6 sm:px-6 lg:hidden"
      >
        <Disclosure as="div" className="mx-auto max-w-lg">
          {({ open }) => (
            <>
              <div className="flex items-center justify-between">
                <h2
                  id="order-heading"
                  className="text-lg font-medium text-gray-900"
                >
                  Your Booking
                </h2>
                <Disclosure.Button className="font-medium text-indigo-600 hover:text-indigo-500">
                  {open ? (
                    <span>Hide full summary</span>
                  ) : (
                    <span>Show full summary</span>
                  )}
                </Disclosure.Button>
              </div>

              <Disclosure.Panel>
                <ul
                  role="list"
                  className="divide-y divide-gray-200 border-b border-gray-200"
                >
                  {products.map((product) => (
                    <li key={product.id} className="flex space-x-6 py-6">
                      <img
                        src={product.imageSrc}
                        alt={product.imageAlt}
                        className="h-40 w-40 flex-none rounded-md bg-gray-200 object-cover object-center"
                      />
                      <div className="flex flex-col justify-between space-y-4">
                        <div className="space-y-1 text-sm font-medium">
                          <h3 className="text-gray-900">{product.name}</h3>
                          <p className="text-gray-900">
                            {product.price} per night
                          </p>
                          <br />
                          <p className="text-gray-500">{product.dates}</p>
                          <button
                            type="button"
                            className="text-sm font-medium text-sky-600 hover:text-sky-500"
                          >
                            Edit Dates
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <form className="mt-10">
                  <label
                    htmlFor="discount-code-mobile"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Discount code
                  </label>
                  <div className="mt-1 flex space-x-4">
                    <input
                      type="text"
                      id="discount-code-mobile"
                      name="discount-code-mobile"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <button
                      type="submit"
                      className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                    >
                      Apply
                    </button>
                  </div>
                </form>

                <div className="mt-10 space-y-6 text-sm font-medium text-gray-500">
                  <div className="flex justify-between">
                    <dt>Subtotal</dt>
                    <dd className="text-gray-900">{subtotal}</dd>
                  </div>

                  <div className="flex justify-between">
                    <dt>Taxes</dt>
                    <dd className="text-gray-900">{taxes}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Fees</dt>
                    <dd className="text-gray-900">{fees}</dd>
                  </div>
                </div>
              </Disclosure.Panel>

              <p className="mt-6 flex items-center justify-between border-t border-gray-200 pt-6 text-sm font-medium text-gray-900">
                <span className="text-base">Total</span>
                <span className="text-base">{total}</span>
              </p>
            </>
          )}
        </Disclosure>
      </section>

      {/* Desktop Order summary */}
      <section
        aria-labelledby="summary-heading"
        className="relative hidden w-full max-w-md flex-col bg-gray-50 lg:flex"
      >
        <h2 id="summary-heading" className="sr-only">
          Order summary
        </h2>

        <ul role="list" className="flex-auto  overflow-y-auto px-6">
          {/* TODO: Don't map over products */}
          {products.map((product) => (
            <li key={product.id} className="flex space-x-6 py-6">
              <img
                src={product.imageSrc}
                alt={product.imageAlt}
                className="h-40 w-40 flex-none rounded-md bg-gray-200 object-cover object-center"
              />
              <div className="flex flex-col justify-between space-y-4">
                <div className="space-y-1 text-sm font-medium">
                  <h3 className="text-gray-900">{propertyName}</h3>
                  {pricePerNight > 0 && (
                    <p className="text-gray-900">{pricePerNight} per night</p>
                  )}
                  <br />
                  <p className="text-gray-500">{`${dateToStringNumerical(
                    dates.startDate
                  )} - ${dateToStringNumerical(dates.endDate)}`}</p>

                  <CalendarPopUp dates={dates} setDates={setDates} property={slug}/>
                </div>
              </div>
            </li>
          ))}
          <p className="mt-6 w-full animate-bounce px-8 text-rose-600">
            {errorMsg}
          </p>
        </ul>
        <div className="sticky bottom-0 flex-none border-t border-gray-200 bg-gray-50 p-6">
          <form>
            <label
              htmlFor="discount-code"
              className="block text-sm font-medium text-gray-700"
            >
              Discount code
            </label>
            <div className="mt-1 flex space-x-4">
              <input
                type="text"
                id="discount-code"
                name="discount-code"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <button
                type="submit"
                className="rounded-md bg-gray-200 px-4 py-1 text-sm font-medium text-gray-600 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
              >
                Apply
              </button>
            </div>
          </form>

          <div className="mt-10 flex flex-col space-y-6 text-sm font-medium text-gray-500">
            {invoiceItems.map((invoiceItem: InvoiceItem, index) => {
              return <CheckoutInvoiceItemDisplay invoiceItem={invoiceItem} />;
            })}
            <div className="flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900">
              <dt className="text-base">Total</dt>
              <dd className="text-base">{formatCurrencyExact(totalPrice)}</dd>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (event) => {
    // Prevent refreshing page on submit
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: `${getBaseUrl()}/confirmation`,

        // shipping_details: {
        //   name: "John Snow",
        //   phone: "703-679-7985",
        //   email: "Test-email@gmail.com",
        // },
        receipt_email: email,
        shipping: {
          name: name,
          address: {
            line1: "",
          },
          phone: phone,
        },
      },
    });

    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      setErrorMessage(error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <LinkAuthenticationElement
        onChange={(event) => setEmail(event.value.email)}
      />
      <div className="mt-4 flex gap-3">
        <label
          htmlFor="name"
          className="mb-2 flex w-full transform-gpu flex-col text-sm text-gray-600 transition-opacity duration-500"
        >
          Full Name
          <input
            type="text"
            className="focus:shadow-outline-blue rounded border border-gray-300 bg-white px-3 py-2 shadow-sm transition-all duration-150 focus:border-blue-500 focus:outline-none"
            id="name"
            name="name"
            autoComplete="name" // Enable auto-fill for name
            required
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <label
          htmlFor="phone"
          className="mb-2 flex w-full transform-gpu flex-col text-sm text-gray-600 transition-opacity duration-500"
        >
          Phone
          <input
            type="tel"
            className="focus:shadow-outline-blue rounded border border-gray-300 bg-white px-3 py-2 shadow-sm transition-all duration-150 focus:border-blue-500 focus:outline-none"
            id="phone"
            name="phone"
            autoComplete="tel" // Enable auto-fill for phone
            required
            onChange={(event) => setPhone(event.target.value)}
          />
        </label>
      </div>
      <PaymentElement className="mt-3" />
      <button
        disabled={!stripe}
        type="submit"
        className="mx-auto mt-9 flex w-full items-center justify-center rounded-md border border-transparent bg-sky-500 py-2 text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
      >
        <p>Book Now</p>
      </button>
      <p className="pt-5 text-center text-rose-600">
        {errorMessage && <div>{errorMessage}</div>}
      </p>
    </form>
  );
}

function SkeletonCheckoutForm() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-4">
        <div className="flex flex-1 flex-col gap-1">
          <div className="h-3 w-1/4 animate-pulse rounded-md bg-gray-300 " />
          <div className="h-10 w-full animate-pulse rounded-md bg-gray-300 " />
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <div className="h-3 w-1/4 animate-pulse rounded-md bg-gray-300 " />
          <div className="h-10 w-full animate-pulse rounded-md bg-gray-300 " />
        </div>
      </div>
      {Array.from(Array(3)).map((item, index) => {
        return (
          <div className="flex flex-col gap-1">
            <div className="h-3 w-1/4 animate-pulse rounded-md bg-gray-300 " />
            <div className="h-10 w-full animate-pulse rounded-md bg-gray-300 " />
          </div>
        );
      })}
      <button
        disabled
        type="submit"
        className="mx-auto mt-3 flex w-full animate-pulse items-center justify-center rounded-lg border-4 border-gray-300 bg-white  py-2 text-gray-400 hover:bg-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
      >
        Book Now
      </button>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div role="status">
      <svg
        aria-hidden="true"
        className="mr-2 h-7  animate-spin fill-gray-400 text-gray-200 dark:text-gray-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

function CalendarPopUp({
  dates,
  setDates,
  property
}: {
  dates?: { startDate: string; endDate: string };
}) {
  const currentDate = new Date();
  const intialCalendarDates = [
    {
      startDate: dates?.startDate ? parseISO(dates.startDate) : currentDate,
      endDate: dates?.endDate ? parseISO(dates.endDate) : currentDate,
      key: "selection",
    },
  ];
  const [calendarDates, setCalendarDates] = useState(intialCalendarDates);
  const [calendarShowing, setCalendarShowing] = useState(false);

  return (
    <div className="">
      <button
        type="button"
        className="text-sm font-medium text-sky-600 hover:text-sky-500"
        onClick={() => setCalendarShowing(!calendarShowing)}
      >
        {calendarShowing ? "Cancel" : "Edit Dates"}
      </button>
      <div
        className={classNames(
          "absolute left-1/2 top-36 z-10 w-11/12 -translate-x-1/2",
          !calendarShowing ? "hidden" : ""
        )}
      >
        <div className="relative">
          <DateRangePicker
            dates={dates}
            setDates={setDates}
            setCalendarShowing={setCalendarShowing}
            property={property}      
          />
        </div>
      </div>
    </div>
  );
}
