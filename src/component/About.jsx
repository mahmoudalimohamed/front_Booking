import React from "react";
import royallineLogo from "../assets/cover.png"; // Import the logo
import { Link } from "react-router-dom";
export default function About() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="bg-white font-mono text-lg font-bold text-[#A62C2C] p-4">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">About Our Company</h1>
          <p className="text-xl max-w-3xl mx-auto">
            We are committed to providing exceptional transportation services
            with comfort, safety, and reliability.
          </p>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="container mx-auto px-4 py-16 font-mono">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-[#A62C2C] mb-4">
              Our Story
            </h2>
            <p className=" mb-4">
              Founded with a vision to revolutionize transportation, our company
              has grown from a small fleet to becoming a leading transportation
              provider in the region.
            </p>
            <p className="">
              Since our establishment, we have been dedicated to enhancing the
              travel experience of our customers through innovative solutions
              and exceptional service quality.
            </p>
          </div>
          <div className="md:w-1/2">
            <div className="  rounded-lg flex items-center justify-center">
              <img
                src={royallineLogo}
                alt="Company history"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="  py-16 font-mono">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#A62C2C]">
              Our Mission & Vision
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold text-[#A62C2C] mb-4">
                Our Mission
              </h3>
              <p className="">
                To provide safe, comfortable, and reliable transportation
                services that exceed customer expectations while maintaining the
                highest standards of professionalism and integrity.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold text-[#A62C2C] mb-4">
                Our Vision
              </h3>
              <p className="">
                To be the leading transportation provider known for excellence,
                innovation, and customer satisfaction, setting new standards in
                the industry.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="container mx-auto px-4 py-16 font-mono">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#A62C2C]">Our Core Values</h2>
          <p className=" mt-4 max-w-3xl mx-auto">
            The principles that guide our operations and relationships with our
            customers, partners, and team members.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Safety First",
              description:
                "We prioritize the safety of our passengers, staff, and everyone on the road in all our operations.",
            },
            {
              title: "Customer Excellence",
              description:
                "We are committed to providing exceptional service and going above and beyond to ensure customer satisfaction.",
            },
            {
              title: "Reliability",
              description:
                "We maintain punctuality and dependability in all our services, respecting our customers' time.",
            },
            {
              title: "Innovation",
              description:
                "We continuously seek innovative solutions to improve our services and operations.",
            },
            {
              title: "Integrity",
              description:
                "We conduct our business with honesty, transparency, and ethical standards.",
            },
            {
              title: "Sustainability",
              description:
                "We are committed to environmentally responsible practices and sustainable operations.",
            },
          ].map((value, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
            >
              <h3 className="text-xl font-bold text-[#A62C2C] mb-3">
                {value.title}
              </h3>
              <p className="">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className=" py-16 font-mono">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#A62C2C]">
              Our Leadership Team
            </h2>
            <p className="  mt-4 max-w-3xl mx-auto">
              Meet the experienced professionals who drive our vision forward.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((member) => (
              <div
                key={member}
                className="bg-white rounded-lg overflow-hidden shadow-md"
              >
                <div className="h-48 flex items-center justify-center">
                  <img
                    src={`/api/placeholder/300/300`}
                    alt={`Team member ${member}`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#A62C2C]">John Doe</h3>
                  <p className=" mb-4">Chief Executive Officer</p>
                  <p className="">
                    With over 15 years of experience in the transportation
                    industry, John leads our company with vision and expertise.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-white py-16 text-[#A62C2C] font-mono">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 font-mono">
            Ready to Experience Our Services?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of satisfied customers who trust us for their
            transportation needs.
          </p>
          <button className="py-3 px-4 bg-[#A62C2C] text-white hover:bg-[#8B2525] font-medium rounded-full transition duration-300 text-center text-lg">
            <Link
              to="/contact"
              className="flex-shrink-0 flex items-center space-x-2">             
              Contact Us Today
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
}
