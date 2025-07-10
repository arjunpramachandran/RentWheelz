import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { api } from '../../config/axiosinstance';

const HostRegister = () => {
  const [profilePreview, setProfilePreview] = useState(null);
  const [licensePreview, setLicensePreview] = useState(null);
  const [addressPreview, setAddressPreview] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const role = "host";

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      formik.setFieldValue(field, file);

      const reader = new FileReader();
      reader.onloadend = () => {
        if (field === 'profilepic') setProfilePreview(reader.result);
        else if (field === 'licenseProof') setLicensePreview(reader.result);
        else if (field === 'addressProof') setAddressPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('password', values.password);
      formData.append('phone', values.phone);
      formData.append('role', values.role);
      formData.append('licenseNumber', values.licenseNumber);
      formData.append('addressProofId', values.addressProofId);
      formData.append('profilepic', values.profilepic);
      formData.append('licenseProof', values.licenseProof);
      formData.append('addressProof', values.addressProof);

      const res = await api.post('/user/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('Registered successfully!');
      navigate('/host/login');
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      role: 'host',
      licenseNumber: '',
      addressProofId: '',
      profilepic: '',
      licenseProof: '',
      addressProof: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string().min(8).max(128).required('Password is required'),
      phone: Yup.string().matches(/^\d{10}$/, 'Must be 10 digits').required('Phone number is required'),
    }),
    onSubmit: handleSubmit,
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-100 to-cyan-100 dark:from-green-900 dark:to-cyan-900 p-4">
      <div className="max-w-3xl w-full bg-white dark:bg-gray-900 shadow-lg rounded-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
          Create an Account For Host
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="md:flex gap-6">
            {/* Left Column */}
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <input
                  name="name"
                  className="input w-full bg-gray-100 dark:bg-gray-800 dark:text-white rounded p-2"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="text-red-500 text-sm">{formik.errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input
                  name="email"
                  type="email"
                  className="input w-full bg-gray-100 dark:bg-gray-800 dark:text-white rounded p-2"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-sm">{formik.errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <input
                  name="password"
                  type="password"
                  className="input w-full bg-gray-100 dark:bg-gray-800 dark:text-white rounded p-2"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                />
                {formik.touched.password && formik.errors.password && (
                  <p className="text-red-500 text-sm">{formik.errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                <input
                  name="phone"
                  type="tel"
                  className="input w-full bg-gray-100 dark:bg-gray-800 dark:text-white rounded p-2"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.phone}
                />
                {formik.touched.phone && formik.errors.phone && (
                  <p className="text-red-500 text-sm">{formik.errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">License Number</label>
                <input
                  name="licenseNumber"
                  className="input w-full bg-gray-100 dark:bg-gray-800 dark:text-white rounded p-2"
                  onChange={formik.handleChange}
                  value={formik.values.licenseNumber}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address Proof ID</label>
                <input
                  name="addressProofId"
                  className="input w-full bg-gray-100 dark:bg-gray-800 dark:text-white rounded p-2"
                  onChange={formik.handleChange}
                  value={formik.values.addressProofId}
                />
              </div>
            </div>

            {/* Right Column (Uploads) */}
            <div className="flex-1 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'profilepic')}
                  className="file-input dark:text-white dark:bg-gray-800 dark:border-gray-600 file-input-bordered file-input-primary w-full"
                />
                {profilePreview && (
                  <img src={profilePreview} alt="Preview" className="mt-2 w-24 h-24 rounded-full object-cover" />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address Proof</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'addressProof')}
                  className="file-input dark:text-white dark:bg-gray-800 dark:border-gray-600 file-input-bordered file-input-primary w-full"
                />
                {addressPreview && (
                  <img src={addressPreview} alt="Preview" className="mt-2 w-24 h-24 rounded object-cover" />
                )}
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-cyan-600 text-white py-2 px-6 rounded hover:bg-cyan-700 transition"
            >
              Register
            </button>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Already have an account?{' '}
          <a href="/host/login" className="text-cyan-600 dark:text-cyan-400 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default HostRegister;
