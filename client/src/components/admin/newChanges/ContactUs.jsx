import React from "react";
import { Mail, Phone } from "lucide-react";

const Card = ({ children }) => (
  <div className="bg-white shadow-lg rounded-lg overflow-hidden">
    {children}
  </div>
);

const CardContent = ({ children }) => <div className="p-6">{children}</div>;

const ContactInfo = ({ title, content, icon: Icon }) => (
  <div className="mb-4 flex items-start">
    {Icon && <Icon className="w-5 h-5 mr-2 text-[#B197FC]" />}
    <div>
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <p className="text-gray-600">{content}</p>
    </div>
  </div>
);

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      <header className="bg-[#B197FC] text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold">JOININGENDS TECHNOLOGIES PRIVATE LIMITED</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <Card>
          <CardContent>
            <ContactInfo
              title="Registered office:"
              content="No.956, Jessore Road, GokulDham, Block - A, Kolkata – 700 055"
            />
            <ContactInfo
              title="Corp Office:"
              content="4TH Floor, Room No. 404, No. 41, NetajiSubhas Road, Kolkata – 700 001"
            />
            {/* <ContactInfo title="Tel:" content="033-2237 5400" icon={Phone} /> */}
            <ContactInfo
              title="Phone:"
              content="+91 98303 00630"
              icon={Phone}
            />
            <ContactInfo
              title="Email:"
              content="info@joiningends.in"
              icon={Mail}
            />
            <ContactInfo title="Fax No." content="033- 2225 0992" />
            <ContactInfo title="CIN:" content="U72900WB2021PTC244767" />
            <ContactInfo title="GSTIN:" content="19AAGCI1230D1Z1" />
          </CardContent>
        </Card>
      </main>

      <footer className="bg-[#B197FC] text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 JoiningEnds PVT LTD. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
