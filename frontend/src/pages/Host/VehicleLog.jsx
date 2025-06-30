import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../config/axiosinstance';
import VehicleDetails from '../../components/VehicleDetails'; // Reuse if already exists
import { isAfter, isBefore, parseISO, format } from 'date-fns';

const VehicleLog = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState();
  const [currentRide, setCurrentRide] = useState([]);
  const [completedRides, setCompletedRides] = useState([]);
  const [nextRides, setNextRides] = useState([])
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get(`host/getVehicle/${id}`, { withCredentials: true });
      setVehicle(res.data.vehicle);

      const rideRes = await api.get(`host/bookingByVehicle/${id}`, { withCredentials: true });
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
      const reviewRes = await api.get(`/vehicle/${id}/reviews`);
      setReviews(reviewRes.data.reviews);
    };

    fetchData();
  }, [id]);

  if (!vehicle) return <p>Loading...</p>;

  return (
    <div className="p-4 space-y-6">
      {/* Vehicle Details */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Vehicle Details</h2>
        <VehicleDetails vehicle={vehicle} />
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
          <ul className="space-y-3">
            {reviews.map((rev, index) => (
              <li key={index} className="border p-3 rounded-md">
                <p className="font-medium">{rev.userName}</p>
                <p className="text-sm italic text-gray-600">"{rev.comment}"</p>
                <p className="text-sm">Rating: {rev.rating} ⭐</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default VehicleLog;
