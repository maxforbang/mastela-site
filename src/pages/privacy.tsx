import Layout from "~/components/Layout";
import type { NextPageWithLayout } from "./_app";
import type { ReactElement } from "react";
import Link from "next/link";

const PrivacyPage: NextPageWithLayout = () => {
  return (
    <div className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4">
        At our vacation rental company, we are committed to protecting your privacy and ensuring the security of your personal information.
        This privacy policy outlines how we collect, use, and safeguard your data when you use our website or make a reservation.
        By accessing our website and providing your information, you consent to the practices described in this policy.
      </p>
      <h2 className="text-xl font-bold mb-2">Information We Collect</h2>
      <p className="mb-4">
        When you use our website, we may collect personal information such as your name, email address, phone number, and billing details.
        We also gather non-personal information, including your IP address, browser type, and device information, to enhance your browsing experience.
        We utilize cookies and similar technologies to personalize content and ads, analyze site traffic, and improve functionality.
      </p>
      <h2 className="text-xl font-bold mb-2">How We Use Your Information</h2>
      <p className="mb-4">
        We use your personal information to process your reservations, communicate with you regarding your bookings, and provide customer support.
        Your data may also be used to improve our services, customize your experience, and send you promotional offers or newsletters if you opt-in.
        We do not sell or share your personal information with third parties for their marketing purposes without your explicit consent.
      </p>
      <h2 className="text-xl font-bold mb-2">Data Security and Retention</h2>
      <p className="mb-4">
        We employ industry-standard security measures to protect your information from unauthorized access, disclosure, alteration, or destruction.
        However, please be aware that no method of transmission over the internet or electronic storage is 100% secure.
        We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy or as required by law.
      </p>
      <h2 className="text-xl font-bold mb-2">Your Choices and Rights</h2>
      <p className="mb-4">
        You have the right to access, update, and correct your personal information. You can manage your preferences regarding promotional communications by contacting us.
        You may also request the deletion of your data, subject to any legal obligations we may have. Please note that certain information may be retained for legitimate business purposes or as required by law.
      </p>
      <h2 className="text-xl font-bold mb-2">Third-Party Links and Services</h2>
      <p className="mb-4">
        Our website may contain links to third-party websites or services. We are not responsible for their privacy practices and encourage you to review their own privacy policies.
        Additionally, we may use third-party service providers to facilitate our operations and services, who may have access to your information solely for those purposes.
      </p>
      <p className="mb-4">
        For more detailed information about our privacy practices, including how to contact us with any questions or concerns, please review our full privacy policy.
      </p>
      <p>
        Thank you for trusting us with your personal information. We are dedicated to safeguarding your privacy and providing you with an exceptional experience.
      </p>
      <div className="mt-12">
        <Link href="/" className="text-l font-semibold leading-7 ">
          <span aria-hidden="true">&larr;</span> Back to home
        </Link>
      </div>
    </div>
  );
};

export default PrivacyPage;

PrivacyPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
