import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { api } from '../../config/axiosinstance';
import { useSelector } from 'react-redux';
import ModalDialog from '../../components/Modal';


const AddVehicle = () => {
    const [imagePreviews, setImagePreviews] = useState([]);
    const { userData, isLogedin } = useSelector(state => state.user);
    const [isModalOpen, setIsModalOpen] = useState(false)




    const formik = useFormik({
        initialValues: {
            type: '',
            brand: '',
            model: '',
            year: '',
            fuel: '',
            transmission: '',
            registrationNumber: '',
            images: [],
            pricePerDay: 0,
            location: '',
            driverAvailable: true,
            rateOfDriver: 0
        },
        validationSchema: Yup.object({
            type: Yup.string().required(),
            brand: Yup.string().required(),
            model: Yup.string().required(),
            year: Yup.number().required().min(1900).max(new Date().getFullYear()),
            fuel: Yup.string().required(),
            transmission: Yup.string().required(),
            registrationNumber: Yup.string().required(),
            images: Yup.mixed().required(),
            pricePerDay: Yup.number().required().positive(),
            location: Yup.string().required(),

            description: Yup.string().required('Description is required'),
            driverAvailable: Yup.boolean().required(),
            rateOfDriver: Yup.number().when('driverAvailable', {
                is: true,
                then: schema => schema.required().min(1),
                otherwise: schema => schema.notRequired().oneOf([0])
            })
        }),
        onSubmit: async (values) => {
            try {


                const formData = new FormData();
                formData.append('type', values.type);
                formData.append('brand', values.brand);
                formData.append('model', values.model);
                formData.append('year', values.year);
                formData.append('fuel', values.fuel);
                formData.append('transmission', values.transmission);
                formData.append('registrationNumber', values.registrationNumber);
                formData.append('pricePerDay', values.pricePerDay);

                formData.append('location', values.location);
                formData.append('description', values.description);
                formData.append('driverAvailable', values.driverAvailable);
                formData.append('rateOfDriver', values.rateOfDriver);
                formData.append('ownerId', userData._id);

                for (let i = 0; i < values.images.length; i++) {
                    formData.append('images', values.images[i]);
                }
                for (let pair of formData.entries()) {
                    console.log(`${pair[0]}: ${pair[1]}`);
                }
                const response = await api.post('/host/addVehicle', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',

                    },
                    withCredentials: true
                });


                formik.resetForm();
                setImagePreviews([]);
                setIsModalOpen(true);

            } catch (error) {
                console.log('Add Vehicle Error:', error?.response?.data || error.message);
                alert(error?.response?.data?.error || 'Failed to add vehicle');
            }
        }
    });

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        formik.setFieldValue('images', files);

        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
            <h2 className="text-2xl font-bold mb-4 ">Add Vehicle</h2>

            <form onSubmit={formik.handleSubmit} encType="multipart/form-data" className="space-y-4 font-Montserrat text-sm font-medium">
                {/* Type */}
                <div>
                    <label>Type</label>
                    <select name="type" onChange={formik.handleChange} value={formik.values.type} className="w-full border border-gray-300 p-2 rounded-xl">
                        <option value="">Select</option>
                        <option value="car">Car</option>
                        <option value="bike">Bike</option>
                    </select>
                </div>

                {/* Brand / Model */}
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label>Brand</label>
                        <input type="text" name="brand" onChange={formik.handleChange} value={formik.values.brand} className="w-full border border-gray-300 p-2 rounded-xl" />
                    </div>
                    <div className="flex-1">
                        <label>Model</label>
                        <input type="text" name="model" onChange={formik.handleChange} value={formik.values.model} className="w-full border border-gray-300 p-2 rounded-xl" />
                    </div>
                </div>

                {/* Year / Price */}
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label>Year</label>
                        <input type="number" name="year" onChange={formik.handleChange} value={formik.values.year} className="w-full border border-gray-300 p-2 rounded-xl" />
                    </div>
                    <div className="flex-1">
                        <label>Price per Day</label>
                        <input type="number" name="pricePerDay" onChange={formik.handleChange} value={formik.values.pricePerDay} className="w-full border border-gray-300 p-2 rounded-xl" />
                    </div>
                </div>

                {/* Fuel / Transmission */}
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label>Fuel</label>
                        <select name="fuel" onChange={formik.handleChange} value={formik.values.fuel} className="w-full border border-gray-300 p-2 rounded-xl">
                            <option value="">Select</option>
                            <option value="petrol">Petrol</option>
                            <option value="diesel">Diesel</option>
                            <option value="electric">Electric</option>
                        </select>
                    </div>
                    <div className="flex-1">
                        <label>Transmission</label>
                        <select name="transmission" onChange={formik.handleChange} value={formik.values.transmission} className="w-full border border-gray-300 p-2 rounded-xl">
                            <option value="">Select</option>
                            <option value="manual">Manual</option>
                            <option value="automatic">Automatic</option>
                        </select>
                    </div>
                </div>

                {/* Registration */}
                <div>
                    <label>Registration Number</label>
                    <input type="text" name="registrationNumber" onChange={formik.handleChange} value={formik.values.registrationNumber} className="w-full border border-gray-300 p-2 rounded-xl" />
                </div>

                {/* Coordinates */}
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label>Location</label>
                        <input type="string" name="location" onChange={formik.handleChange} value={formik.values.location} className="w-full border border-gray-300 p-2 rounded-xl" />
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block mb-1">Driver Available</label>
                            <div className="flex gap-4 mt-1">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="driverAvailable"
                                        value="true"
                                        checked={formik.values.driverAvailable === true}
                                        onChange={() => {
                                            formik.setFieldValue('driverAvailable', true);
                                        }}
                                    />
                                    Yes
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="driverAvailable"
                                        value="false"
                                        checked={formik.values.driverAvailable === false}
                                        onChange={() => {
                                            formik.setFieldValue('driverAvailable', false);
                                            formik.setFieldValue('rateOfDriver', 0); // reset driver rate
                                        }}
                                    />
                                    No
                                </label>
                            </div>
                        </div>

                        {formik.values.driverAvailable && (
                            <div className="flex-1">
                                <label>Rate (Rs. per Day)</label>
                                <input
                                    type="number"
                                    name="rateOfDriver"
                                    onChange={formik.handleChange}
                                    value={formik.values.rateOfDriver}
                                    className="w-full border border-gray-300 p-2 rounded-xl"
                                />
                            </div>
                        )}
                    </div>


                </div>
                <div>
                    <label>Description</label>
                    <textarea
                        name="description"
                        rows="4"
                        onChange={formik.handleChange}
                        value={formik.values.description}
                        className="w-full border border-gray-300 p-2 rounded-xl"
                        placeholder="Describe the vehicle, special features, etc."
                    />
                </div>

                {/* Images */}
                <div>
                    <label>Vehicle Images</label>
                    <input type="file" multiple onChange={handleImageChange} className="w-full border border-gray-300 p-2 rounded-xl" />
                    <div className="flex gap-2 mt-2 flex-wrap">
                        {imagePreviews.map((src, idx) => (
                            <img key={idx} src={src} alt="preview" className="w-24 h-24 object-cover rounded" />
                        ))}
                    </div>
                </div>

                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Submit
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

export default AddVehicle;
