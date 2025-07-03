import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Booking from './models/Booking.js';
import Payment from './models/Payment.js';
import Vehicle from './models/Vehicle.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const seedPayments = async () => {
  try {
    const bookings = await Booking.find({
      status: { $in: ['confirmed', 'completed'] }
    }).populate('vehicleId');
    console.log(bookings);
    
    let createdCount = 0;

    for (const booking of bookings) {
      const existingPayment = await Payment.findOne({ bookingId: booking._id });
      const hostId = booking.vehicleId?.ownerId;

      if (!existingPayment && hostId) {
        const payment = new Payment({
          bookingId: booking._id,
          userId: booking.userId,
          hostId: hostId,
          amount: booking.totalBill,
          paymentMethod: 'card',
          status: 'success',
          transactionId: booking.paymentId
        });

        await payment.save();
        createdCount++;
      }
    }

    console.log(`✅ Seed complete. ${createdCount} payment(s) added.`);
  } catch (err) {
    console.error('❌ Error seeding payments:', err);
  } finally {
    mongoose.connection.close();
  }
};

seedPayments();
