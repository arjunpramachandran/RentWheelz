import React from 'react';
import { format } from 'date-fns';

const BookingReviewModal = ({ booking, onConfirm, onCancel }) => {
  const {
    pickupLocation,
    pickupDateTime,
    dropoffDateTime,
    address,
    totalBill,
    driverRequired,
    totalDays,
    baseCost,
    driverCost,
    vehicle
  } = booking;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-xl w-full p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">Review Your Booking</h2>

        <div className="grid gap-2 text-gray-700 text-sm">
          <p><strong>Vehicle:</strong> {vehicle?.brand} {vehicle?.model}</p>
          <p><strong>Pickup Location:</strong> {pickupLocation}</p>
          <p><strong>Pickup Date:</strong> {format(new Date(pickupDateTime), 'PPpp')}</p>
          <p><strong>Dropoff Date:</strong> {format(new Date(dropoffDateTime), 'PPpp')}</p>
          <p><strong>Address:</strong> {address}</p>
          <p><strong>Trip Duration:</strong> {totalDays} day(s)</p>
          <p><strong>Vehicle Rent:</strong> ₹{vehicle?.pricePerDay} × {totalDays} = ₹{baseCost}</p>
          {driverRequired && (
            <p><strong>Driver Rent:</strong> ₹{vehicle?.rateOfDriver} × {totalDays} = ₹{driverCost}</p>
          )}
          <p className="font-semibold text-lg text-gray-900 mt-2">Total: ₹{totalBill}</p>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            Confirm & Pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingReviewModal;
