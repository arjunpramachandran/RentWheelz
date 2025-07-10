import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../config/axiosinstance';
import { Switch } from '@headlessui/react';
import {
  FaCar, FaHotel, FaCogs, FaGasPump, FaMoneyBillWave,
  FaCalendarAlt, FaMapMarker, FaUserTie
} from 'react-icons/fa';

const VehicleUpdate = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [formData, setFormData] = useState({});
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await api.get(`/user/getVehicle/${id}`);
        setVehicle(res.data.vehicle);
        setFormData(res.data.vehicle);
        setPreview(res.data.vehicle.images || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchVehicle();
  }, [id]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreview(files.map(file => URL.createObjectURL(file)));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle = () => {
    setFormData(prev => ({
      ...prev,
      driverAvailable: !prev.driverAvailable
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        data.append(key, value);
      }
    });
    images.forEach(img => data.append('images', img));

    try {
      await api.patch(`/host/updateVehicle/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/host/dashboard');
    } catch (err) {
      console.error(err);
      alert('Update failed');
    }
  };

  if (!vehicle) return <div className="text-center py-10 text-gray-700 dark:text-gray-200">Loading...</div>;

  return (
    <div className="relative max-w-5xl mx-auto p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-xl rounded-2xl mt-6 transition-colors duration-300">
      <h2 className="text-2xl font-bold mb-6">Update Vehicle</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
        <div className="relative flex items-center">
          <FaHotel className="absolute left-3 text-gray-400" />
          <input
            type="text"
            name="brand"
            value={formData.brand || ''}
            onChange={handleChange}
            placeholder="Brand"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        
        <div className="relative">
          <FaCar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="model"
            value={formData.model || ''}
            onChange={handleChange}
            placeholder="Model"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        
        <div className="relative">
          <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="number"
            name="year"
            value={formData.year || ''}
            onChange={handleChange}
            placeholder="Year"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

       
        <div className="relative">
          <FaGasPump className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            name="fuel"
            value={formData.fuel || ''}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="">Select Fuel Type</option>
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
            <option value="electric">Electric</option>
          </select>
        </div>

     
        <div className="relative">
          <FaCogs className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            name="transmission"
            value={formData.transmission || ''}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="">Select Transmission</option>
            <option value="manual">Manual</option>
            <option value="automatic">Automatic</option>
          </select>
        </div>

       
        <div className="relative">
          <FaMoneyBillWave className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="number"
            name="pricePerDay"
            value={formData.pricePerDay || ''}
            onChange={handleChange}
            placeholder="Price Per Day (₹)"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        
        <div className="relative">
          <FaMapMarker className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="location"
            value={formData.location || ''}
            onChange={handleChange}
            placeholder="Location"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

 
        {formData.driverAvailable && (
          <div className="relative">
            <FaUserTie className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              name="rateOfDriver"
              value={formData.rateOfDriver || 0}
              onChange={handleChange}
              placeholder="Driver Rate Per Day (₹)"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        )}

        
        <div className="flex items-center gap-4 col-span-full">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Driver Available</label>
          <Switch
            checked={formData.driverAvailable || false}
            onChange={handleToggle}
            className={`${formData.driverAvailable ? 'bg-green-500' : 'bg-gray-300'} relative inline-flex h-6 w-11 items-center rounded-full transition`}
          >
            <span className="sr-only">Enable Driver</span>
            <span className="inline-block h-4 w-4 transform bg-white rounded-full transition-transform"
              style={{ transform: formData.driverAvailable ? 'translateX(1.25rem)' : 'translateX(0)' }} />
          </Switch>
        </div>

       
        <div className="col-span-full">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Upload Images</label>
          <input type="file" multiple onChange={handleImageChange} />
          <div className="flex gap-2 mt-2 flex-wrap">
            {preview.map((img, i) => (
              <img key={i} src={img} alt="preview" className="w-20 h-20 object-cover rounded border dark:border-gray-600" />
            ))}
          </div>
        </div>

        
        <div className="col-span-full flex gap-4 justify-end">
          <button type="button" onClick={() => setShowPreview(true)} className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600">
            Preview
          </button>
          <button type="submit" className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700">
            Update Vehicle
          </button>
        </div>
      </form>

      
      {showPreview && (
        <div className="fixed top-0 right-0 h-full w-96 bg-white dark:bg-gray-800 shadow-lg border-l border-gray-300 dark:border-gray-700 z-50 p-6 transition-transform duration-300">
          <button
            onClick={() => setShowPreview(false)}
            className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-red-500"
          >
            ✕
          </button>
          <h3 className="text-xl font-semibold mb-4">Vehicle Preview</h3>
          <p><strong>Brand:</strong> {formData.brand}</p>
          <p><strong>Model:</strong> {formData.model}</p>
          <p><strong>Year:</strong> {formData.year}</p>
          <p><strong>Fuel:</strong> {formData.fuel}</p>
          <p><strong>Transmission:</strong> {formData.transmission}</p>
          <p><strong>Location:</strong> {formData.location}</p>
          <p><strong>Price/Day:</strong> ₹{formData.pricePerDay}</p>
          {formData.driverAvailable && (
            <p><strong>Driver Rate:</strong> ₹{formData.rateOfDriver}</p>
          )}
          <div className="mt-4 flex gap-2 flex-wrap">
            {preview.map((img, i) => (
              <img key={i} src={img} alt="Preview" className="w-20 h-20 object-cover rounded border dark:border-gray-600" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleUpdate;
