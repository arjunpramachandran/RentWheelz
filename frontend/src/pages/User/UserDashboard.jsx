import { CalendarDays, MapPin } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { savedBooking } from '../../app/features/user/bookingSlice';
import Memberships from './Memberships';
import UserCoupons from './UserCoupens';

const UserDashboard = () => {
  const bookingData = useSelector((state) => state.booking.bookingData);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(bookingData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16);
  };

  const minDateTime = getCurrentDateTime();

  const handleGo = (e) => {
    e.preventDefault();
    dispatch(savedBooking(formData));
    navigate('/user/userBooking');
  };

  return (
    <div className="p-4 dark:bg-gray-900 min-h-screen">
      <div className="bg-white/30 dark:bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-cyan-100 max-w-6xl mx-auto mt-10">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
          Book Your Ride
        </h2>

        <form onSubmit={handleGo} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Pickup Location */}
          <div className="relative">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
              Pickup Location
            </label>
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm p-2 bg-white dark:bg-gray-800">
              <MapPin className="text-cyan-500 mr-2" />
              <input
                type="text"
                name="pickupLocation"
                value={formData.pickupLocation}
                onChange={handleChange}
                placeholder="Enter pickup location"
                required
                className="w-full outline-none bg-transparent text-gray-800 dark:text-white placeholder-gray-400"
              />
            </div>
          </div>

          {/* Pickup Date & Time */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
              Pickup Date & Time
            </label>
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm p-2 bg-white dark:bg-gray-800">
              <CalendarDays className="text-cyan-500 mr-2" />
              <input
                type="datetime-local"
                name="pickupDateTime"
                value={formData.pickupDateTime}
                onChange={handleChange}
                min={minDateTime}
                required
                className="w-full outline-none bg-transparent text-gray-800 dark:text-white"
              />
            </div>
          </div>

          {/* Dropoff Date & Time */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
              Dropoff Date & Time
            </label>
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm p-2 bg-white dark:bg-gray-800">
              <CalendarDays className="text-cyan-500 mr-2" />
              <input
                type="datetime-local"
                name="dropoffDateTime"
                value={formData.dropoffDateTime}
                onChange={handleChange}
                min={formData.pickupDateTime || minDateTime}
                required
                className="w-full outline-none bg-transparent text-gray-800 dark:text-white"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="col-span-full flex justify-center mt-6">
            <button
              type="submit"
              className="px-8 py-3 text-white font-semibold rounded-full shadow-lg transition duration-300 bg-gradient-to-r from-cyan-600 to-green-500 hover:brightness-110 active:scale-95"
            >
              Go
            </button>
          </div>
        </form>
      </div>

      <div className="max-w-6xl mx-auto mt-10">
        <Memberships />
        <UserCoupons />
      </div>
    </div>
  );
};

export default UserDashboard;
