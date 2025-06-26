import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BookingForm from '../components/BookingForm';
import { FaCar, FaMotorcycle, FaUserTie, FaMapMarkedAlt, FaThumbsUp, FaCrown, FaShieldAlt, FaUndoAlt } from "react-icons/fa";
import Review from '../components/Review';


const slides = [
  {
    id: 'slide1',
    image: './WEb/bmw-3-0-csl-mi-05.jpg',
    heading: 'Self-Drive Cars at Your Fingertips',
    subtext: 'Choose from a wide range of well-maintained cars for your next trip. Easy booking. No hidden charges.',
  },
  {
    id: 'slide1',
    image: './WEb/4613-2560x1704-desktop-hd-bike-wallpaper-image.jpg',
    heading: 'Two Wheels, Endless Freedom',
    subtext: 'Zip through traffic or cruise the coast — our bikes give you the freedom to move on your own terms.',
  },
  {
    id: 'slide1',
    image: './WEb/lovepik-car-drivers-are-invited-to-welcome-the-photo-picture_500716595.jpg',
    heading: 'Relax and Ride with a Professional Driver',
    subtext: 'Chauffeur-driven cars for weddings, business, or leisure. Arrive on time — in style and comfort.',
  },
  {
    id: 'slide1',
    image: './WEb/woman-enjoying-her-financially-independence-while-buying-car_23-2149434385.avif',
    heading: 'List Your Vehicle. Earn On Your Terms.',
    subtext: 'Turn your idle car or bike into a revenue stream. Join hundreds of vehicle owners making money by becoming hosts.',
  },
];
const services = [
  {
    title: "Rent a Car",
    description: "Choose from a wide range of cars for daily or long trips.",
    icon: <FaCar className="mx-auto text-4xl text-emerald-600 mb-4" />,
  },
  {
    title: "Rent a Bike",
    description: "Affordable and convenient bike rentals at your fingertips.",
    icon: <FaMotorcycle className="mx-auto text-4xl text-emerald-600 mb-4 " />,
  },
  {
    title: "Car with Driver",
    description: "Sit back and relax with our chauffeur-driven car rentals.",
    icon: <FaUserTie className="mx-auto text-4xl text-emerald-600 mb-4 " />,
  },
  {
    title: "Become a Host",
    description: "List your vehicle and earn by renting it out.",
    icon: <FaMapMarkedAlt className="mx-auto text-4xl text-emerald-600 mb-4" />,
  },
];

const reasons = [
  {
    title: "Easy Rent",
    description: "Book a ride in just a few simple steps with instant confirmation.",
    icon: <FaThumbsUp className="text-4xl text-cyan-800 mb-4" />,
  },
  {
    title: "Premium Quality",
    description: "We offer top-condition vehicles with regular maintenance checks.",
    icon: <FaCrown className="text-4xl text-cyan-800 mb-4" />,
  },
  {
    title: "Professional Driver",
    description: "Our drivers are trained, certified, and ensure your comfort.",
    icon: <FaUserTie className="text-4xl text-cyan-800 mb-4" />,
  },
  {
    title: "Car Safety",
    description: "Each vehicle is equipped with safety kits and GPS tracking.",
    icon: <FaShieldAlt className="text-4xl text-cyan-800 mb-4" />,
  },
  {
    title: "Refund",
    description: "Get easy refunds with our transparent cancellation policy.",
    icon: <FaUndoAlt className="text-4xl text-cyan-800 mb-4" />,
  },
  {
    title: "Live Monitoring",
    description: "Track your ride in real-time with our live GPS integration.",
    icon: <FaMapMarkedAlt className="text-4xl text-cyan-800 mb-4" />,
  },
];



