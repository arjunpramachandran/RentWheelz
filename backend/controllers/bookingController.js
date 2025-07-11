const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Vehicle = require('../models/Vehicle');
const mongoose = require('mongoose')
const createBooking = async (req, res) => {
    try {
        const userId = req.user.id;
        const { vehicleId } = req.params

        const {
            pickupLocation,
            pickupDateTime,
            dropoffDateTime,
            address,
            driverRequired,
            totalBill
        } = req.body;


        if (!vehicleId || !address || !pickupLocation || !pickupDateTime || !dropoffDateTime) {
            return res.status(400).json({ error: 'All required fields must be provided' });
        }


        const vehicle = await Vehicle.findById(vehicleId).populate('ownerId', 'name email phone');
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }


        const start = new Date(pickupDateTime);
        const end = new Date(dropoffDateTime);
        const timeDiff = end - start;

        if (timeDiff <= 0) {
            return res.status(400).json({ error: 'Invalid date range' });
        }


        const overlappingBooking = await Booking.findOne({
            vehicleId,
            $or: [
                {
                    pickupDateTime: { $lte: end },
                    dropoffDateTime: { $gte: start }
                }
            ],
            status: { $ne: 'cancelled' }
        });

        if (overlappingBooking) {
            return res.status(409).json({ error: 'Vehicle is already booked in the selected date range' });
        }

        const newBooking = new Booking({
            userId,
            vehicleId,
            pickupLocation,
            pickupDateTime: start,
            dropoffDateTime: end,
            driverRequired,
            address,
            totalBill,
            status: 'pending' // default
        });

        const savedBooking = await newBooking.save();
        vehicle.status = 'booked';
        await vehicle.save();

        res.status(201).json({
            message: 'Booking created successfully',
            booking: savedBooking,
            OwnerContact: {
                name: vehicle.ownerId.name,
                email: vehicle.ownerId.email,
                phone: vehicle.ownerId.phone
            },

            vehicle: {
                type: vehicle.type,
                brand: vehicle.brand,
                model: vehicle.model,
                year: vehicle.year,
                registrationNumber: vehicle.registrationNumber,

            }

        });

    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id)
            .populate('vehicleId')
            .populate('userId', 'name email phone');
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        res.status(200).json({ message: 'Booking retrieved successfully', booking });
    } catch (error) {
        console.error('Error retrieving booking:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getBooking = async (req, res) => {
    try {
        const userId = req.user.id;

        let bookings = await Booking.find({ userId }).populate(
            'vehicleId',
            'type brand model year registrationNumber'
        );

        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ message: 'No bookings found' });
        }

        const now = new Date();
        for (let booking of bookings) {
            if (
                booking.status === 'confirmed' &&
                new Date(booking.dropoffDateTime) < now
            ) {
                booking.status = 'completed';
                await booking.save();
            }
        }

        res.status(200).json({
            message: 'Bookings retrieved successfully',
            bookings,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// get booking by owner id
const getBookingByOwner = async (req, res) => {
    try {
        const ownerId = req.user.id;
        const vehicles = await Vehicle.find({ ownerId }).select('_id');
        const vehicleIds = vehicles.map(v => v._id);

        if (vehicleIds.length === 0) {
            return res.status(404).json({ message: "No vehicles found for this owner" });
        }


        const bookings = await Booking.find({ vehicleId: { $in: vehicleIds } })
            .populate('vehicleId')
            .populate('userId', 'name email phone');

        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ message: "No bookings found for this owner" });
        }

        const now = new Date();
        for (let booking of bookings) {
            if (
                booking.status === 'confirmed' &&
                new Date(booking.dropoffDateTime) < now
            ) {
                booking.status = 'completed';
                await booking.save();
            }
        }

        res.status(200).json({ message: "Bookings retrieved successfully", bookings });

    } catch (error) {
        console.error('Error retrieving bookings by owner:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getBookingByVehicleId = async (req, res) => {
    try {
        const { vehicleId } = req.params
        const bookings = await Booking.find({ vehicleId })
            .populate('userId', 'name email phone')

        if (!bookings) return res.status(404).json({ message: "No bookings found" })
        res.status(200).json({ message: "Bookings retrieved successfully", bookings })
    } catch (error) {
        console.error('Error retrieving bookings by owner:', error);
        res.status(500).json({ message: "Internal server error" });
    }

}
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('vehicleId').populate('userId', 'name email phone')
        if (!bookings) return res.status(404).json({ message: "No bookings found" })

        const now = new Date();
        for (let booking of bookings) {
            if (
                ['confirmed', 'pending'].includes(booking.status) &&
                new Date(booking.dropoffDateTime) < now
            ) {
                booking.status = 'completed';
                await booking.save();
            }
        }
        res.status(200).json({ message: "Bookings retrieved successfully", bookings })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" })

    }
}
const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, paymentId } = req.body;
        console.log(id, status, paymentId);

        if (!status || !['pending', 'confirmed', 'completed', 'cancelled'].includes(status) || !paymentId) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const updatedBooking = await Booking.findByIdAndUpdate(id, { status, paymentId }, { new: true });

        if (!updatedBooking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        const updatedPayment = await Payment.findOneAndUpdate(
            { bookingId: id },
            {
                transactionId: paymentId,
                status: status === 'cancelled' ? 'failed' : 'success'
            },
            { new: true }
        );

        if (!updatedPayment) {
            return res.status(404).json({ error: 'Payment record not found for booking' });
        }

        res.status(200).json({
            message: 'Booking and Payment status updated successfully',
            booking: updatedBooking,
            payment: updatedPayment,
        });

    } catch (error) {
        console.error('Error updating booking status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params
        const canceledBooking = await Booking.findByIdAndUpdate(id, { status: 'cancelled' }, { new: true })
        if (!canceledBooking) return res.status(404).json({ error: 'Booking not found' });

        res.status(200).json({ message: 'Booking Cancelled Successfully', cancelled: canceledBooking })
    } catch (error) {
        console.error('Error updating booking status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedBooking = await Booking.findByIdAndDelete(id);
        if (!deletedBooking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        res.status(200).json({ message: 'Booking Deleted successfully' });
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


module.exports = { createBooking, getBooking, getAllBookings, updateBookingStatus, cancelBooking, deleteBooking, getBookingByVehicleId, getBookingByOwner, getBookingById };