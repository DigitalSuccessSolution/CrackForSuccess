import React from "react";
import PolicyLayout from "../components/Layout/PolicyLayout";
import { Shield } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <PolicyLayout
      title="Privacy Policy"
      icon={Shield}
      lastUpdated={new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
    >
      <div className="space-y-8">
        <section>
          <p className="lead text-lg text-gray-600 mb-6">
            At Crack4Success, we value your trust and are committed to
            protecting your personal information. This Privacy Policy explains
            how we collect, use, and safeguard your data when you visit or use
            our website. By accessing or using Crack4Success, you agree to the
            practices described in this policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
              1
            </span>
            Information We Collect
          </h2>
          <div className="pl-4 md:pl-10 space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">
                Personal Information
              </h3>
              <p className="text-sm">
                When you voluntarily provide it, such as Name, Email address,
                Contact details, and any information you submit through forms,
                comments, or inquiries.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">
                Non-Personal Information
              </h3>
              <p className="text-sm">
                Automatically collected information, including: Browser type,
                Device information, IP address, Pages visited and time spent on
                the site.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
              2
            </span>
            How We Use Your Information
          </h2>
          <div className="pl-4 md:pl-10">
            <p className="mb-4">We use the collected information to:</p>
            <ul className="grid sm:grid-cols-2 gap-3">
              {[
                "Provide and improve our educational content",
                "Respond to user queries and support requests",
                "Send updates, announcements, or important notifications",
                "Improve website performance and user experience",
                "Prevent misuse, fraud, or unauthorized access",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm font-medium text-gray-500 italic">
              We do not sell or rent your personal data to third parties.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
              3
            </span>
            Cookies and Tracking Technologies
          </h2>
          <div className="pl-4 md:pl-10">
            <p className="mb-4">
              Crack4Success may use cookies or similar technologies to remember
              user preferences, analyze website traffic, and improve site
              functionality.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <p className="text-sm text-blue-900">
                You can disable cookies through your browser settings, though
                some features may not work properly.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
              4
            </span>
            Data Security
          </h2>
          <div className="pl-4 md:pl-10">
            <p>
              We take reasonable technical and organizational measures to
              protect your information from unauthorized access, loss, or
              misuse. However, no method of data transmission over the internet
              is completely secure.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
              5
            </span>
            Third-Party Services
          </h2>
          <div className="pl-4 md:pl-10">
            <p>
              We may use third-party tools (such as analytics or hosting
              services) that collect information in accordance with their own
              privacy policies. We are not responsible for the privacy practices
              of external websites linked from our platform.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
              6
            </span>
            Children’s Privacy
          </h2>
          <div className="pl-4 md:pl-10">
            <p>
              Crack4Success does not knowingly collect personal information from
              children under the age of 13. If you believe such data has been
              provided to us, please contact us so we can remove it promptly.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
              7
            </span>
            Changes to This Policy
          </h2>
          <div className="pl-4 md:pl-10">
            <p>
              We may update this Privacy Policy from time to time. Any changes
              will be posted on this page with an updated effective date.
            </p>
          </div>
        </section>
      </div>
    </PolicyLayout>
  );
};

export default PrivacyPolicy;
