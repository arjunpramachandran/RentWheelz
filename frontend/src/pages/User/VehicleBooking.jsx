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


const VehicleBooking = () => {
    const { id } = useParams();
    const [vehicle, setVehicle] = useState(null);
    const [isDriverRequired, setIsDriverRequired] = useState(false)
    const [totalDays, setTotalDays] = useState(0)
    const [baseCost, setBaseCost] = useState(0)
    const [driverCost, setDriverCost] = useState(0)
    const [totalCost, setTotalCost] = useState(0)


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
    console.log(bookingData);
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
        try {
            e.preventDefault();
            formData.driverRequired = isDriverRequired;
            formData.totalBill = totalCost
            

            const res = await api.post(`/user/createBooking/${id}`, formData, {
                withCredentials: true
            })
            if (res) {
                try {
                    const response = await api.post('user/create-checkout-session', formData, { withCredentials: true });
                    const stripe = await stripePromise;
                    await stripe.redirectToCheckout({ sessionId: response.data.id });


                } catch (error) {
                    console.error('Stripe Error:', error);
                    alert('Failed to initiate payment');
                }
            }

        } catch (error) {
            console.log('Vehicle Booking Error:', error?.response?.data || error.message);
            alert(error?.response?.data?.error || 'Failed to Booking Vehicle');
        }


    }
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
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', description: '' });

    useEffect(() => {
        if (isSuccess) {
            setModalContent({
                title: `Booking Confirmed `,
                description: 'Your booking was successful. Redirecting to Dashboard...',
                
            });
            setShowModal(true);
        } else if (isCanceled) {
            setModalContent({
                title: `Payment Failed `,
                description: 'Payment was cancelled or failed. Please try again.',
            });
            setShowModal(true);
        }
    }, []);
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
                                if(isSuccess) {
                                    navigate('/user/userDashboard')
                                }
                                else if(isCanceled) {
                                    navigate(`/user/vehicleBooking/${id}`)
                                }
                            }}
                        />
                    )}

                </div>

            </div>
        </div>
    );
};

export default VehicleBooking;
