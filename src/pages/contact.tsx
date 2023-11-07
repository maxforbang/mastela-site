import Layout from "~/components/Layout";
import type { NextPageWithLayout } from "./_app";
import { useRef, type ReactElement, useState } from "react";
import Image from "next/image";
import { api } from "~/utils/api";
import clsx from "clsx";

const ContactPage: NextPageWithLayout = () => {
  const {
    mutate: sendEmail,
    isSuccess,
    isLoading,
    isError,
    error,
  } = api.email.sendContactFormEmail.useMutation();
  const formRef = useRef(null);

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    const form = formRef.current;

    // Create a FormData object from the form element
    const formData = new FormData(form ?? undefined);

    // Extract form values using FormData methods
    const formValues = {
      firstName: formData.get("first-name") as string ?? "",
      lastName: formData.get("last-name") as string ?? "",
      email: formData.get("email") as string ?? "",
      phone: formData.get("phone") as string ?? "",
      message: formData.get("message") as string ?? "",
      reason: formData.get("reason") as string ?? "Other",
    };

    // Call the mutation with the form data
    sendEmail(formValues);
  };

  return (
    <div className="relative bg-white">
      {isSuccess ? (
        <p className="my-24 w-full text-center text-2xl">
          We have received your request and will get back to you as soon as
          possible!
        </p>
      ) : isError ? (
        <p className="my-24 w-full text-center text-2xl text-red-500">
          There was an error submitting your request: {error.message}
        </p>
      ) : (
        <>
          <div className="pb-24 pt-16 sm:pb-32 lg:mx-auto lg:grid lg:max-w-7xl lg:grid-cols-2">
            <div className="hidden lg:absolute lg:inset-0 lg:left-1/2 lg:block">
              <Image
                fill
                className="h-64 w-full bg-gray-50 object-cover sm:h-80 lg:absolute lg:h-full"
                src="https://images.unsplash.com/photo-1542596594-649edbc13630?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80"
                alt="Girl smiling with double peace signs"
              />
            </div>
            <div className="px-6 lg:px-8">
              <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                  Get In Touch With Us
                </h2>
                <p className="mt-2 text-lg leading-8 text-gray-600">
                  Have a question or concern? Feel free to contact us using the
                  form below and we&apos;ll get back to you shortly.
                </p>
                <form ref={formRef} onSubmit={handleSubmit} className="mt-16">
                  <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="first-name"
                        className="block text-sm font-semibold leading-6 text-gray-900"
                      >
                        First name
                      </label>
                      <div className="mt-2.5">
                        <input
                          type="text"
                          name="first-name"
                          id="first-name"
                          autoComplete="given-name"
                          className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="last-name"
                        className="block text-sm font-semibold leading-6 text-gray-900"
                      >
                        Last name
                      </label>
                      <div className="mt-2.5">
                        <input
                          type="text"
                          name="last-name"
                          id="last-name"
                          autoComplete="family-name"
                          className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold leading-6 text-gray-900"
                      >
                        Email
                      </label>
                      <div className="mt-2.5">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <div className="flex justify-between text-sm leading-6">
                        <label
                          htmlFor="phone"
                          className="block font-semibold text-gray-900"
                        >
                          Phone
                        </label>
                        <p id="phone-description" className="text-gray-400">
                          Optional
                        </p>
                      </div>
                      <div className="mt-2.5">
                        <input
                          type="tel"
                          name="phone"
                          id="phone"
                          autoComplete="tel"
                          aria-describedby="phone-description"
                          className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <div className="flex justify-between text-sm leading-6">
                        <label
                          htmlFor="message"
                          className="block text-sm font-semibold leading-6 text-gray-900"
                        >
                          How can we help you?
                        </label>
                        {/* <p id="message-description" className="text-gray-400">
                      Max 500 characters
                    </p> */}
                      </div>
                      <div className="mt-2.5">
                        <textarea
                          id="message"
                          name="message"
                          rows={4}
                          aria-describedby="message-description"
                          className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                          defaultValue={""}
                        />
                      </div>
                    </div>
                    <fieldset className="sm:col-span-2">
                      <legend className="block text-sm font-semibold leading-6 text-gray-900">
                        Reason for Inquiry
                      </legend>
                      <div className="mt-4 space-y-4 text-sm leading-6 text-gray-600">
                        <div className="flex gap-x-2.5">
                          <input
                            id="reason-general-question"
                            name="reason"
                            defaultValue="General Question"
                            type="radio"
                            className="mt-1 h-4 w-4 border-gray-300 text-sky-600 shadow-sm focus:ring-sky-600"
                          />
                          <label htmlFor="reason-general-question">
                            General Question
                          </label>
                        </div>
                        <div className="flex gap-x-2.5">
                          <input
                            id="reason-current-guest"
                            name="reason"
                            defaultValue="Current Guest"
                            type="radio"
                            className="mt-1 h-4 w-4 border-gray-300 text-sky-600 shadow-sm focus:ring-sky-600"
                          />
                          <label htmlFor="reason-current-guest">
                            Current Guest Support
                          </label>
                        </div>
                        <div className="flex gap-x-2.5">
                          <input
                            id="reason-property-management"
                            name="reason"
                            defaultValue="Property Management"
                            type="radio"
                            className="mt-1 h-4 w-4 border-gray-300 text-sky-600 shadow-sm focus:ring-sky-600"
                          />
                          <label htmlFor="reason-property-management">
                            Property Management
                          </label>
                        </div>
                        <div className="flex gap-x-2.5">
                          <input
                            id="reason-other"
                            name="reason"
                            defaultValue="Other"
                            type="radio"
                            className="mt-1 h-4 w-4 border-gray-300 text-sky-600 shadow-sm focus:ring-sky-600"
                          />
                          <label htmlFor="reason-other">Other</label>
                        </div>
                      </div>
                    </fieldset>
                  </div>
                  <div className="mt-10 flex justify-end border-t border-gray-900/10 pt-8">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={clsx(
                        "h-10  w-32 rounded-md text-center text-sm font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600",
                        isLoading
                          ? "bg-gray-300"
                          : "bg-sky-500 hover:bg-sky-300"
                      )}
                    >
                      {isLoading ? "Sending..." : "Send message"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ContactPage;

ContactPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
