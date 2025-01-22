import React from "react";

const Card = ({ children }) => (
  <div className="bg-white shadow-lg rounded-lg overflow-hidden">
    {children}
  </div>
);

const CardContent = ({ children }) => <div className="p-6">{children}</div>;

export default function CancellationAndRefundPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      <header className="bg-[#B197FC] text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold">
            JOININGENDS TECHNOLOGIES PRIVATE LIMITED
          </h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6 text-[#B197FC]">
          ConnectJe Cancellation and Refund Policy
        </h2>

        <section className="mb-8">
          <Card>
            <CardContent>
              <h3 className="text-xl font-semibold mb-4">Introduction</h3>
              <p>
                ConnectJe ("We", "Us", or "Our") is committed to providing
                excellent services. This Cancellation and Refund Policy outlines
                the terms and conditions for canceling and refunding our
                services.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="mb-8">
          <Card>
            <CardContent>
              <h3 className="text-xl font-semibold mb-4">Scope</h3>
              <p className="mb-2">
                This policy applies to all services offered by ConnectJe,
                including:
              </p>
              <ul className="list-disc list-inside">
                <li>WhatsApp messaging (Single and Bulk)</li>
                <li>File uploading</li>
                <li>GST verification</li>
                <li>E-Invoice creation</li>
                <li>Event management</li>
                <li>Payment integration</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="mb-8">
          <Card>
            <CardContent>
              <h3 className="text-xl font-semibold mb-4">
                Cancellation Policy
              </h3>
              <ol className="list-decimal list-inside">
                <li>
                  User-initiated cancellation: You can cancel your subscription
                  or service at any time.
                </li>
                <li>
                  ConnectJe-initiated cancellation: We reserve the right to
                  cancel or terminate services due to non-compliance with our
                  Terms and Conditions or applicable laws.
                </li>
              </ol>
            </CardContent>
          </Card>
        </section>

        <section className="mb-8">
          <Card>
            <CardContent>
              <h3 className="text-xl font-semibold mb-4">Refund Policy</h3>
              <ol className="list-decimal list-inside">
                <li>Refunds will be processed within 7-10 business days.</li>
                <li>
                  Refunds will be issued through the original payment method.
                </li>
                <li>
                  Refund amounts will be calculated based on the remaining
                  unused period of the service.
                </li>
              </ol>
            </CardContent>
          </Card>
        </section>

        <section className="mb-8">
          <Card>
            <CardContent>
              <h3 className="text-xl font-semibold mb-4">Refund Scenarios</h3>
              <ol className="list-decimal list-inside">
                <li>Unused services: 100% refund of unused services.</li>
                <li>
                  Partially used services: Pro-rata refund based on unused
                  services.
                </li>
                <li>
                  Subscription cancellation: Refund of remaining subscription
                  period.
                </li>
              </ol>
            </CardContent>
          </Card>
        </section>

        <section className="mb-8">
          <Card>
            <CardContent>
              <h3 className="text-xl font-semibold mb-4">Exceptions</h3>
              <ol className="list-decimal list-inside">
                <li>Customized services or products.</li>
                <li>Services already delivered or completed.</li>
                <li>
                  Refunds for GST verification and E-Invoice creation services
                  will be processed as per applicable tax regulations.
                </li>
              </ol>
            </CardContent>
          </Card>
        </section>

        <section className="mb-8">
          <Card>
            <CardContent>
              <h3 className="text-xl font-semibold mb-4">
                Payment Gateway Charges
              </h3>
              <ol className="list-decimal list-inside">
                <li>Payment gateway charges will be deducted from refunds.</li>
                <li>These charges are non-refundable.</li>
              </ol>
            </CardContent>
          </Card>
        </section>

        <section className="mb-8">
          <Card>
            <CardContent>
              <h3 className="text-xl font-semibold mb-4">Disputes</h3>
              <ol className="list-decimal list-inside">
                <li>
                  Any disputes regarding refunds will be resolved through
                  negotiation.
                </li>
                <li>Disputes will be governed by Kolkata, India laws.</li>
              </ol>
            </CardContent>
          </Card>
        </section>

        <section className="mb-8">
          <Card>
            <CardContent>
              <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
              <p>
                For questions or concerns, email us at: support@joiningends.in.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="mb-8">
          <Card>
            <CardContent>
              <h3 className="text-xl font-semibold mb-4">
                Changes to This Policy
              </h3>
              <p>
                We reserve the right to modify this policy at any time. Changes
                will be effective immediately upon posting.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="mb-8">
          <Card>
            <CardContent>
              <p className="mb-4">
                By using ConnectJe, you acknowledge that you have read,
                understood, and agree to this Cancellation and Refund Policy.
              </p>
              <h3 className="text-xl font-semibold mb-4">Acknowledgment</h3>
              <p>
                I, [User Name], hereby acknowledge that I have read, understood,
                and agree to the ConnectJe Cancellation and Refund Policy.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
      <footer className="bg-[#B197FC] text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 JoiningEnds. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
