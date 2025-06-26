import React, { useEffect, useState } from 'react'
import { api } from '../config/axiosinstance'
import VehicleCard from '../components/VehicleCard'

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([])
  const [filteredVehicles, setFilteredVehicles] = useState([])
  const [filters, setFilters] = useState({
    type: '',
    fuel: '',
    transmission: ''
  })

  const fetchData = async () => {
    try {
      const response = await api({ method: "GET", url: '/user/getAllVehicles' })
      const allVehicles = response?.data?.vehicles || []
      setVehicles(allVehicles)
      setFilteredVehicles(allVehicles)
    } catch (error) {
      console.error('Error fetching vehicles:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    let filtered = vehicles

    if (filters.type) {
      filtered = filtered.filter(v => v.type === filters.type)
    }
    if (filters.fuel) {
      filtered = filtered.filter(v => v.fuel === filters.fuel)
    }
    if (filters.transmission) {
      filtered = filtered.filter(v => v.transmission === filters.transmission)
    }

    setFilteredVehicles(filtered)
  }, [filters, vehicles])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleReset = () => {
    setFilters({ type: '', fuel: '', transmission: '' })
  }

  return (
    <div className='p-4'>
      <h1 className='text-3xl font-bold text-center mb-6'>Available Vehicles</h1>

      {/* Filter Section */}
      <div className='flex flex-wrap gap-4 justify-center mb-6'>
        <select name="type" value={filters.type} onChange={handleChange} className="border p-2 rounded">
          <option value="">All Categories</option>
          <option value="car">Car</option>
          <option value="bike">Bike</option>
        </select>

        <select name="fuel" value={filters.fuel} onChange={handleChange} className="border p-2 rounded">
          <option value="">All Fuel Types</option>
          <option value="petrol">Petrol</option>
          <option value="diesel">Diesel</option>
          <option value="electric">Electric</option>
        </select>

        <select name="transmission" value={filters.transmission} onChange={handleChange} className="border p-2 rounded">
          <option value="">All Transmissions</option>
          <option value="manual">Manual</option>
          <option value="automatic">Automatic</option>
        </select>

        <button onClick={handleReset} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Reset Filters
        </button>
      </div>

      {/* Vehicle Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2  xl:grid-cols-3   gap-4'>
        {filteredVehicles.length > 0 ? (
          filteredVehicles.map(vehicle => (
            <VehicleCard key={vehicle._id} vehicle={vehicle} />
          ))
        ) : (
          <p className='text-center col-span-full text-gray-500'>No vehicles found for selected filters.</p>
        )}
      </div>
    </div>
  )
}

export default Vehicles
