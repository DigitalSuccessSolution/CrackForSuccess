import React from "react";
import PolicyLayout from "../components/Layout/PolicyLayout";
import { FileText } from "lucide-react";

const TermsOfService = () => {
  return (
    <PolicyLayout
      title="Terms of Service"
      icon={FileText}
      lastUpdated={new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
    >
      <div className="space-y-8">
        <section>
          <p className="lead text-lg text-gray-600 mb-6">
            Please read these Terms of Service ("Terms", "Terms of Service")
            carefully before using the Crack4Success website operated by us.
            Your access to and use of the Service is conditioned on your
            acceptance of and compliance with these Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
              1
            </span>
            Acceptance of Terms
          </h2>
          <div className="pl-4 md:pl-10">
            <p>
              By accessing and using Crack4Success, you accept and agree to be
              bound by the terms and provision of this agreement. In addition,
              when using these particular services, you shall be subject to any
              posted guidelines or rules applicable to such services. Any
              participation in this service will constitute acceptance of this
              agreement. If you do not agree to abide by the above, please do
              not use this service.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
              2
            </span>
            Intellectual Property
          </h2>
          <div className="pl-4 md:pl-10">
            <p>
              All content provided on this website, including but not limited to
              text, graphics, logos, images, and software, is the property of
              Crack4Success or its content suppliers and is protected by
              international copyright laws. You may not modify, publish,
              transmit, participate in the transfer or sale of, create
              derivative works from, or in any way exploit any of the content,
              in whole or in part or reproduce without express written consent.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
              3
            </span>
            User Accounts
          </h2>
          <div className="pl-4 md:pl-10">
            <p>
              To access certain features of the website, you may be required to
              create an account. You are responsible for maintaining the
              confidentiality of your account and password and for restricting
              access to your computer, and you agree to accept responsibility
              for all activities that occur under your account or password. We
              reserve the right to refuse service, terminate accounts, remove or
              edit content in our sole discretion.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
              4
            </span>
            Educational Content & Disclaimer
          </h2>
          <div className="pl-4 md:pl-10">
            <p>
              The materials on Crack4Success are provided for educational
              purposes only. While we strive to provide accurate and up-to-date
              information, we make no warranties or representations as to the
              accuracy or completeness of the content. We are not responsible
              for any errors or omissions or for the results obtained from the
              use of this information. Your use of this material is at your own
              risk.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
              5
            </span>
            User Conduct
          </h2>
          <div className="pl-4 md:pl-10">
            <p>
              You agree not to use the website for any unlawful purpose or any
              purpose prohibited under this clause. You agree not to use the
              website in any way that could damage the website, the services, or
              the general business of Crack4Success. You further agree not to
              share your account details with others or attempt to collect
              distinct information about other users.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
              6
            </span>
            Payment & Refunds
          </h2>
          <div className="pl-4 md:pl-10">
            <p>
              Services or products available for purchase are subject to our
              specific payment and refund policies. Prices for our products are
              subject to change without notice. We reserve the right at any time
              to modify or discontinue the Service (or any part or content
              thereof) without notice at any time.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
              7
            </span>
            Limitation of Liability
          </h2>
          <div className="pl-4 md:pl-10">
            <p>
              In no event shall Crack4Success, nor its directors, employees,
              partners, agents, suppliers, or affiliates, be liable for any
              indirect, incidental, special, consequential or punitive damages,
              including without limitation, loss of profits, data, use,
              goodwill, or other intangible losses, resulting from your access
              to or use of or inability to access or use the Service.
            </p>
          </div>
        </section>

        <section className="bg-gray-50 rounded-xl p-6 border border-gray-200 mt-8">
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Acknowledgement
          </h2>
          <p className="text-gray-600">
            By using our Service or other services provided by us, you
            acknowledge that you have read these Terms of Service and agree to
            be bound by them.
          </p>
        </section>
      </div>
    </PolicyLayout>
  );
};

export default TermsOfService;
