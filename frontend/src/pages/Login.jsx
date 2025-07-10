import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FaUser, FaLock } from 'react-icons/fa';
import { api } from '../config/axiosinstance';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import { useSelector, useDispatch } from 'react-redux'
import { saveUser, logoutUser, updateUser } from '../app/features/user/userSlice'

const Login = () => {
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

      dispatch(saveUser(userData));
      toast.success("Login successful!");
      return nav(userData.role === 'host' ? '/host/dashboard' : userData.role === 'admin' ? '/admin/dashboard' : '/user/userDashboard');
    } catch (error) {
      console.log('Error during login:', error?.response);
      setError(error?.response?.data?.error || 'An error occurred during login');
      toast.error("Invalid credentials");
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
    onSubmit: async(values,{setSubmitting}) => {
      try {
      await  postData(values);
      } finally {
         setSubmitting(false)
      }
    },
  });

  return (
    <div className=" min-h-screen flex items-center justify-center bg-gradient-to-b from-cyan-100 to-green-100 px-4 dark:from-cyan-900 dark:to-gray-800 dark:text-white">
      <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8 dark:bg-cyan-700 ">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login to Your  Account</h2>

        <form className="space-y-5" onSubmit={formik.handleSubmit}>
          {/* Email */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">Email</label>
            <div className={`flex dark:text-white items-center border rounded-md p-2 ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'}`}>
              <FaUser className="text-gray-400 mr-2" />
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className="w-full focus:outline-none bg-transparent dark:bg-cyan-700 dark:text-white dark:border-gray-600"
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block  mb-2 text-sm font-medium text-gray-700 dark:text-white dark:bg-cyan-700 dark:border-gray-600">Password</label>
            <div className={` flex items-center border rounded-md p-2 ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'focus:outline-cyan-600'}`}>
              <FaLock className="text-gray-400 mr-2" />
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className="w-full bg-white dark:text-white dark:bg-cyan-700 dark:border-gray-600"
              />
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
            )}
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          {/* Options */}
          {/* <div className="flex justify-between items-center text-sm text-gray-600">
            <label className="flex items-center">
              <input type="checkbox" className="mr-1" />
              Remember me
            </label>
            <a href="#" className="text-cyan-600 hover:underline">Forgot password?</a>
          </div> */}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className={`w-full py-2 rounded-md transition ${formik.isSubmitting ? 'bg-cyan-400 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-700 text-white'
              }`}
          >
            {formik.isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6 dark:text-gray-200">
          Don’t have an account? <Link to='/register' className="text-cyan-600 hover:underline dark:text-cyan-200">Sign up </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
