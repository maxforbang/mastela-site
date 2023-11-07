import * as React from "react";

interface EmailTemplateProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  reason: string;
}

export const ContactFormEmailTemplate: React.FC<
  Readonly<EmailTemplateProps>
> = ({ firstName, lastName, email, phone, message, reason }) => (
  <div>
    <h2>Website Inquiry - {reason}</h2>
    <p>{message}</p>
    <br/>
    <h3>Contact Information</h3>
    <p>{`${firstName} ${lastName}`}</p>
    <p>{email}</p>
    <p>{phone}</p>
  </div>
);
