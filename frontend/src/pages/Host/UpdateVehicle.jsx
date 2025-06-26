import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../config/axiosinstance';
import { Switch } from '@headlessui/react';
import { FaCar, FaHotel, FaCogs, FaGasPump, FaMoneyBillWave, FaIdCard, FaCalendarAlt, FaMapMarkerAlt, FaUserTie, FaMap, FaMapPin, FaMapMarker } from 'react-icons/fa';
import ModalDialog from '../../components/Modal';



const VehicleUpdate = () => {
    const { id } = useParams();
    const [vehicle, setVehicle] = useState(null);
    const [formData, setFormData] = useState({});
    const [images, setImages] = useState([]);
    const [preview, setPreview] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate()

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

        for (let pair of data.entries()) {
            console.log(pair[0] + ':', pair[1]);
        }

        try {
            const res = await api.patch(`/host/updateVehicle/${id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },

            });
            setIsModalOpen(true)

        } catch (err) {
            console.error(err);
            alert('Update failed');
        }
    };

    if (!vehicle) return <div className="text-center py-10">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-xl mt-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Update Vehicle</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="relative flex items-center">
                    <FaHotel className="absolute left-3 text-gray-400" />
                    <input
                        type="text"
                        name="brand"
                        value={formData.brand || ''}
                        onChange={handleChange}
                        placeholder="Brand"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                </div>

                <div className="relative">
                    <FaCar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        name="model"
                        value={formData.model || ''}
                        onChange={handleChange}
                        placeholder="Model"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                </div>
                <div className="relative">
                    <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input type="number" name="year" value={formData.year || ''} onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Year" required />
                </div>
                <div className="relative">
                    <FaGasPump className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select name="fuel" value={formData.fuel || ''} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500">
                        <option value="">Select Fuel Type</option>
                        <option value="petrol">Petrol</option>
                        <option value="diesel">Diesel</option>
                        <option value="electric">Electric</option>
                    </select>
                </div>

                <div className="relative">
                    <FaCogs className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select name="transmission" value={formData.transmission || ''} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500">
                        <option value="">Select Transmission</option>
                        <option value="manual">Manual</option>
                        <option value="automatic">Automatic</option>
                    </select>
                </div>
                <div className="relative">
                    <FaMoneyBillWave className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input type="number" name="pricePerDay" value={formData.pricePerDay || ''} onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Price Per Day (₹)" required />
                </div>


                <div className="relative">
                    <FaMapMarker className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input type="text" name="location" value={formData.location || ''} onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Location" />
                </div>

                {formData.driverAvailable && (
                    <div className="relative">
                        <FaUserTie className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input type="number" name="rateOfDriver" value={formData.rateOfDriver || 0} onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Driver Rate Per Day (₹)" />
                    </div>
                )}


                <div className="flex items-center gap-4 col-span-full">
                    <label className="text-sm font-medium text-gray-700">Driver Available</label>
                    <Switch checked={formData.driverAvailable || false} onChange={handleToggle}
                        className={`${formData.driverAvailable ? 'bg-green-500' : 'bg-gray-300'} relative inline-flex h-6 w-11 items-center rounded-full transition`}>
                        <span className="sr-only">Enable Driver</span>
                        <span className="inline-block h-4 w-4 transform bg-white rounded-full transition-transform"
                            style={{ transform: formData.driverAvailable ? 'translateX(1.25rem)' : 'translateX(0)' }} />
                    </Switch>
                </div>

                <div className="col-span-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload Images</label>
                    <input type="file" multiple onChange={handleImageChange} className="input" />
                    <div className="flex gap-2 mt-2 flex-wrap">
                        {preview.map((img, i) => (
                            <img key={i} src={img} alt="preview" className="w-20 h-20 object-cover rounded" />
                        ))}
                    </div>
                </div>

                <button type="submit" className="col-span-full bg-cyan-600 text-white py-3 rounded-lg hover:bg-cyan-700 transition">
                    Update Vehicle
                </button>
            </form>
            {isModalOpen && (
                <ModalDialog
                    title="Vehicle Updated"
                    description="Your vehicle has been successfully updated."
                    onClose={() => { setIsModalOpen(false); navigate('/host/dashboard') }}
                />
            )}

        </div>
    );
};

export default VehicleUpdate;
