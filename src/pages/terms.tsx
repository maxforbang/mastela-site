import Layout from "~/components/Layout";
import type { NextPageWithLayout } from "./_app";
import type { ReactElement } from "react";
import Link from "next/link";

const TermsPage: NextPageWithLayout = () => {
  return (
    <div className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
      <h1 className="mb-4 text-3xl font-bold">Terms and Conditions</h1>
      <p className="mb-4">
        Welcome to Mastela Vacations! Please read these terms and conditions
        carefully before making a reservation. By using our website and booking
        a rental property, you agree to comply with and be bound by the
        following terms and conditions.
      </p>
      <h2 className="mb-2 text-xl font-bold">Booking and Reservation</h2>
      <p className="mb-4">
        To make a reservation, you must be at least 18 years old and provide
        accurate, complete, and up-to-date information. By confirming a booking,
        you agree to pay the total rental fee, including any applicable taxes
        and fees, as stated during the booking process. Changes or cancellations
        to bookings may be subject to additional charges or penalties, as
        outlined in our cancellation policy.
      </p>
      <h2 className="mb-2 text-xl font-bold">
        Rental Rules and Responsibilities
      </h2>
      <p className="mb-4">
        Guests are expected to treat the rental property with care and respect,
        adhering to the provided guidelines and any specific house rules. Any
        damage caused by the guest during their stay may result in additional
        charges. Guests are responsible for their own safety and the safety of
        others, and should follow any provided safety instructions or warnings.
      </p>
      <h2 className="mb-2 text-xl font-bold">Liability and Disclaimers</h2>
      <p className="mb-4">
        Our company and its affiliates shall not be liable for any loss, damage,
        injury, or inconvenience caused by factors beyond our control, including
        but not limited to natural disasters, accidents, or disruptions to
        public utilities or services. Guests are encouraged to obtain travel
        insurance to protect against unforeseen events.
      </p>
      <h2 className="mb-2 text-xl font-bold">Privacy Policy</h2>
      <p className="mb-4">
        Our privacy policy outlines how we collect, use, and protect your
        personal information. By using our website and making a reservation, you
        consent to the collection and use of your personal information as
        described in our privacy policy.
      </p>
      <p className="mb-4">
        For more detailed information, please review our full terms and
        conditions. If you have any questions or concerns, feel free to contact
        our customer support team.
      </p>
      <p>
        Thank you for choosing our vacation rental company. We hope you have an
        amazing stay!
      </p>
      <div className="mt-12">
        <Link href="/" className="text-l font-semibold leading-7 ">
          <span aria-hidden="true">&larr;</span> Back to home
        </Link>
      </div>
    </div>
  );
};

export default TermsPage;

TermsPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
