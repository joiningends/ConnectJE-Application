import React from "react";

const Card = ({ children }) => (
  <div className="bg-white shadow-lg rounded-lg overflow-hidden">
    {children}
  </div>
);

const CardContent = ({ children }) => <div className="p-6">{children}</div>;

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      <header className="bg-[#B197FC] text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold">JOININGENDS TECHNOLOGIES PRIVATE LIMITED</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-12">
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-[#B197FC]">About Us</h2>
          <p className="text-lg mb-4">
            JoiningEnds is an innovative & forward-thinking software consulting
            company that helps clients across the world simplify their business
            workflow & make it more PROFITABLE and EFFICIENT by reducing human
            dependency.
          </p>
          <p className="text-lg mb-4">
            We develop customized web portals, mobile applications (Android &
            iOS), and desktop applications to help our clients automate business
            workflows and gain a holistic view of their overall business using
            reports and analytics.
          </p>
        </section>
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-[#B197FC]">
            Our Approach
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent>
                <h3 className="text-xl font-semibold mb-4">
                  Understanding SMEs and MSMEs
                </h3>
                <p>
                  We understand the problems faced by SMEs and MSMEs and aim at
                  providing effective solutions. Our team steps into the shoes
                  of business owners, learning about their industry and
                  day-to-day operations to build efficient systems.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <h3 className="text-xl font-semibold mb-4">
                  Cross-Industry Expertise
                </h3>
                <p>
                  We have designed and developed portals across various industry
                  verticals, including healthcare, education, manufacturing,
                  textile, and more. Our solutions are tailored to meet the
                  unique needs of each sector.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-[#B197FC]">
            Our Services
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent>
                <div className="flex flex-col items-center text-center">
                  <span className="text-5xl text-[#B197FC] mb-4">
                    &#128187;
                  </span>
                  <h3 className="text-xl font-semibold mb-2">
                    Custom Web Portals
                  </h3>
                  <p>
                    End-to-end customized solutions for businesses of all sizes
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className="flex flex-col items-center text-center">
                  <span className="text-5xl text-[#B197FC] mb-4">
                    &#128241;
                  </span>
                  <h3 className="text-xl font-semibold mb-2">
                    Mobile Applications
                  </h3>
                  <p>Native and hybrid apps for Android and iOS platforms</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className="flex flex-col items-center text-center">
                  <span className="text-5xl text-[#B197FC] mb-4">
                    &#128295;
                  </span>
                  <h3 className="text-xl font-semibold mb-2">
                    Outsourced Development
                  </h3>
                  <p>Specialized module development for large MNCs</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-[#B197FC]">
            Our Technology Stack
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="text-2xl text-[#B197FC] mr-2">
                    &#128279;
                  </span>
                  Back-end
                </h3>
                <ul className="list-disc list-inside">
                  <li>Python</li>
                  <li>PHP</li>
                  <li>.NET</li>
                  <li>Node.js</li>
                  <li>MySQL database</li>
                  <li>MongoDB</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="text-2xl text-[#B197FC] mr-2">
                    &#128187;
                  </span>
                  Front-end
                </h3>
                <ul className="list-disc list-inside">
                  <li>Angular</li>
                  <li>React JS</li>
                  <li>HTML</li>
                  <li>JavaScript</li>
                  <li>CSS</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="text-2xl text-[#B197FC] mr-2">
                    &#128241;
                  </span>
                  Mobile
                </h3>
                <ul className="list-disc list-inside">
                  <li>Android</li>
                  <li>iOS (Native & Hybrid)</li>
                  <li>Laravel</li>
                  <li>Flutter</li>
                  <li>React Native</li>
                </ul>
              </CardContent>
            </Card>
          </div>
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
