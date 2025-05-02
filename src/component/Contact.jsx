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
  const [errors, setErrors] = useState({});

  // Validate email format
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};
    
    // Check for empty fields
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    else if (formData.message.trim().length < 10) newErrors.message = "Message must be at least 10 characters";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
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
    <div className="bg-transparent shadow-md font-mono text-lg font-bold text-[#A62C2C] p-4">
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
              <div className="flex items-start">
                <Phone className="w-5 h-5 text-[#A62C2C] mr-4 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-600">010 6788 8876</p>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="w-5 h-5 text-[#A62C2C] mr-4 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-600">support@BUS-BOOKING.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-[#A62C2C] mr-4 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-600">
                    123 Transport Avenue
                    <br />
                    City Center, ST 12345
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <MessageSquare className="w-5 h-5 text-[#A62C2C] mr-4 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-600">
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
              <div className="space-y-4">
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
                    className={`mt-1 block w-full border ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
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
                    className={`mt-1 block w-full border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
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
                    className={`mt-1 block w-full border ${
                      errors.subject ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                  )}
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
                    className={`mt-1 block w-full border ${
                      errors.message ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500`}
                  ></textarea>
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                  )}
                </div>
                <div>
                  <button
                    onClick={handleSubmit}
                    type="submit"
                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg bg-[#A62C2C] text-white hover:bg-[#8B2525] font-mono text-lg focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}