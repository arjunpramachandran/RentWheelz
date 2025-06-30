import { CalendarDays, MapPin, Clock } from 'lucide-react'; // Use lucide icons
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { savedBooking } from '../../app/features/user/bookingSlice';

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
    <div className="bg-white/30 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-cyan-100 max-w-6xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
        Book Your Ride
      </h2>

      <form onSubmit={handleGo} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="relative">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Pickup Location
          </label>
          <div className="flex items-center border rounded-lg shadow-sm p-2 bg-white">
            <MapPin className="text-cyan-500 mr-2" />
            <input
              type="text"
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleChange}
              placeholder="Enter pickup location"
              required
              className="w-full outline-none bg-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Pickup Date & Time
          </label>
          <div className="flex items-center border rounded-lg shadow-sm p-2 bg-white">
            <CalendarDays className="text-cyan-500 mr-2" />
            <input
              type="datetime-local"
              name="pickupDateTime"
              value={formData.pickupDateTime}
              onChange={handleChange}
              min={minDateTime}
              required
              className="w-full outline-none bg-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Dropoff Date & Time
          </label>
          <div className="flex items-center border rounded-lg shadow-sm p-2 bg-white">
            <CalendarDays className="text-cyan-500 mr-2" />
            <input
              type="datetime-local"
              name="dropoffDateTime"
              value={formData.dropoffDateTime}
              onChange={handleChange}
              min={formData.pickupDateTime || minDateTime}
              required
              className="w-full outline-none bg-transparent"
            />
          </div>
        </div>

        <div className="col-span-full flex justify-center mt-4">
          <button
            type="submit"
            className="px-8 py-3 text-white font-semibold rounded-full shadow-lg transition duration-300 custom-gradient hover:brightness-110 active:scale-95"
          >
            Go
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserDashboard;
