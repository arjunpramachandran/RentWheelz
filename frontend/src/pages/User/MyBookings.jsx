import { useEffect, useState } from 'react';
import { api } from '../../config/axiosinstance';
import Loader from '../../components/Loader';
import { useParams } from 'react-router-dom';


const MyBookings = (req,res) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/user/getBooking', { withCredentials: true });
      setBookings(res.data.booking);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Bookings</h1>
      {bookings.length === 0 ? (
        <div className="text-center text-gray-500">You have no bookings yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-xl shadow p-5 flex flex-col gap-2 border border-gray-100 hover:shadow-lg transition">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Booking Status:</span>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(booking.status)}`}>
                  {booking.status.toUpperCase()}
                </span>
              </div>

              <div className="text-gray-800 font-semibold text-lg">
                {booking.vehicleId.brand} {booking.vehicleId.model} ({booking.vehicleId.year})
              </div>

              <div className="text-sm text-gray-500">Type: {booking.vehicleId.type}</div>
              <div className="text-sm text-gray-500">Reg #: {booking.vehicleId.registrationNumber}</div>

              <div className="mt-2 text-sm">
                <strong>Pickup:</strong> {formatDateTime(booking.pickupDateTime)}<br />
                <strong>Dropoff:</strong> {formatDateTime(booking.dropoffDateTime)}
              </div>

              <div className="text-sm mt-2 text-gray-600">
                <strong>Pickup Location:</strong> {booking.pickupLocation}<br />
                <strong>Address:</strong> {booking.address}
              </div>

              <div className="flex justify-between items-center mt-4">
                <div className="text-base font-bold text-cyan-700">₹{booking.totalBill}</div>
                {booking.driverRequired && (
                  <div className="text-sm text-green-600 font-medium">With Driver</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const formatDateTime = (datetime) => {
  const date = new Date(datetime);
  return date.toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'confirmed':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

export default MyBookings;
