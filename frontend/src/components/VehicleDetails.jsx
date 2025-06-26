import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { FaStar, FaRegStar } from "react-icons/fa";
import { useSelector } from "react-redux";


const VehicleDetails = ({ vehicle }) => {
    const {isLoggedIn} =  useSelector((state)=>state.user)
    const {bookingData} = useSelector((state)=>state.booking.bookingData)
    
    
    const swiperRef = useRef(null);
    const {
        brand,
        model,
        year,
        fuel,
        transmission,
        pricePerDay,
        images,
        driverAvailable,
        discription,
        status,
        rateOfDriver,
        location,
        rating = 4,
    } = vehicle;
    console.log(vehicle);

    return (
        <div className="flex flex-col md:flex-row gap-8 p-6 max-w-6xl mx-auto bg-white shadow rounded-2xl mt-6">


            <div className="w-full md:w-1/2">
                <Swiper spaceBetween={10} slidesPerView={1} onSwiper={(swiper) => { swiperRef.current = swiper }} className="rounded-xl">
                    {images.map((img, idx) => (
                        <SwiperSlide key={idx}>
                            <img
                                src={img}
                                alt={`Vehicle ${idx + 1}`}
                                className="max-w-full aspect-video object-cover rounded-xl"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>


                <div className="flex gap-2 mt-2 overflow-x-auto">
                    {images.map((img, idx) => (
                        <img
                            key={idx}
                            src={img}
                            alt="thumb"
                            className="w-20 h-16 object-cover rounded-lg border hover:ring-2 ring-blue-500 cursor-pointer"
                            onClick={() => swiperRef.current?.slideTo(idx)}
                        />
                    ))}
                </div>
            </div>


            <div className="w-full md:w-1/2 space-y-4">
                <h2 className="text-3xl font-bold">{brand} {model} ({year})</h2>


                <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, i) =>
                        i < rating ? (
                            <FaStar key={i} className="text-yellow-400" />
                        ) : (
                            <FaRegStar key={i} className="text-gray-400" />
                        )
                    )}
                    <span className="text-sm text-gray-500">({rating}/5)</span>
                </div>

                <p className="text-xl font-semibold text-blue-600">₹{pricePerDay} / day</p>
                <p className="text-gray-600">{discription}</p>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mt-4">
                    <div><span className="font-medium">Fuel:</span> {fuel.toUpperCase()}</div>
                    <div><span className="font-medium">Transmission:</span> {transmission.toUpperCase()}</div>
                    <div><span className="font-medium">Driver:</span> {driverAvailable? "Yes" : "No"}</div>
                    <div><span className="font-medium">Status:</span> {status.toUpperCase()}</div>
                    
                    {location && (
                        <div><span className="font-medium">Location:</span> {location}</div>
                    )}
                </div>
                {!isLoggedIn && (
                    <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition">
                    Book Now
                </button>
                )}
                
            </div>
        </div>
    );
};

export default VehicleDetails;
