import * as React from "react";

interface EmailTemplateProps {
  name: string;
  email: string;
  phone: string;
  arrival: string;
  departure: string;
  errorMsg: string;
}

export const UnblockedDatesTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  name,
  email,
  phone,
  arrival,
  departure,
  errorMsg
}) => (
  <div>
    <h2>
      There was a booking on the website in which a customer successfully paid but Lodgify
      was unable to block the dates. Block them out manually before a potential double booking.
    </h2>
    <h3>Reservation Details</h3>
    <p>{`Guest name: ${name}`}</p>
    <p>{`Dates booked: ${arrival} to ${departure}`}</p>
    <p>{`Email: ${email}`}</p>
    <p>{`Phone #: ${phone}`}</p>

    <h3>Details</h3>
    <p>{`Lodgify Error Message: ${errorMsg}`}</p>
    <p>{`See the Stripe's Payment > Webhook Response for more information.`}</p>
  </div>
);