const textVariants = {
  hidden: { x: -100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.8 },
  },
  exit: {
    x: 100,
    opacity: 0,
    transition: { duration: 0.5 },
  },
};

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);


  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto h-full relative">
      <div className="carousel w-full relative overflow-hidden">

        <img
          src={slides[currentSlide].image}
          className="w-full h-100 object-cover"
          alt="slide"
        />


        <AnimatePresence mode="wait" >
          <motion.div
            key={currentSlide}
            className="absolute top-1/4 left-10 right-10 max-w-md p-6 rounded-xl text-white backdrop-blur-sm bg-black/20"
            variants={textVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h2 className="text-3xl font-bold mb-2">{slides[currentSlide].heading}</h2>
            <p className="text-lg">{slides[currentSlide].subtext}</p>
          </motion.div>
        </AnimatePresence>


        <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
          <button onClick={prevSlide} className="btn btn-circle">❮</button>
          <button onClick={nextSlide} className="btn btn-circle">❯</button>
        </div>

      </div>
      <div className='  rounded-2xl  flex justify-center items-center mt-10'>
        <BookingForm />
      </div>
      <div className="top-50 mt-10 p-4 text-center rounded-lg border-t-2 border-gray-100 shadow-lg">
        <h2 className="text-3xl md:text-4xl font-bold  mb-6">How It Works</h2>

        <p className="text-lg ">
          Rent With Following Three Simple Steps
        </p>
        <div className="relative flex w-auto flex-col md:flex-row justify-center  gap-10 mt-10 mb-5">

          <div className="hidden md:block absolute top-12 left-0 right-0 mx-auto h-0.5 border-t-2 border-dashed border-gray-300 z-0"></div>


          <div className="relative z-10 flex flex-col items-center max-w-xs text-center">

            <svg className=' w-24 p-6 h-24 flex items-center justify-center rounded-xl mb-4 shadow-md bg-gray-100' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="120" height="120" fill="rgba(46,158,89,1)"><path d="M12 20.8995L16.9497 15.9497C19.6834 13.2161 19.6834 8.78392 16.9497 6.05025C14.2161 3.31658 9.78392 3.31658 7.05025 6.05025C4.31658 8.78392 4.31658 13.2161 7.05025 15.9497L12 20.8995ZM12 23.7279L5.63604 17.364C2.12132 13.8492 2.12132 8.15076 5.63604 4.63604C9.15076 1.12132 14.8492 1.12132 18.364 4.63604C21.8787 8.15076 21.8787 13.8492 18.364 17.364L12 23.7279ZM12 13C13.1046 13 14 12.1046 14 11C14 9.89543 13.1046 9 12 9C10.8954 9 10 9.89543 10 11C10 12.1046 10.8954 13 12 13ZM12 15C9.79086 15 8 13.2091 8 11C8 8.79086 9.79086 7 12 7C14.2091 7 16 8.79086 16 11C16 13.2091 14.2091 15 12 15Z"></path></svg>

            <h3 className="text-lg font-semibold mb-2">Choose Location</h3>
            <p className="text-sm text-gray-500">Choose your location and find your best car.</p>
          </div>


          <div className="relative z-10 flex flex-col items-center max-w-xs text-center">
            <svg className='w-24 p-6 h-24 flex items-center justify-center rounded-xl mb-4 shadow-md bg-gray-100' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="120" height="120" fill="rgba(46,158,89,1)"><path d="M7 3V1H9V3H15V1H17V3H21C21.5523 3 22 3.44772 22 4V9H20V5H17V7H15V5H9V7H7V5H4V19H10V21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H7ZM17 12C14.7909 12 13 13.7909 13 16C13 18.2091 14.7909 20 17 20C19.2091 20 21 18.2091 21 16C21 13.7909 19.2091 12 17 12ZM11 16C11 12.6863 13.6863 10 17 10C20.3137 10 23 12.6863 23 16C23 19.3137 20.3137 22 17 22C13.6863 22 11 19.3137 11 16ZM16 13V16.4142L18.2929 18.7071L19.7071 17.2929L18 15.5858V13H16Z"></path></svg>
            <h3 className="text-lg font-semibold mb-2">Pick-up Date</h3>
            <p className="text-sm text-gray-500">Select your pick up date and time to book your car.</p>
          </div>


          <div className="relative z-10 flex flex-col items-center max-w-xs text-center">
            <svg className='w-24 p-6 h-24 flex items-center justify-center rounded-xl mb-4 shadow-md bg-gray-100' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="120" height="120" fill="rgba(46,158,89,1)"><path d="M19 20H5V21C5 21.5523 4.55228 22 4 22H3C2.44772 22 2 21.5523 2 21V13.5L0.757464 13.1894C0.312297 13.0781 0 12.6781 0 12.2192V11.5C0 11.2239 0.223858 11 0.5 11H2L4.4805 5.21216C4.79566 4.47679 5.51874 4 6.31879 4H17.6812C18.4813 4 19.2043 4.47679 19.5195 5.21216L22 11H23.5C23.7761 11 24 11.2239 24 11.5V12.2192C24 12.6781 23.6877 13.0781 23.2425 13.1894L22 13.5V21C22 21.5523 21.5523 22 21 22H20C19.4477 22 19 21.5523 19 21V20ZM20 18V13H4V18H20ZM5.47703 11H18.523C18.6502 11 18.7762 10.9757 18.8944 10.9285C19.4071 10.7234 19.6566 10.1414 19.4514 9.62861L18 6H6L4.54856 9.62861C4.50131 9.74673 4.47703 9.87278 4.47703 10C4.47703 10.5523 4.92475 11 5.47703 11ZM5 14C7.31672 14 8.87868 14.7548 9.68588 16.2643L9.68582 16.2643C9.81602 16.5078 9.72418 16.8107 9.4807 16.9409C9.40818 16.9797 9.3272 17 9.24496 17H6C5.44772 17 5 16.5523 5 16V14ZM19 14V16C19 16.5523 18.5523 17 18 17H14.755C14.6728 17 14.5918 16.9797 14.5193 16.9409C14.2758 16.8107 14.184 16.5078 14.3142 16.2643L14.3141 16.2643C15.1213 14.7548 16.6833 14 19 14Z"></path></svg>
            <h3 className="text-lg font-semibold mb-2">Book Your Vehicle</h3>
            <p className="text-sm text-gray-500">Book your Vehicle and we will deliver it directly to you.</p>
          </div>
        </div>

      </div>


      <div className="top-50 mt-10 p-4 text-center rounded-lg border-t-2 border-gray-100 shadow-lg">
        <section className="py-16 bg-gray-50 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800  mb-6">Our Services</h2>
          <p className="text-lg text-gray-600 mb-12">Explore the services we offer to make your ride easy and enjoyable</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto px-4">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white shadow-md shadow-emerald-800 hover:shadow-2xl hover:border-b-emerald-700 hover:border-2 transition duration-300 rounded-xl p-6 border border-gray-100"
              >
                {service.icon}
                <h3 className="text-xl font-semibold text-gray-700 mb-2">{service.title}</h3>
                <p className="text-sm text-gray-500">{service.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <div className="top-50 mt-10 p-4 text-center rounded-lg border-t-2 border-gray-100 shadow-lg">

        <section className="py-16 bg-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Why Choose Us</h2>
          <p className="text-lg text-gray-600 mb-12">
            We go beyond just renting — we ensure your satisfaction, safety, and convenience.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
            {reasons.map((reason, index) => (
              <div
                key={index}
                className="bg-gray-50 flex items-start gap-4 shadow-cyan-500 hover:shadow-md transition-all duration-300 p-6 rounded-xl border-t-4 border-emerald-500 border-b-4 "
              >
                <div className="pt-3">{reason.icon}</div>
                <div className='text-start'>
                  <h3 className="text-xl font-semibold text-gray-700">{reason.title}</h3>
                  <p className="text-sm text-gray-500">{reason.description}</p>
                </div>


              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="top-50 mt-10 p-4 text-center rounded-lg border-t-2 border-gray-100 shadow-lg">

        <Review />
      </div>

    </div>
  );
};

export default Home;
