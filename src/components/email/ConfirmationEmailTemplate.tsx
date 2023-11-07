import * as React from "react";

interface EmailTemplateProps {
  name: string;
  propertyName: string;
}

export const ConfirmationEmailTemplate: React.FC<
  Readonly<EmailTemplateProps>
> = ({ name, propertyName }) => (
  <div>
    <h1>Welcome, {name}!</h1>
    <p>
      {`We've received your payment and are so excited to have you in ${propertyName}. We'll send in check-in instructions and your digital keypad code to access the property before your arrival.`}
    </p>
  </div>
);
