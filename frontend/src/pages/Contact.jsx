import React from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const contactDetails = [
  {
    title: 'Email Us',
    info: 'support@rentwheelz.com',
    icon: <FaEnvelope className="text-2xl text-cyan-600 mb-2" />,
  },
  {
    title: 'Call Us',
    info: '+91 98765 43210',
    icon: <FaPhone className="text-2xl text-cyan-600 mb-2" />,
  },
  {
    title: 'Visit Us',
    info: '1234 Kerala Street, Suite 5678',
    icon: <FaMapMarkerAlt className="text-2xl text-cyan-600 mb-2" />,
  },
];

const Contact = () => {
  return (
    <div className="py-16 px-6 md:px-12">

      <section className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Contact Us</h2>
        <p className="text-gray-600 text-lg">
          Have a question, suggestion, or just want to say hello? We're here to help. Reach out to us anytime, and our team will get back to you as soon as possible.
        </p>
      </section>


      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
        {contactDetails.map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 text-center rounded-xl shadow-md border border-gray-200"
          >
            {item.icon}
            <h4 className="text-lg font-semibold text-gray-700 mb-1">{item.title}</h4>
            <p className="text-sm text-gray-500">{item.info}</p>
          </div>
        ))}
      </section>

      {/* Contact Form */}
      {/* Contact Form + Map Side-by-Side */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        {/* Contact Form */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Send a Message</h3>
          <form className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                rows="5"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Write your message here..."
              />
            </div>
            <div className="text-center mt-4">
              <button
                type="submit"
                className="bg-cyan-600 text-white px-6 py-3 rounded-md hover:bg-cyan-700 transition"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>

        {/* Google Map */}
        <div className="rounded-xl overflow-hidden shadow-md border border-gray-200">
          <iframe
            title="RentWheelz Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2008292.2464743003!2d74.81903630372632!3d10.544245683847834!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0812ffd49cf55b%3A0x64bd90fbed387c99!2sKerala!5e0!3m2!1sen!2sin!4v1749653198308!5m2!1sen!2sin"
            width="100%"
            height="100%"
            className="w-full "
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          
        </div>
      </section>


    </div>
  );
};

export default Contact;
