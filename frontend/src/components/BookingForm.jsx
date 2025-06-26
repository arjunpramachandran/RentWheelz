import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { savedBooking } from '../app/features/user/bookingSlice'


const BookingForm = () => {
  const { userData, isLoggedIn } = useSelector((state) => state.user)
  console.log(userData, isLoggedIn);
  const [error, setError] = useState()

  const navigate = useNavigate()

  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    pickupDateTime: '',
    dropoffDateTime: ''
  })
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
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
    e.preventDefault()

    if (!isLoggedIn) {

      navigate('/login')
      return
    }
    else if (userData.role !== "customer") {
      setError(`Booking Permitted to Only for Customers `)
      document.getElementById('my_modal_1').showModal()
      return
    }
    dispatch(savedBooking(formData));

    navigate('/user/userDashboard')
  };
  return (
    <div>

      <div className="  bg-gradient-to-r from-cyan-500 to-green-400 border-double border-2   z-10  shadow-2xl relative border-cyan-300 p-4 rounded-2xl ">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">Book Your Ride</h2>
        <form onSubmit={handleGo} className=' grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 items-center   gap-4' >
          <div className='w-64' >
            <label className=" block text-sm font-medium text-gray-700 mb-2">
              Pickup Location
            </label>
            <input
              type="text"
              className=" w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder={formData.pickupLocation ? formData.pickupLocation : "Enter pickup location"}
              name="pickupLocation"
              value={formData.pickupLocation}
              required
              onChange={handleChange}
            />
          </div>
        
          <div className='w-64'>
            <label className=" block text-sm font-medium pt-2 text-gray-700 mb-1">
              Pickup Date and Time
            </label>
            <input type="datetime-local" className="w-full input"
              name="pickupDateTime"
              placeholder={formData.pickupDateTime ? formData.pickupDateTime : ''}
              value={formData.pickupDateTime}
              required
              onChange={handleChange}
              min={minDateTime}

            />
          </div>
          <div className='w-64'>
            <label className="block text-sm font-medium text-gray-700 mb-1 pt-2">
              Dropoff Date and Time
            </label>
            <input type="datetime-local" className="input"
              name="dropoffDateTime"
              value={formData.dropoffDateTime}
              onChange={handleChange}
              min={formData.pickupDateTime || minDateTime}
              required
            />
          </div>
          <div className="col-span-full flex justify-center mt-4 "  >
            <button type='submit' className="btn btn-circle border-2 bg-accent text-lg w-16 h-16 p-4 hover:bg-cyan-500 hover:text-white transition-colors duration-300">
              GO
            </button>


          </div>
        </form>
        <dialog id="my_modal_1" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Hello! {userData?.role?.toUpperCase()}</h3>
            <p className="py-4">{error}</p>
            <div className="modal-action">
              <form method="dialog">

                <button className="btn">Ok</button>
              </form>
            </div>
          </div>
        </dialog>
      </div>



    </div>
  )
}

export default BookingForm