import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { TbSend } from "react-icons/tb";
const ContactUs = () => {
  const faqs = [
    {
      question: "How is the score calculated?",
      answer:
        "The score is calculated based on problem difficulty, with harder problems weighted more heavily. We also consider contest participation and platform-specific ratings.",
    },
    {
      question: "How often is the data updated?",
      answer:
        "The data is updated whenever new profiles are uploaded by administrators. Student performance data syncs weekly.",
    },
  ];
  return (
    <>
      <Navbar />
      <section className="px-4 py-8 md:px-12 lg:px-24 xl:px-36 md:py-12 flex flex-col md:flex-row md:gap-12 lg:gap-24 xl:gap-36 min-h-[88vh] justify-center">
        {/* Left Column */}
        <div className="w-full md:w-1/2 mb-10 md:mb-0">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Contact Us</h2>
          <p className="text-gray-600 mb-8">
            Have questions about the Student Coding Profile Dashboard? We'd love
            to hear from you. Fill out the form or reach out through any of the
            contact methods below.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <i className="fas fa-envelope mt-1 text-gray-600"></i>
              <div>
                <p className="font-medium text-gray-800">info@ofzen.in</p>
                <p className="text-sm text-gray-500">
                  We'll respond within 24 hours
                </p>
              </div>
            </div>
          </div>

          {/* Office Hours */}
          <div className="mt-8 md:mt-10">
            <h3 className="font-semibold text-lg text-gray-800 mb-2">
              Office Hours
            </h3>
            <div className="bg-gray-100 p-4 rounded-lg text-sm text-gray-700">
              <p className="font-medium">
                Monday - Friday
                <br />
                10:00 AM - 4:00 PM
              </p>
              <p className="mt-2 text-xs text-gray-500">
                Responses may be delayed outside of office hours
              </p>
            </div>
          </div>
          {/* Embedded Map */}
          <div className="mt-6 rounded overflow-hidden">
            <iframe
              title="Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3813.6586735108035!2d82.06222184967987!3d17.08934056956225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3782e23e8dc385%3A0x9916ae57f5d1f1ad!2sAditya%20University!5e0!3m2!1sen!2sus!4v1747199210002!5m2!1sen!2sus"
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded shadow w-full"
            ></iframe>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full md:w-1/2">
          <div className="bg-white border rounded-lg shadow p-4 sm:p-6">
            <h3 className="text-lg md:text-xl font-semibold mb-4">Send Us Feedback</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="mt-1 w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Your email address"
                  className="mt-1 w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  rows="4"
                  placeholder="How can we help you?"
                  className="mt-1 w-full border rounded px-3 py-2"
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-gray-900 text-white py-2 px-4 rounded flex items-center justify-center w-full gap-2 hover:bg-black transition"
              >
                <TbSend /> Send Message
              </button>
            </form>
          </div>

          {/* FAQ Section */}
          <div className="mt-8 md:mt-10 space-y-4">
            <h3 className="text-lg md:text-xl font-semibold">
              Frequently Asked Questions
            </h3>
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800">{faq.question}</h4>
                <p className="text-sm text-gray-600 mt-1">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ContactUs;
