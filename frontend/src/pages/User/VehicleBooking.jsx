import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../../config/axiosinstance'
import VehicleDetails from '../../components/VehicleDetails';
import { useSelector } from 'react-redux';
import DriveModeToggle from '../../components/DriveModeToggle';
import Loader from '../../components/Loader';
import { loadStripe } from '@stripe/stripe-js';
import { FaSmile, FaSadTear } from "react-icons/fa";

import ModalDialog from '../../components/Modal';
import BookingReviewModal from '@/components/BookingReviewModal';
import { set } from 'date-fns';
import React from 'react';

const VehicleBooking = () => {
    const { id } = useParams();
    const [vehicle, setVehicle] = useState(null);
    const [isDriverRequired, setIsDriverRequired] = useState(false)
    const [totalDays, setTotalDays] = useState(0)
    const [baseCost, setBaseCost] = useState(0)
    const [driverCost, setDriverCost] = useState(0)
    const [totalCost, setTotalCost] = useState(0)
    const [booking, setBooking] = useState();
    const [showPaymentReview, setShowPaymentReview] = useState(false);
    
    const [bookingReviewData, setBookingReviewData] = useState({
      pickupLocation: '',
      pickupDateTime: '',
      dropoffDateTime: '',
      address: '',
      totalBill: 0,
      driverRequired: false,
      totalDays: 0,
      baseCost: 0,
      driverCost: 0,
      vehicle: null
    });

    const navigate = useNavigate()

    const stripePromise = loadStripe('pk_test_51Rd55i2NeI36BbPqkUzEND68uVDaH7zsInoYzLSKK4hqXlBRiaX81skoJ0zPvy4v9ih0iZT0g7wlDGjrVVzNBFrC00J2ghPyYa');

    const calculateTotalCost = () => {
        if (!vehicle) return;
        const { pickupDateTime, dropoffDateTime } = formData;
        const start = new Date(pickupDateTime);
        const end = new Date(dropoffDateTime);

        if (!pickupDateTime || !dropoffDateTime || end <= start) {
            return setTotalCost(0);
        }


        const durationInDaysF = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        const baseCostF = durationInDaysF * vehicle.pricePerDay;
        const driverCostF = isDriverRequired ? durationInDaysF * (vehicle.rateOfDriver || 0) : 0;
        setTotalDays(durationInDaysF)
        setBaseCost(baseCostF)
        setDriverCost(driverCostF)
        setTotalCost(baseCostF + driverCostF)
    }





    const handleToggle = () => {
        setIsDriverRequired((prev) => !prev);

    };


    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const res = await api.get(`user/getVehicle/${id}`);
                setVehicle(res?.data?.vehicle)



            } catch (err) {
                console.error('Failed to load vehicle:', err);
            }
        };

        fetchVehicle();
    }, [id]);




    const bookingData = useSelector((state) => state.booking.bookingData);

    const [formData, setFormData] = useState({
        vehicleId: id,
        pickupLocation: bookingData.pickupLocation,
        pickupDateTime: bookingData.pickupDateTime,
        dropoffDateTime: bookingData.dropoffDateTime,
        address: '',
        driverRequired: false,
        totalBill: 0
    })
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setBookingReviewData({
            pickupLocation: formData.pickupLocation,
            pickupDateTime: formData.pickupDateTime,
            dropoffDateTime: formData.dropoffDateTime,
            address: formData.address,
            totalBill: totalCost,
            driverRequired: formData.driverRequired,
            totalDays,
            baseCost,
            driverCost,
            vehicle
        });

        setShowPaymentReview(true);

    }
    const handlePaymentAndBooking = async () => {
     
        try {
            formData.driverRequired = isDriverRequired;
            formData.totalBill = totalCost
            const res = await api.post(`/user/createBooking/${id}`, formData, {
                withCredentials: true
            })

            const bookid = res.data?.booking?._id;



            if (!bookid) {
                throw new Error('Booking ID not found in response');
            }

            setBooking(res.data?.booking);
           


            const checkoutData = {
                vehicleId: id,
                vehicleBrand: vehicle.brand,
                vehicleModel: vehicle.model,
                pickupDateTime: bookingData.pickupDateTime,
                dropoffDateTime: bookingData.dropoffDateTime,
                totalBill: totalCost,
                bookingId: bookid
            }
            console.log(checkoutData);

            const response = await api.post('user/create-checkout-session', checkoutData, { withCredentials: true });
            const stripe = await stripePromise;
            await stripe.redirectToCheckout({ sessionId: response.data.id });




        } catch (error) {
            console.error('Payment Error:', error?.response?.data || error.message);
            alert(error?.response?.data?.error || 'Failed to process payment');

        }
    }
    // const addPayment = async (paymentData) => {
    //     try {
    //         const res = await api.post('/user/addPayment', paymentData, { withCredentials: true });
    //         return res.data;
    //     } catch (error) {
    //         console.error('Error adding payment:', error?.response?.data || error.message);
    //         throw error;
    //     }
    // };

    const getCurrentDateTime = () => {
        const now = new Date();
        const offset = now.getTimezoneOffset();
        const localDate = new Date(now.getTime() - offset * 60000);
        return localDate.toISOString().slice(0, 16);
    };

    const minDateTime = getCurrentDateTime();


    useEffect(() => {
        if (vehicle) {
            calculateTotalCost()
        }

    }, [formData.pickupDateTime, formData.dropoffDateTime, isDriverRequired, vehicle]);

    const location = useLocation();
    const query = new URLSearchParams(window.location.search);
    const isSuccess = query.get('success');
    const isCanceled = query.get('canceled');
    const sessionId = query.get('session_id');

    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', description: '' });

    const updateBooking = async (status, paymentId) => {
        const query = new URLSearchParams(window.location.search);
        let bookingId = query.get('bookingId')
        if (!bookingId) return console.warn("No bookingId to update");
        try {
            const res = await api.patch(`/user/updateBookingStatus/${bookingId}`, { status, paymentId }, {
                withCredentials: true
            })


        } catch (error) {
            console.error('Error updating booking:', error?.response?.data || error.message);
        }
    }
    useEffect(() => {



        const fetchSession = async () => {
            if (!sessionId) return;

            try {
                const res = await api.get(`/user/retrieve-checkout-session/${sessionId}`, {
                    withCredentials: true,
                });
                console.log(res);

                const paymentId = res.data?.payment_intent;
                if ((isSuccess || isCanceled)) {

                    await updateBooking(isSuccess ? 'confirmed' : 'cancelled', paymentId)
                    setModalContent({
                        title: `Booking Confirmed `,
                        description: 'Your booking was successful. Redirecting to Dashboard...',

                    });
                    // const paymentData = {
                    //     bookingId: booking?._id ,
                    //     userId: booking?.userId,
                    //     hostId: booking?.hostId,
                    //     amount: res.data?.amount_total / 100, // Convert to rupees
                    //     paymentMethod: 'card',
                    //     status: isSuccess ? 'success' : 'failed',
                    //     transactionId: paymentId
                    // };
                    // await addPayment(paymentData);
                    setShowModal(true);
                } else if (isCanceled) {
                    setModalContent({
                        title: `Payment Failed `,
                        description: 'Payment was cancelled or failed. Please try again.',
                    });
                    setShowModal(true);
                    localStorage.removeItem("latestBookingId")
                }
            } catch (error) {
                console.error("Failed to retrieve Stripe session:", err);
            }
        }
        fetchSession()
    }, [sessionId, isSuccess]);

    if (!vehicle) return <Loader />

    return (
        <div className='flex flex-col gap-6 p-4  mx-auto'>
            <div>
                <VehicleDetails vehicle={vehicle} />
            </div>

            <div>
                <div className="relative max-w-6xl mx-auto mt-8 p-4 md:p-6 bg-white shadow-lg rounded-2xl">

                    <form onSubmit={handleSubmit}

                        className=""
                    >
                        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
                            {/* Pickup Location */}
                            <div className="flex flex-col ">
                                <label className="text-sm font-medium text-gray-700 mb-1">
                                    Pickup Location
                                </label>
                                <input
                                    type="text"
                                    name="pickupLocation"
                                    value={formData.pickupLocation}
                                    onChange={handleChange}
                                    required

                                    className="p-2  border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                                    placeholder={formData?.pickupLocation ? formData.pickupLocation : 'Enter pickup location'}
                                />
                            </div>



                            {/* Pickup DateTime */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">
                                    Pickup Date & Time
                                </label>
                                <input
                                    type="datetime-local"
                                    name="pickupDateTime"
                                    value={formData.pickupDateTime}
                                    onChange={handleChange}
                                    min={minDateTime}
                                    required
                                    className="p-2 border  border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                                />
                            </div>

                            {/* Dropoff DateTime */}
                            <div className="flex flex-col ">
                                <label className="text-sm font-medium text-gray-700 mb-1">
                                    Dropoff Date & Time
                                </label>
                                <input
                                    type="datetime-local"
                                    name="dropoffDateTime"
                                    value={formData.dropoffDateTime}
                                    onChange={handleChange}
                                    min={formData.pickupDateTime || minDateTime}
                                    required
                                    className="p-2   border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="mt-4 md:w-1/2 sm:w-full">
                            <label className="text-sm font-medium text-gray-700 mb-1">Full Address</label>
                            <textarea
                                name="address"
                                rows="3"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                                placeholder="House number, street, locality, landmark"
                            />
                        </div>




                        {vehicle?.driverAvailable && (
                            <div className="p-4 md:w-1/2 sm:w-full">
                                <DriveModeToggle isDriverRequired={isDriverRequired} onToggle={handleToggle} />
                            </div>
                        )}
                        <br /> <div className=''>
                            <div className=" flex  flex-col gap-1 text-right border-t-1 border-dashed  text-gray-800">
                                <div>Total Trip Days: {totalDays}</div>
                                <div>Vehicle Rent: {vehicle.pricePerDay} * {totalDays} = {baseCost}</div>
                                {isDriverRequired && (<div className='border-b-1'>Driver Rent: {vehicle.rateOfDriver} * {totalDays} = {driverCost}</div>)}
                                <div className='text-lg font-semibold'>Total Payment: ₹{totalCost}</div>

                            </div>
                        </div>


                        <div className="col-span-full">
                            <button
                                type="submit"
                                className="w-full mt-3 bg-cyan-600 text-white py-3 p-2 rounded-lg hover:bg-cyan-700 transition font-medium text-center"
                            >
                                Continue to Payment
                            </button>
                        </div>
                    </form>
                    {showModal && (
                        <ModalDialog
                            title={modalContent.title}
                            description={modalContent.description}
                            onClose={() => {
                                setShowModal(false);
                                if (isSuccess) {
                                    navigate('/user/userDashboard')
                                }
                                else if (isCanceled) {
                                    navigate(`/user/vehicleBooking/${id}`)
                                }
                            }}
                        />
                    )}


                    {/* payment review modal */}

                    {showPaymentReview && (
                        <BookingReviewModal
                            booking={bookingReviewData}
                            onConfirm={() => {
                                handlePaymentAndBooking();
                                setShowPaymentReview(false);
                            }}
                            onCancel={() => setShowPaymentReview(false)}
                        />
                    )}
                </div>

            </div>
        </div>
    );
};

export default VehicleBooking;
