import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { savedBooking } from '../../app/features/user/bookingSlice';
import Vehicles from '../Vehicles';

const UserBooking = () => {
  const bookingData = useSelector((state) => state.booking.bookingData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(bookingData || {});

  // Get current time for minimum dateTime
  const getCurrentDateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16);
  };

  const minDateTime = getCurrentDateTime();

  // Update Redux when formData changes
  useEffect(() => {
    dispatch(savedBooking(formData));
  }, [formData, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="px-4 py-6 max-w-6xl mx-auto">
      {/* Booking Form */}
      <div className="bg-white dark:bg-gray-800 border border-cyan-300 shadow-xl rounded-2xl p-6 mb-8">
        <form className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Pickup Location */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
              Pickup Location
            </label>
            <input
              type="text"
              name="pickupLocation"
              value={formData.pickupLocation || ''}
              onChange={handleChange}
              placeholder="Enter pickup location"
              required
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Pickup Date & Time */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
              Pickup Date & Time
            </label>
            <input
              type="datetime-local"
              name="pickupDateTime"
              value={formData.pickupDateTime || ''}
              onChange={handleChange}
              min={minDateTime}
              required
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Dropoff Date & Time */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
              Dropoff Date & Time
            </label>
            <input
              type="datetime-local"
              name="dropoffDateTime"
              value={formData.dropoffDateTime || ''}
              onChange={handleChange}
              min={formData.pickupDateTime || minDateTime}
              required
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </form>
      </div>

      {/* Vehicle List */}
      <Vehicles />
    </div>
  );
};

export default UserBooking;
