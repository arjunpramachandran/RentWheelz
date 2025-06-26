import React from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import { useEffect, useState } from 'react';
import { api } from '../config/axiosinstance'; // Adjust the import path as necessary

const testimonials = [
    {
        name: "Ravi Kumar",
        role: "Frequent Renter",
        message: "Booking a car was seamless and fast. The vehicle was clean and the driver was professional. Highly recommend!",
        rating: 5,
        avatar: "https://i.pravatar.cc/100?img=1",
    },
    {
        name: "Ayesha Sheikh",
        role: "Tourist",
        message: "Used their car with driver service during my vacation — one of the best travel decisions I made!",
        rating: 4,
        avatar: "https://i.pravatar.cc/100?img=2",
    },
    {
        name: "Karan Patel",
        role: "Host",
        message: "Listing my car was easy, and I started earning within days. The team is super supportive.",
        rating: 5,
        avatar: "",
    },
    {
        name: "Aarav Mehta",
        role: "Business Traveler",
        message: "The booking process was incredibly simple. The car was clean and ready on time. Excellent service!",
        rating: 5,
        avatar: "https://i.pravatar.cc/100?img=12",
    },
    {
        name: "Sneha Kapoor",
        role: "Freelancer",
        message: "I rented a bike for my daily commute — super smooth ride and budget-friendly too!",
        rating: 4,
        avatar: "https://i.pravatar.cc/100?img=47",
    },
    {
        name: "Ravi Nair",
        role: "Tourist",
        message: "The live tracking feature gave me peace of mind while exploring the city. Highly recommend!",
        rating: 5,
        avatar: "https://i.pravatar.cc/100?img=23",
    },
];

const Review = () => {
    var [reviews, setReviews] = useState([]);

    useEffect(() => {
        console.log("Updated reviews state:", reviews);
    }, [reviews]);
    const fetchData = async () => {
        try {
            const response = await api({ method: "GET", url: '/user/getAllReviews' });
            const backendReviews = response?.data?.reviews || [];

            const formattedReviews = backendReviews.map((review) => ({
                name: review?.userId?.name || "Anonymous",
                avatar: review?.userId?.profilepic || "",
                message: review?.comment || "",
                rating: review?.rating || 5,
                role: review?.userId?.role || "User",
            }));
           
            setReviews(formattedReviews.length > 0 ? [...formattedReviews, ...testimonials] : testimonials);



        } catch (error) {
            console.error('Error fetching Reviews:', error);
            setReviews([...testimonials]);
        }
    }

    useEffect(() => {
        fetchData();

    }, []);



    return (
        <section className="py-10 bg-gray-100 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">What They Say</h2>
            <p className="text-lg text-gray-600 mb-12">
                Hear from our customers and partners about their experience
            </p>

            <div className="max-w-6xl mx-auto px-4">
                <Swiper
                    spaceBetween={30}
                    slidesPerView={1}
                    breakpoints={{
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                        1280: { slidesPerView: 4 },
                        1536: { slidesPerView: 5 },
                    }}
                    autoplay={{ delay: 5000 }}
                    modules={[Autoplay]}
                >
                    {reviews.map((t, index) => (
                        <SwiperSlide key={index}>
                            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition duration-300 h-full flex flex-col items-center text-left">
                                {t.avatar ? (
                                    <img
                                        src={t.avatar}
                                        alt={t.name}
                                        className="w-14 h-14 rounded-full mb-4 object-cover"
                                    />
                                ) : (
                                    <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-4 text-xl font-bold">
                                        {t.name.charAt(0)}
                                    </div>
                                )}

                                <div className="text-amber-500 text-base mb-2 flex">
                                    {Array.from({ length: 5 }, (_, i) => {
                                        const full = i + 1 <= Math.floor(t.rating);
                                        const half = i < t.rating && i + 1 > t.rating;

                                        return (
                                            <span key={i}>
                                                {full ? "★" : half ? "⯪" : "☆"}
                                            </span>
                                        );
                                    })}
                                </div>

                                <p className="text-gray-600 italic mb-4 text-sm">“{t.message}”</p>
                                <h3 className="text-lg font-semibold text-emerald-700">{t.name}</h3>
                                <p className="text-sm text-gray-500">{t.role}</p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                
            </div>
        </section>
    )
}

export default Review