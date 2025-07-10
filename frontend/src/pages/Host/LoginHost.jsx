import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FaUser, FaLock } from 'react-icons/fa';
import { api } from '../../config/axiosinstance';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { saveUser } from '../../app/features/user/userSlice';

const LoginHost = () => {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const postData = async (values) => {
    try {
      const response = await api.post('/user/login', values);
      const { userObject, token } = response?.data;

      if (token) localStorage.setItem('token', token);

      dispatch(saveUser(userObject));

      if (userObject.role === 'host') {
        navigate('/host/dashboard');
      } else if (userObject.role === 'admin') {
        navigate('/admin/adminDashboard');
      } else {
        navigate('/user/userDashboard');
      }
    } catch (err) {
      console.log('Login Error:', err);
      setError(err?.response?.data?.message || 'Login failed. Try again.');
    }
  };

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
    }),
    onSubmit: postData,
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-cyan-100 to-green-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 shadow-lg rounded-xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
          Login to Your Account
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <div className={`flex items-center border rounded-md p-2 ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}>
              <FaUser className="text-gray-400 mr-2" />
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className="w-full bg-transparent focus:outline-none text-gray-800 dark:text-gray-100"
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className={`flex items-center border rounded-md p-2 ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}>
              <FaLock className="text-gray-400 mr-2" />
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className="w-full bg-transparent focus:outline-none text-gray-800 dark:text-gray-100"
              />
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
            )}
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          {/* Remember Me & Forgot */}
          <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <a href="#" className="text-cyan-600 dark:text-cyan-400 hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-cyan-600 text-white py-2 rounded-md hover:bg-cyan-700 transition"
          >
            Login
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Don’t have an account?{' '}
          <Link to="/host/register" className="text-cyan-600 dark:text-cyan-400 hover:underline">
            Sign up as Host
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginHost;
