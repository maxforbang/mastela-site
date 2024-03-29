import Layout from "~/components/Layout";
import type { NextPageWithLayout } from "./_app";
import { useState, type ReactElement, useEffect } from "react";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import { dateToStringNumerical } from "./property/[property]";
import { api } from "~/utils/api";
import type {
    CalendarDates,
    CalendarComponent,
    InvoiceItem,
    BookingQuoteInfo,
} from "types";
import { classNames } from "~/utils/functions/functions";
import { formatCurrencyExact } from "~/utils/functions/formatCurrency";
import { env } from "~/env.mjs";
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    LinkAuthenticationElement,
    PaymentElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";
import { DateRangePicker } from "~/components/DateRangePicker";
import Image from "next/image";
import { urlFor } from "../../sanity/lib/urlFor";
import { getUrlParams } from "~/utils/functions/getUrlParams";
import { Disclosure } from "@headlessui/react";
import SlideOver from "~/components/SlideOver";



const stripe = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// TODO: Possbily add getServerSideProps for clientSecret
const CheckoutPage: NextPageWithLayout = () => {
  return <Checkout />;
};

export default CheckoutPage;

CheckoutPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

function Checkout() {
  const router = useRouter();

  const [slug, setSlug] = useState<string | undefined>(undefined);

  const [initialDates, setInitialDates] = useState<CalendarDates>({
    startDate: undefined,
    endDate: undefined,
  });

  const [dates, setDates] = useState<CalendarDates>({
    startDate: undefined,
    endDate: undefined,
  });

  const [paymentIntentQueryEnabled, setPaymentIntentQueryEnabled] =
    useState(false);

  useEffect(() => {
    if (router.isReady) {
      const { property, arrival, departure } = getUrlParams(router.asPath);

      if (!property) {
        void router.push("/our-villas");
      } else if (!arrival || !departure) {
        void router.push(`/property/${property}`);
      }

      setSlug(property);
      setDates({
        startDate: arrival,
        endDate: departure,
      });
      setInitialDates({
        startDate: arrival,
        endDate: departure,
      });

      setPaymentIntentQueryEnabled(true);
    }
  }, [router.isReady, router.asPath]);

  const { data: clientSecret } = api.properties.getClientSecret.useQuery(
    {
      slug: slug as string,
      startDate: dates.startDate ?? "",
      endDate: dates.endDate ?? "",
    },
    {
      enabled: !!slug && paymentIntentQueryEnabled,
    }
  );

  useEffect(() => {
    if (clientSecret) {
      setPaymentIntentQueryEnabled(false);
    }
  }, [clientSecret]);

  useEffect(() => {
    if (
      initialDates.startDate !== dates.startDate ||
      initialDates.endDate !== dates.endDate
    ) {
      setPaymentIntentQueryEnabled(true);
      void router.push(
        `/checkout?property=${slug as string}&arrival=${
          dates.startDate as string
        }&departure=${dates.endDate as string}`
      );
    }
  }, [dates]);

  return (
    <div className="mx-auto h-full max-w-7xl">
      <main className="lg:flex lg:min-h-full lg:flex-row-reverse lg:overflow-hidden">
        <h1 className="sr-only">Checkout</h1>

        <OrderSummary
          property={slug as string}
          dates={dates}
          setDates={setDates}
        />

        {/* Checkout form */}
        <section
          aria-labelledby="payment-heading"
          className="flex-auto overflow-y-auto px-4 pb-16 pt-7 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-lg">
            <div className="flex gap-4">
              <p className="pb-6 text-2xl">Checkout</p>
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
                key={`checkout-subitem-${price.description}`}
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

function OrderSummary({ property, dates, setDates }: CalendarComponent) {
  const [calendarShowing, setCalendarShowing] = useState(false);
  const {
    data: pricingInfo,
    isError,
    error,
    isSuccess,
  } = api.properties.getQuote.useQuery(
    {
      slug: property as string,
      startDate: dates?.startDate as string,
      endDate: dates?.endDate as string,
    },
    {
      retry: 0,
      enabled: !!property && !!dates?.startDate && !!dates.endDate,
    }
  );

  //TODO: Static props
  const { data: mainImage } = api.properties.getMainImage.useQuery(
    {
      slug: property ?? "",
    },
    {
      enabled: !!property,
    }
  );

  const mainImageSrc = mainImage ? urlFor(mainImage).url() : "";
  const mainImageBlurSrc = mainImage
    ? urlFor(mainImage).height(32).blur(50).url()
    : "";

  const [errorMsg, setErrorMsg] = useState("");

  if (isError && errorMsg !== error.message) {
    setErrorMsg(error.message);
  } else if (isSuccess && errorMsg.length) {
    setErrorMsg("");
  }

  let propertyName = "";
  let totalPrice = 0;
  let pricePerNight = "";
  let invoiceItems: InvoiceItem[] = [];

  if (isSuccess && pricingInfo !== null) {
    ({ propertyName, totalPrice, pricePerNight, invoiceItems } =
      pricingInfo as BookingQuoteInfo & { pricePerNight: string });
  }

  const [open, setOpen] = useState(false);

  const dateString = `${dateToStringNumerical(
    dates?.startDate
  )} - ${dateToStringNumerical(dates?.endDate)}`;


  return (
    <>
      {/* Mobile order summary */}
      <section
        aria-labelledby="order-heading"
        className="relative bg-gray-50 px-4 py-6 sm:px-6 lg:hidden"
      >
        <div className="h-full">
          <SlideOver title="Choose Dates" open={open} setOpen={setOpen}>
            <CalendarPopUp
              dates={dates}
              setDates={setDates}
              property={property}
              calendarShowing={open}
              setCalendarShowing={setOpen}
            />
          </SlideOver>
        </div>

        <Disclosure as="div" className="mx-auto max-w-lg">
          {({ open }) => (
            <>
              <div className="flex items-center justify-between pb-4">
                <h2
                  id="order-heading"
                  className="text-lg font-medium text-gray-900"
                >
                  Your Booking
                </h2>
                <Disclosure.Button className="font-medium text-sky-600 hover:text-sky-500">
                  {open ? (
                    <span>Hide full summary</span>
                  ) : (
                    <span>Show full summary</span>
                  )}
                </Disclosure.Button>
              </div>

              <Disclosure.Panel>
                <div className="divide-y divide-gray-200 border-b border-gray-200">
                  <div className="flex space-x-6 py-6">
                    <div className="relative h-40 w-40 flex-none rounded-md">
                      <Image
                        priority
                        className="rounded-md"
                        fill
                        style={{ objectFit: "cover" }}
                        src={mainImageSrc}
                        sizes="384px" // inputs w=640 in sanity url
                        blurDataURL={mainImageBlurSrc}
                        alt="Luxury Villa Vacation Rental in Cape Coral"
                      />
                    </div>
                    <div className="relative flex flex-col justify-between space-y-4">
                      <div className="space-y-1 text-sm font-medium">
                        <h3 className="text-gray-900">{propertyName}</h3>
                        {pricePerNight && (
                          <p className="text-gray-900">
                            {pricePerNight} per night
                          </p>
                        )}
                        <br />
                        <div
                          onClick={() => {
                            setOpen(true);
                          }}
                        >
                          <p className="text-gray-500">{dateString}</p>
                          <div
                            className={classNames(
                              "cursor-pointer text-sm font-medium text-sky-600 hover:text-sky-500"
                            )}
                          >
                            Edit Dates
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

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
                <div className="mt-10 flex flex-col space-y-6 text-sm font-medium text-gray-500">
                  {invoiceItems.map((invoiceItem: InvoiceItem, index) => {
                    return (
                      <CheckoutInvoiceItemDisplay
                        key={`${invoiceItem.description}-invoice-item`}
                        invoiceItem={invoiceItem}
                      />
                    );
                  })}
                </div>
                {/* <div className="mt-10 space-y-6 text-sm font-medium text-gray-500">
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
                </div> */}
              </Disclosure.Panel>

              {!isError && (
                <div className="flex items-center justify-between border-t border-gray-200 pt-6 font-semibold text-gray-900">
                  <div className="text-base">Total</div>
                  <div className="text-base">
                    {formatCurrencyExact(totalPrice)}
                  </div>
                </div>
              )}
              {isError ? (
                <div onClick={() => setOpen(true)}>
                  <p className="mt-6 text-center w-full animate-pulse px-8 text-rose-600">
                    {errorMsg}
                  </p>

                  <div className="flex flex-col items-center">
                    <p className="mb-1 mt-3 text-gray-500">{dateString}</p>
                    <button
                      type="button"
                      className="text-sm font-medium text-sky-600 hover:text-sky-500"
                    >
                      {calendarShowing ? "Cancel" : "Edit Dates"}
                    </button>
                  </div>
                </div>
              ) : null}
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
          <div className="flex space-x-6 py-6">
            <div className="relative h-40 w-40 flex-none rounded-md bg-gray-200 object-cover object-center">
              <Image
                priority
                className="rounded-md"
                fill
                style={{ objectFit: "cover" }}
                src={mainImageSrc}
                sizes="384px" // inputs w=640 in sanity url
                blurDataURL={mainImageBlurSrc}
                alt="Luxury Villa Vacation Rental in Cape Coral"
              />
            </div>
            <div className="flex flex-col justify-between space-y-4">
              <div className="space-y-1 text-sm font-medium">
                <h3 className="text-gray-900">{propertyName}</h3>
                {pricePerNight && (
                  <p className="text-gray-900">{pricePerNight} per night</p>
                )}
                <br />
                <p className="text-gray-500">{dateString}</p>
                <button
                  type="button"
                  className="text-sm font-medium text-sky-600 hover:text-sky-500"
                  onClick={() =>
                    setCalendarShowing && setCalendarShowing(!calendarShowing)
                  }
                >
                  {calendarShowing ? "Cancel" : "Edit Dates"}
                </button>
                <div className="absolute left-1/2 top-36 z-10 w-11/12 -translate-x-1/2">
                  {/* TODO: Add OutsideClickHandler https://github.com/airbnb/react-outside-click-handler */}
                  <CalendarPopUp
                    dates={dates}
                    setDates={setDates}
                    property={property}
                    calendarShowing={calendarShowing}
                    setCalendarShowing={setCalendarShowing}
                  />
                </div>
              </div>
            </div>
          </div>

          <p className="mt-6 w-full animate-pulse px-8 text-rose-600">
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
              return (
                <CheckoutInvoiceItemDisplay
                  key={`${invoiceItem.description}-invoice-item`}
                  invoiceItem={invoiceItem}
                />
              );
            })}
            <div className="flex items-center justify-between border-t border-gray-200 pt-6 font-semibold text-gray-900">
              <div className="text-base">Total</div>
              <div className="text-base">{formatCurrencyExact(totalPrice)}</div>
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

  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url: `${getBaseUrl()}/confirmation`,
          receipt_email: email,
          shipping: {
            name: name,
            address: {
              line1: "",
            },
            phone: phone,
          },
        },
      })
      .then(({ error }) => {
        if (error) {
          setErrorMessage(error.message as string);
        }
      })
      .catch((error) => {
        console.error(error);
      });
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
      {Array.from(Array(3)).map((_, index) => {
        return (
          <div
            className="flex flex-col gap-1"
            key={`skeleton-checkout-field-${index}`}
          >
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
  property,
  calendarShowing,
  setCalendarShowing,
}: CalendarComponent) {
  return (
    <div className="">
      <div className={classNames(!calendarShowing ? "hidden" : "")}>
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

export const getBaseUrl = () => {
  if (env.NEXT_PUBLIC_VERCEL_URL)
    return `https://${env.NEXT_PUBLIC_VERCEL_URL ?? ""}`; // If specified in deployment, use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev uses localhost
};
