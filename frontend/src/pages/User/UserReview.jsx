import { useEffect, useState } from 'react';
import { api } from '../../config/axiosinstance';
import Loader from '../../components/Loader';

const UserReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserReviews = async () => {
    try {
      const res = await api.get('/user/myReviews', { withCredentials: true });
      console.log(res);
      
      setReviews(res.data.reviews);
    } catch (error) {
      console.error('Failed to fetch user reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserReviews();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Reviews</h1>

      {reviews.length === 0 ? (
        <div className="text-gray-500 text-center">You haven't submitted any reviews yet.</div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review._id} className="border rounded-lg p-5 shadow-sm bg-white">
              <div className="flex justify-between items-center mb-2">
                <div className="text-gray-800 font-medium">
                  {review.vehicleId?.brand} {review.vehicleId?.model} ({review.vehicleId?.year})
                </div>
                <div className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleString()}</div>
              </div>

              <div className="flex items-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={`text-xl ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                    ★
                  </span>
                ))}
              </div>

              <div className="text-gray-700">{review.comment}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserReviews;
