import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FaUser, FaLock } from 'react-icons/fa';
import { api } from '../../config/axiosinstance';
import { Link, useNavigate } from 'react-router-dom';


import { useSelector, useDispatch } from 'react-redux'
import { saveUser, logoutUser, updateUser } from '../../app/features/user/userSlice'

const LoginHost = () => {
  const [error, setError] = useState(null);

  const dispatch = useDispatch()

  const nav = useNavigate();

  const postData = async (values) => {
    try {
      const response = await api({
        method: 'POST',
        url: '/user/login',
        data: values,
      });

      const userData = response?.data?.userObject;
      const token = response?.data?.token;
     
      
      if (token) {
        localStorage.setItem('token', token);
      }

      dispatch(saveUser(userData));
      nav(userData.role === 'host' ? '/host/dashboard' : userData.role === 'admin' ? '/admin/adminDashboard' : '/user/userDashboard');
    } catch (error) {
      console.log('Error during login:', error);
      setError(error?.response?.data?.message || 'An error occurred during login');
    }
  }
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    }),
    onSubmit: (values) => {
      postData(values);
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-cyan-100 to-green-100 px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login to Your Account</h2>

        <form className="space-y-5" onSubmit={formik.handleSubmit}>
          {/* Email */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
            <div className={`flex items-center border rounded-md p-2 ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'}`}>
              <FaUser className="text-gray-400 mr-2" />
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className="w-full focus:outline-none"
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
            <div className={`flex items-center border rounded-md p-2 ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-300'}`}>
              <FaLock className="text-gray-400 mr-2" />
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className="w-full focus:outline-none"
              />
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
            )}
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          {/* Options */}
          <div className="flex justify-between items-center text-sm text-gray-600">
            <label className="flex items-center">
              <input type="checkbox" className="mr-1" />
              Remember me
            </label>
            <a href="#" className="text-cyan-600 hover:underline">Forgot password?</a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-cyan-600 text-white py-2 rounded-md hover:bg-cyan-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account? <Link to='/host/register' className="text-cyan-600 hover:underline">Sign up as Host</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginHost;
