import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
import { savedBooking } from '../../app/features/user/bookingSlice';
import Vehicles from '../Vehicles';

const UserBooking = () => {
  const bookingData = useSelector((state) => state.booking.bookingData);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  console.log(bookingData);

  const [formData, setFormData] = useState(bookingData)

  
  // const [vehicles, setVehicles] = useState([])
  // const [filteredVehicles, setFilteredVehicles] = useState([])
  // const [filters, setFilters] = useState({
  //   type: '',
  //   fuel: '',
  //   transmission: ''
  // })

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
  useEffect(()=>{
     dispatch(savedBooking(formData));
  },[]);
  

  return (
    <>

      <div className="  border-double border-2   z-10  shadow-2xl relative border-cyan-300 p-4 rounded-2xl ">
        <form  className=' grid grid-cols-1  md:grid-cols-2 xl:grid-cols-3 items-center   gap-4' >
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

        </form>

      </div>
    <Vehicles/>


    </>

  );
};

export default UserBooking;
