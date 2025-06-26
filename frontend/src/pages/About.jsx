import React from 'react';
import { Link } from 'react-router-dom';
import { FaCarAlt, FaUserShield, FaPhoneAlt, FaMapMarkedAlt } from 'react-icons/fa';

const quickLinks = [
  {
    title: 'Our Vehicles',
    description: 'Browse cars & bikes available for rent.',
    icon: <FaCarAlt className="text-3xl text-cyan-600 mb-2" />,
    link: '/vehicle',
  },
  {
    title: 'Become a Host',
    description: 'Earn by listing your vehicle with us.',
    icon: <FaUserShield className="text-3xl text-cyan-600 mb-2" />,
    link: '/hostRegister',
  },
  {
    title: 'Contact Us',
    description: 'We’re here to help anytime.',
    icon: <FaPhoneAlt className="text-3xl text-cyan-600 mb-2" />,
    link: '/contact',
  },
  {
    title: 'Our Locations',
    description: 'Find our rental hubs near you.',
    icon: <FaMapMarkedAlt className="text-3xl text-cyan-600 mb-2" />,
    link: '/locations',
  },
];

const About = () => {
  return (
    <div className="py-16 px-6 md:px-12">
      {/* Company Intro */}
      <section className="max-w-5xl mx-auto text-center mb-16">
        <h2 className="text-4xl font-bold  mb-4">About Us</h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          Welcome to <span className="font-semibold text-cyan-600">RentWheelz</span>, your trusted partner in modern mobility. Whether you're traveling for work, leisure, or daily commutes, we’re here to make transportation convenient and hassle-free. With a wide selection of cars, bikes, and premium chauffeured options, we cater to every traveler’s need.
        </p>
      </section>

      {/* Mission & Values */}
      <section className="max-w-6xl mx-auto text-center mb-20">
        <h3 className="text-2xl font-bold  mb-4">Our Mission</h3>
        <p className="text-gray-600 mb-6">
          Our mission is to transform urban and intercity travel by providing safe, reliable, and affordable mobility solutions.
        </p>
        <h4 className="text-xl font-semibold  mb-2">What Drives Us</h4>
        <ul className="text-gray-600 space-y-2">
          <li>✔️ Simplicity and transparency in renting</li>
          <li>✔️ A wide fleet of quality vehicles</li>
          <li>✔️ Tech-driven experience with GPS tracking, fast booking & support</li>
          <li>✔️ Opportunities for locals to earn by becoming hosts</li>
        </ul>
      </section>

      {/* Quick Links */}
      <section className="max-w-6xl mx-auto mb-20">
        <h3 className="text-2xl font-semibold  mb-6 text-center">Quick Links</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {quickLinks.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className="bg-white hover:bg-cyan-50 transition-all duration-300 p-6 rounded-xl shadow-md border border-gray-200 text-center"
            >
              {item.icon}
              <h4 className="text-lg font-bold text-gray-700 mb-1">{item.title}</h4>
              <p className="text-sm text-gray-500">{item.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Call To Action */}
      <section className="max-w-4xl mx-auto bg-cyan-100 rounded-xl p-8 text-center shadow-md">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Ride With Us?</h3>
        <p className="text-gray-700 mb-6">
          Explore our vehicles or become a host today and be part of a smarter transportation future.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link to="/vehicle" className="px-6 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition">
            Browse Vehicles
          </Link>
          <Link to="/hostRegister" className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition">
            Become a Host
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
