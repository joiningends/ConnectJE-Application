import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="bg-[#B197FC] py-6 px-6 sm:px-10">
          <h1 className="text-3xl font-bold text-white text-center">
            CONNECTJE PRIVACY POLICY
          </h1>
          <p className="text-white text-center mt-2">
            Last Updated: 29-10-2024
          </p>
        </div>
        <div className="px-6 py-8 sm:px-10">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[#B197FC]">
              Introduction
            </h2>
            <p className="text-gray-700">
              ConnectJe ("We", "Us", or "Our") is committed to protecting your
              privacy. This Privacy Policy explains how we collect, use,
              disclose, and protect your personal information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[#B197FC]">
              Information We Collect
            </h2>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>
                WhatsApp messaging data (sender, recipient, message content)
              </li>
              <li>File uploading data (file type, size, content)</li>
              <li>
                GST verification and E-Invoice creation data (business
                information, tax IDs)
              </li>
              <li>
                Event management data (event details, attendee information)
              </li>
              <li>
                Payment information (transaction history, payment methods)
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[#B197FC]">
              How We Use Your Information
            </h2>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>Provide and improve our services</li>
              <li>Communicate with you</li>
              <li>Process payments</li>
              <li>Verify your identity</li>
              <li>Comply with laws and regulations</li>
              <li>Analyze usage patterns</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[#B197FC]">
              Information Sharing
            </h2>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>
                Third-party service providers (payment gateways, messaging
                services)
              </li>
              <li>Affiliates and subsidiaries</li>
              <li>Law enforcement agencies (upon request)</li>
              <li>
                Business partners (for event management and GST verification)
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[#B197FC]">
              Data Security
            </h2>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>
                We implement strict security measures to protect your data
              </li>
              <li>
                Data is stored securely on our servers using encryption both in
                transit and in motion
              </li>
              <li>Access to data is restricted to authorized personnel only</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[#B197FC]">
              User Rights
            </h2>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>Access to and correct your personal information</li>
              <li>Request deletion of your personal information</li>
              <li>Opt-out of promotional communications</li>
              <li>File a complaint with relevant authorities</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[#B197FC]">
              Cookies and Tracking
            </h2>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>
                We use cookies to track usage patterns and improve our services
              </li>
              <li>
                You can disable cookies in your browser settings on request
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[#B197FC]">
              Changes to This Policy
            </h2>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>We reserve the right to update this policy at any time</li>
              <li>Changes will be effective immediately upon posting</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[#B197FC]">
              Contact Us
            </h2>
            <p className="text-gray-700">
              For questions or concerns, email us at:{" "}
              <a
                href="mailto:support@joiningends.in"
                className="text-[#B197FC] hover:underline"
              >
                support@joiningends.in
              </a>
            </p>
          </section>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-gray-700 text-center">
              By using ConnectJe, you acknowledge that you have read,
              understood, and agree to this Privacy Policy.
            </p>
          </div>

        
        </div>
      </div>
    </div>
  );
}
