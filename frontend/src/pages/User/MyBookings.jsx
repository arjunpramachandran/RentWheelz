import { useEffect, useState } from 'react';
import { api } from '../../config/axiosinstance';
import Loader from '../../components/Loader';
import { useParams } from 'react-router-dom';
import BookingCard from '../../components/user/BookingCard';


const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');


  const fetchBookings = async () => {
    try {
      const res = await api.get('/user/getBooking', { withCredentials: true });
      setBookings(res.data.bookings);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const openReviewModal = (vehicleId) => {
    setSelectedVehicleId(vehicleId);
    setShowReviewModal(true);
    setRating(0);
    setComment('');
  };
const handleSubmitReview = async () => {
  try {
    if (!rating || !comment) {
      alert("Please provide rating and comment.");
      return;
    }

    await api.post(`/user/review/${selectedVehicleId}`, {
      rating,
      comment
    });

    setShowReviewModal(false);
    alert("Review submitted successfully.");
    // Optionally refresh bookings/reviews
  } catch (error) {
    console.error("Failed to submit review:", error);
    alert(error.response?.data?.error || "Error submitting review");
  }
};

  useEffect(() => {
    fetchBookings();
  }, []);
  const confirmed = bookings.filter(b => b.status === "confirmed");
  const completed = bookings.filter(b => b.status === "completed");
  const cancelled = bookings.filter(b => b.status === "cancelled");
  const pending = bookings.filter(b => b.status === "pending");


  if (loading) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center text-gray-500">You have no bookings yet.</div>
      ) : (
        <div className="space-y-10">

          {/* Confirmed Bookings */}
          {confirmed.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-green-700 mb-4">Upcoming Rides</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {confirmed.map((booking) => <BookingCard key={booking._id} booking={booking} />)}
              </div>
            </div>
          )}

          {/* Completed Bookings */}
          {completed.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-blue-700 mb-4">Completed Rides</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {completed.map((booking) => <BookingCard key={booking._id} booking={booking} openReviewModal={openReviewModal} />)}
              </div>
            </div>
          )}

          {/* Cancelled Bookings */}
          {cancelled.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-red-700 mb-4">Cancelled Rides</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cancelled.map((booking) => <BookingCard key={booking._id} booking={booking} />)}
              </div>
            </div>
          )}

          {/* pending Booking */}
          {pending.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-yellow-800 mb-4">Pending Rides</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pending.map((booking) => <BookingCard key={booking._id} booking={booking} />)}
              </div>
            </div>
          )}
        </div>
      )}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Leave a Review</h2>

            {/* Rating */}
            <div className="flex items-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
                >
                  ★
                </button>
              ))}
            </div>

            {/* Comment */}
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your feedback..."
              className="w-full border p-2 rounded mb-4 h-24 resize-none"
            />

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowReviewModal(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>

  );
};



export default MyBookings;
