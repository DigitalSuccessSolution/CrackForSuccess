import React from "react";
import PolicyLayout from "../components/Layout/PolicyLayout";
import { Cookie } from "lucide-react";

const CookiePolicy = () => {
  return (
    <PolicyLayout
      title="Cookie Policy"
      icon={Cookie}
      lastUpdated={new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
    >
      <div className="space-y-8">
        <section>
          <p className="lead text-lg text-gray-600 mb-6">
            This Cookie Policy explains what cookies are, how we use them, the
            types of cookies we use i.e, the information we collect using
            cookies and how that information is used, and how to control the
            cookie preferences.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
              1
            </span>
            What Are Cookies
          </h2>
          <div className="pl-4 md:pl-10">
            <p>
              Cookies are small text files that are placed on your computer or
              mobile device by websites that you visit. They are widely used in
              order to make websites work, or work more efficiently, as well as
              to provide information to the owners of the site. Crack4Success
              uses cookies to improve your experience and to understand how our
              platform is being used.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
              2
            </span>
            How We Use Cookies
          </h2>
          <div className="pl-4 md:pl-10">
            <p>
              We use cookies for a variety of reasons detailed below.
              Unfortunately, in most cases, there are no industry standard
              options for disabling cookies without completely disabling the
              functionality and features they add to this site. It is
              recommended that you leave on all cookies if you are not sure
              whether you need them or not in case they are used to provide a
              service that you use.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
              3
            </span>
            The Cookies We Set
          </h2>
          <div className="pl-4 md:pl-10 grid gap-4 sm:grid-cols-2">
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                Account Related
              </h3>
              <p className="text-sm text-gray-600">
                If you create an account with us, we will use cookies for the
                management of the signup process and general administration.
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                Login Related
              </h3>
              <p className="text-sm text-gray-600">
                We use cookies when you are logged in so that we can remember
                this fact. This prevents you from having to log in every single
                time you visit a new page.
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 sm:col-span-2">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                Site Preferences Cookies
              </h3>
              <p className="text-sm text-gray-600">
                In order to provide you with a great experience on this site, we
                provide the functionality to set your preferences for how this
                site runs when you use it.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
              4
            </span>
            Third Party Cookies
          </h2>
          <div className="pl-4 md:pl-10">
            <p className="mb-4">
              In some special cases, we also use cookies provided by trusted
              third parties. The following section details which third party
              cookies you might encounter through this site:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                <div className="mt-1 font-bold text-xs bg-gray-200 px-2 py-0.5 rounded text-gray-700">
                  Analytics
                </div>
                <div className="text-sm text-gray-600">
                  This site uses Google Analytics which is one of the most
                  widespread and trusted analytics solutions on the web for
                  helping us to understand how you use the site and ways that we
                  can improve your experience.
                </div>
              </li>
              <li className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                <div className="mt-1 font-bold text-xs bg-gray-200 px-2 py-0.5 rounded text-gray-700">
                  Social
                </div>
                <div className="text-sm text-gray-600">
                  We also use social media buttons and/or plugins on this site
                  that allow you to connect with your social network in various
                  ways.
                </div>
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
              5
            </span>
            Disabling Cookies
          </h2>
          <div className="pl-4 md:pl-10">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
              <p className="text-sm text-yellow-800">
                You can prevent the setting of cookies by adjusting the settings
                on your browser (see your browser Help for how to do this). Be
                aware that disabling cookies will affect the functionality of
                this and many other websites that you visit. Disabling cookies
                will usually result in also disabling certain functionality and
                features of this site. Therefore, it is recommended that you do
                not disable cookies.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 rounded-xl p-6 border border-gray-200 mt-8">
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            More Information
          </h2>
          <p className="text-gray-600 mb-4">
            Hopefully, that has clarified things for you. If there is something
            that you aren't sure whether you need or not, it's usually safer to
            leave cookies enabled in case it does interact with one of the
            features you use on our site.
          </p>
          <p className="text-sm text-gray-500">
            For more details, contact us at{" "}
            <a
              href="mailto:support@crack4success.com"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              support@crack4success.com
            </a>
          </p>
        </section>
      </div>
    </PolicyLayout>
  );
};

export default CookiePolicy;
