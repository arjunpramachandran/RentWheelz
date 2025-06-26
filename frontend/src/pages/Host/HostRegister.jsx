import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { api } from '../../config/axiosinstance';

const HostRegister = () => {

  const [profilePreview, setProfilePreview] = useState(null);
  const [licensePreview, setLicensePreview] = useState(null);
  const [addressPreview, setAddressPreview] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
    const role ="host"; 
  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      formik.setFieldValue(field, file);

      // Show preview
      if (field === 'profilepic') {
        const reader = new FileReader();
        reader.onloadend = () => setProfilePreview(reader.result);
        reader.readAsDataURL(file);
      }
      else if (field === 'licenseProof') {
        const reader = new FileReader();
        reader.onloadend = () => setLicensePreview(reader.result);
        reader.readAsDataURL(file);
      } else if (field === 'addressProof') {
        const reader = new FileReader();
        reader.onloadend = () => setAddressPreview(reader.result);
        reader.readAsDataURL(file);
      }
    }
  };
  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();

      //  text fields
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('password', values.password);
      formData.append('phone', values.phone);
      formData.append('role', values.role);
      formData.append('licenseNumber', values.licenseNumber);
      formData.append('addressProofId', values.addressProofId);

      //  file fields
      formData.append('profilepic', values.profilepic);
      formData.append('licenseProof', values.licenseProof);
      formData.append('addressProof', values.addressProof);

     

      const res = await api({
        method: "POST",
        url: "/user/register",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert('Registered successfully!');
      console.log('Response:', res.data);
      if (role === 'host') {
        navigate('/host/login');
      } else if (role === 'admin') {
        navigate('/admin/login');
      } else {
        navigate('/login'); // default for customer or general login
      }

    } catch (error) {
      console.error(error.response?.data || error.message);
      setError(error.response?.data?.error || 'Registration failed');

    }
  }
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      role: "host" ,
      licenseNumber: '',
      addressProofId: '',
      profilepic: '',
      licenseProof: '',
      addressProof: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .max(128, 'Password must be less than 128 characters')
        .required('Password is required'),
      phone: Yup.string()
        .required('Phone number is required')
        .matches(/^\d{10}$/, 'Phone number must be 10 digits'),
      role: Yup.string().oneOf(['customer', 'host', 'admin']).required(),


    }),
    onSubmit: handleSubmit,


  });


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-100 to-cyan-100 p-4">

      <div className="max-w-3xl  w-full bg-white shadow-md rounded-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Create an Account For Host</h2>
        <div className="space-y-4">
          <form onSubmit={formik.handleSubmit} className="space-y-4 ">
            <div className='md:flex gap-4'>
              <div className='flex-1 gap-4 space-y-4'>
                <div>
                  <label className="block text-sm font-medium">Name</label>
                  <input
                    name="name"
                    className="input"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className="text-red-500 text-sm">{formik.errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <input
                    name="email"
                    type="email"
                    className="input"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-red-500 text-sm">{formik.errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium">Password</label>
                  <input
                    name="password"
                    type="password"
                    className="input"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                  />
                  {formik.touched.password && formik.errors.password && (
                    <p className="text-red-500 text-sm">{formik.errors.password}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium">Phone</label>
                  <input
                    name="phone"
                    type="tel"
                    className="input"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.phone}
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <p className="text-red-500 text-sm">{formik.errors.phone}</p>
                  )}
                </div>
                {role === 'customer' && (
                  <div>
                    <label className="block text-sm font-medium">License Number</label>
                    <input
                      name="licenseNumber"
                      className="input"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.licenseNumber}
                    />
                    {formik.touched.licenseNumber && formik.errors.licenseNumber && (
                      <p className="text-red-500 text-sm">{formik.errors.licenseNumber}</p>
                    )}
                  </div>
                )}
                {role !== 'admin' && (
                  <div>
                    <label className="block text-sm font-medium">Address Proof ID</label>
                    <input
                      name="addressProofId"
                      className="input"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.addressProofId}
                    />
                    {formik.touched.addressProofId && formik.errors.addressProofId && (
                      <p className="text-red-500 text-sm">{formik.errors.addressProofId}</p>
                    )}
                  </div>
                )}


              </div>

              <div className='flex-1 space-y-4'>
                {/* Profile pic */}
                <div>
                  <label className="block text-sm font-medium mb-1">Profile Picture</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'profilepic')}
                    className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0 file:text-sm file:font-semibold
                   file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                  />
                  {profilePreview && (
                    <img
                      src={profilePreview}
                      alt="Preview"
                      className="mt-2 w-32 h-32 rounded-full object-cover shadow border"
                    />
                  )}
                </div>

                {/* Address Proof */}
                {role !== 'admin' && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Address Proof</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'addressProof')}
                      className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0 file:text-sm file:font-semibold
                   file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                    />
                    {addressPreview && (
                      <img
                        src={addressPreview}
                        alt="Preview"
                        className="mt-2 w-32 h-32 rounded-full object-cover shadow border"
                      />
                    )}
                  </div>
                )}


                {/* License Proof */}
                {role === 'customer' && (
                  <div>
                    <label className="block text-sm font-medium mb-1">License Proof</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'licenseProof')}
                      className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0 file:text-sm file:font-semibold
                   file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                    />
                    {licensePreview && (
                      <img
                        src={licensePreview}
                        alt="Preview"
                        className="mt-2 w-32 h-32 rounded-full object-cover shadow border"
                      />
                    )}
                  </div>
                )}


              </div>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-1/2 bg-cyan-600 text-white py-2 rounded-md hover:bg-cyan-700 transition"
              >
                Register
              </button>

            </div>
            {error && (
              <p className="text-red-500 text-sm text-center mt-2">{error}</p>
            )}

          </form>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account? <a href="/host/login" className="text-cyan-600 hover:underline">Login</a>
        </p>

      </div>
    </div>
  );
};

export default HostRegister;
