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
}

const formatDateTime = (datetime) => {
    const date = new Date(datetime);
    return date.toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
};
const cancelBooking = async (bookingid) => {

    try {
        const response = await api.patch(`/user/cancelMyBooking/${bookingid}`, { withCredentials: true });
        console.log(response);
        fetchBookings()

    } catch (error) {
        console.error('Failed to load bookings:', error);
    } finally {
        setLoading(false);
    }
}
const BookingCard = ({ booking ,openReviewModal}) => (

    <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-2 border border-gray-100 hover:shadow-lg transition">
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

        <div className="text-center mt-3 space-x-2">
            {(booking.status !== 'completed' && booking.status!=='cancelled') && (
                <button onClick={() => cancelBooking(booking._id)} className="btn bg-red-500 text-white">
                    Cancel Booking
                </button>
            )}

            {openReviewModal && booking.status === 'completed'  && (
                <button onClick={() => openReviewModal(booking.vehicleId)} className="btn bg-yellow-500 text-white">
                    Leave a Review
                </button>
            )}
        </div>

    </div>
)


export default BookingCard