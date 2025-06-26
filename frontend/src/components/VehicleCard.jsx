import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { FaGasPump, FaCogs } from 'react-icons/fa';
import { GiGearStickPattern } from "react-icons/gi";
import { TbAutomaticGearbox } from "react-icons/tb";


import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


const VehicleCard = ({ vehicle }) => {
  const { userData,isLoggedIn } = useSelector((state) => state.user);
const navigate = useNavigate();
  const handleBookNow = ()=>{
    if(isLoggedIn){
      navigate(`/user/vehicleBooking/${vehicle._id}`)
    }
    else navigate(`/vehicle/${vehicle._id}`)
  }
  return (
    <div className="relative rounded-2xl overflow-hidden p-4 shadow-md bg-white w-full md:w-80 border border-gray-200 hover:shadow-xl transition-all duration-300">

      
      <div className="relative">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation={{
            nextEl: '.custom-next',
            prevEl: '.custom-prev',
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={vehicle.images.length > 1}
          className="w-full h-56 rounded-lg overflow-hidden"
        >
          {vehicle.images.map((img, index) => (
            <SwiperSlide key={index}>
              <img
                src={img}
                alt={`vehicle-${index}`}
                className="w-full h-56 object-cover"
              />
            </SwiperSlide>
          ))}

          <button className="custom-prev absolute top-1/2 left-2 z-10 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="custom-next absolute top-1/2 right-2 z-10 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </Swiper>
      </div>

     
      <div className="mt-4 px-2">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          {vehicle.brand} {vehicle.model} ({vehicle.year})
        </h3>

       
        <div className="flex items-center justify-between text-sm text-gray-600 my-2">
          <div className="flex items-center gap-1">
            <FaGasPump className="text-blue-500" />
            <span>{vehicle.fuel?.toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-1">
            {(vehicle.transmission==='manual') ? (<GiGearStickPattern className="text-green-600" />):(
              <TbAutomaticGearbox className="text-green-600"/>
            )}
            
            <span>{vehicle.transmission?.toUpperCase()}</span>
          </div>
        </div>

        
        <p className="text-indigo-600 font-bold text-sm mt-1">
          ₹{vehicle.pricePerDay} / day
        </p>
      </div>

      
      {userData._id === vehicle.ownerId ? (
        <div onClick={()=>{navigate(`/host/updateVehicle/${vehicle._id}`)}} className="flex justify-between items-center mt-4 px-1 gap-2">
          <button className="w-full bg-cyan-600 text-white py-2 rounded-full hover:bg-cyan-700 transition duration-300 text-sm font-medium">
            Update
          </button>
          <button className="w-full bg-cyan-600 text-white py-2 rounded-full hover:bg-cyan-700 transition duration-300 text-sm font-medium">
            Delete
          </button>
          <button className="w-full bg-cyan-600 text-white py-2 rounded-full hover:bg-cyan-700 transition duration-300 text-sm font-medium">
            Log
          </button>
        </div>
      ):(
      <div className="flex justify-between items-center mt-4 px-2">
        <button onClick={handleBookNow} className= "w-full bg-cyan-600 text-white py-2 rounded-full hover:bg-cyan-700 transition duration-300 text-sm font-medium">
          Book Now
        </button>
      </div>
      )}
      
    </div>
  );
};

export default VehicleCard;
