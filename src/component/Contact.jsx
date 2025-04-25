import { useState } from "react";
import { Phone, Mail, MapPin, MessageSquare, Send } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Here you would typically send the data to your backend
    setSubmitted(true);

    // Reset form after submission
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className=" bg-transparent shadow-md font-mono text-lg font-bold text-[#A62C2C] p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-mono text-[#A62C2C]">
            Contact Us
          </h2>
          <p className="mt-4 text-lg font-mono text-[#A62C2C]">
            Have questions about our bus services? We're here to help!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-6 font-mono text-[#A62C2C]">
              Reach Out To Us
            </h3>

            <div className="space-y-4">
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-[#A62C2C] mr-4 mt-1 flex-shrink-0" />
                <p className="mt-1 text-gray-600">010 6788 8876</p>
              </div>

              <div className="flex items-center">
                <Mail className="w-5 h-5 text-[#A62C2C] mr-4 mt-1 flex-shrink-0" />
                <p className="mt-1 text-gray-600">support@BUS-BOOKING.com</p>
              </div>

              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-[#A62C2C] mr-4 mt-1 flex-shrink-0" />
                <div>
                  <p className="mt-1 text-gray-600">
                    123 Transport Avenue
                    <br />
                    City Center, ST 12345
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <MessageSquare className="w-5 h-5 text-[#A62C2C] mr-4 mt-1 flex-shrink-0" />
                <div>
                  <p className="mt-1 text-gray-600">
                    Monday - Friday: 8am - 8pm
                    <br />
                    Saturday & Sunday: 9am - 5pm
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-6 text-[#A62C2C] font-mono">
              Send Us a Message
            </h3>

            {submitted ? (
              <div className="bg-green-50 p-4 rounded-md">
                <p className="text-green-800 font-medium">
                  Thank you! Your message has been sent. We'll respond shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-[#A62C2C]"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[#A62C2C]"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-[#A62C2C]"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-[#A62C2C]"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg bg-[#A62C2C] text-white hover:bg-[#8B2525] font-mono text-lg focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
