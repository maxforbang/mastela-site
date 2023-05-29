import Layout from "~/components/Layout";
import type { NextPageWithLayout } from "./_app";
import type { ReactElement } from "react";
import Link from "next/link";

const RefundPolicyPage: NextPageWithLayout = () => {
  return (
    <div className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
<h1 className="text-3xl font-bold mb-4">Refund Policy</h1>
      <p className="mb-4">
        At our vacation rental company, we strive to provide the best possible experience for our guests.
        We understand that circumstances may arise that require the cancellation or modification of a reservation.
        This refund policy outlines our guidelines for cancellations, refunds, and any applicable fees or penalties.
        By making a reservation with us, you agree to comply with the terms stated below.
      </p>
      <h2 className="text-xl font-bold mb-2">Cancellations and Refunds</h2>
      <p className="mb-4">
        Cancellation requests must be submitted in writing or through our designated cancellation process.
        The refund amount and applicable fees depend on the timing of the cancellation and the specific property booked.
        Please refer to the booking confirmation or contact our customer support for detailed information regarding your reservation.
      </p>
      <h2 className="text-xl font-bold mb-2">Refund Processing</h2>
      <p className="mb-4">
        Refunds, if applicable, will be processed using the original payment method within a reasonable timeframe.
        Please note that the processing time may vary depending on the payment provider and your financial institution.
        Any third-party fees, such as transaction fees or currency conversion fees, are non-refundable.
      </p>
      <h2 className="text-xl font-bold mb-2">Force Majeure and Unforeseen Circumstances</h2>
      <p className="mb-4">
        In the event of force majeure or unforeseen circumstances beyond our control, such as natural disasters, government actions, or travel restrictions,
        we will work with affected guests to find suitable solutions, which may include rescheduling the reservation or providing a credit for future use.
        In such cases, refunds may be subject to deductions for any costs incurred by our company.
      </p>
      <h2 className="text-xl font-bold mb-2">Travel Insurance</h2>
      <p className="mb-4">
        We strongly recommend that guests obtain travel insurance to protect against unexpected events, including trip cancellations, medical emergencies, or travel disruptions.
        It is the responsibility of the guest to secure appropriate insurance coverage.
      </p>
      <p className="mb-4">
        For more detailed information about our refund policy, please review our full terms and conditions. If you have any questions or need further assistance, please contact our customer support team.
      </p>
      <div className="mt-12">
        <Link href="/" className="text-l font-semibold leading-7 ">
          <span aria-hidden="true">&larr;</span> Back to home
        </Link>
      </div>
    </div>
  );
};

export default RefundPolicyPage;

RefundPolicyPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
