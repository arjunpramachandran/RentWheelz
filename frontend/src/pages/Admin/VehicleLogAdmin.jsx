import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../config/axiosinstance';
import VehicleDetails from '../../components/VehicleDetails'; // Reuse if already exists
import { isAfter, isBefore, parseISO, format } from 'date-fns';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";

const VehicleLogAdmin = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState();
  const [currentRide, setCurrentRide] = useState([]);
  const [completedRides, setCompletedRides] = useState([]);
  const [nextRides, setNextRides] = useState([])
  const [reviews, setReviews] = useState([]);
  console.log(id);

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get(`/admin/getVehicle/${id}`, { withCredentials: true });
      setVehicle(res.data.vehicle);
console.log(res);

      const rideRes = await api.get(`/admin/bookingByVehicle/${id}`, { withCredentials: true });
      const bookings = rideRes?.data?.bookings
      console.log(bookings);

      const now = new Date();

      const rideOnGoing = bookings.filter(ride => {
        const start = new Date(ride.pickupDateTime);
        const end = new Date(ride.dropoffDateTime);
        return isBefore(start, now) && isAfter(end, now); // Ride has started but not yet ended
      });

      const rideCompleted = bookings.filter(ride => {
        const end = new Date(ride.dropoffDateTime);
        return isBefore(end, now); // Ride has ended
      });

      const upcomingRides = bookings.filter(ride => {
        const start = new Date(ride.pickupDateTime);
        return isAfter(start, now); // Ride hasn't started yet
      });
      console.log(rideOnGoing);

      setCurrentRide(rideOnGoing);
      setCompletedRides(rideCompleted);
      setNextRides(upcomingRides)


      const reviewRes = await api.get(`admin/getReviewByVehicle/${id}`, { withCredentials: true });
      console.log(reviewRes);

      setReviews(reviewRes.data.reviews);
    };

    fetchData();
  }, [id]);


  const formattedReviews = reviews.map((review) => ({
    name: review?.userId?.name || "Anonymous",
    avatar: review?.userId?.profilepic || "",
    message: review?.comment || "",
    rating: review?.rating || 5,

  }));

  console.log(reviews);

  if (!vehicle) return <p>Loading...</p>;

  return (
    <div className="p-4 space-y-6">
      {/* Vehicle Details */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Vehicle Details</h2>
        <VehicleDetails vehicle={vehicle} key={vehicle._id} />
      </div>

      {/* Current Ride */}
      <div className="bg-blue-50 p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-2">Current Ride</h2>
        {currentRide.length > 0 ? (
          <div>

            <p><strong>User:</strong> {currentRide.name}</p>
            <p><strong>Pickup:</strong> {currentRide.pickupLocation}</p>

            <p><strong>Status:</strong> {currentRide.status}</p>
            <div className="mt-2">
              <button className="bg-cyan-600 text-white py-1 px-3 rounded-full hover:bg-cyan-700">
                Track Location
              </button>
            </div>
          </div>


        ) : (
          <p className="text-gray-500 italic">No active ride</p>
        )}
      </div>
      {/* Completed Rides */}
      <div className="bg-green-50 p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-2">Completed Rides</h2>
        {completedRides.length === 0 ? (
          <p className="text-gray-500">No completed rides.</p>
        ) : (
          <ul className="space-y-2">
            {completedRides.map((ride, index) => (
              <li key={index} className="border p-3 rounded-md">
                <p><strong>User:</strong> {ride.name}</p>
                <p><strong>Pickup:</strong> {ride.pickupLocation}</p>
                <p><strong>Address:</strong> {ride.Address}</p>
                <p><strong>Date:</strong> {format(parseISO(ride.pickupDateTime), "dd MMM yyyy, hh:mm a")}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className='p-4 bg-red-50 border rounded-xl mb-4 shadow'>
        <h2 className="text-lg font-semibold mb-2">Upcoming Rides</h2>
        {nextRides.length > 0 ? (
          nextRides.map((ride, idx) => (
            <div key={idx} className="text-gray-500">
              <h4 className="font-semibold text-md">
                Vehicle Pick Up From : {ride.pickupLocation} ,{ride.address}
              </h4>
              <p>Starts at: {format(parseISO(ride.pickupDateTime), "dd MMM yyyy, hh:mm a")}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No upcoming bookings</p>
        )}
      </div>

      {/* Reviews */}
      <div className="bg-yellow-50 p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-2">User Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <div className='flex flex-row  gap-2'>
            {formattedReviews.map((t, index) => (

              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition duration-300 flex flex-col items-center text-left">
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

            ))}
          </div>


        )}
      </div>
    </div>
  );
};

export default VehicleLogAdmin;
