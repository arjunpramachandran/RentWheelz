import React, { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import { useSelector } from 'react-redux';
import { api } from '../../config/axiosinstance';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
  const { userData, isLoggedIn } = useSelector((state) => state.user);

  const [vehicleCount, setVehicleCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const fetchHostStats = async () => {
      try {
        const vehicleRes = await api.get('/host/getHostVehicle', {
          withCredentials: true,
        });
        setVehicleCount(vehicleRes?.data?.vehicle.length || 0);

        const bookingRes = await api.get('/host/hostDashboard', {
          withCredentials: true,
        });

        setBookingCount(bookingRes?.data?.totalBookings || 0);
        setEarnings(bookingRes?.data?.totalEarnings || 0);
        setMonthlyData(bookingRes?.data?.monthlyData || []);
      } catch (err) {
        console.error('Dashboard Fetch Error:', err);
      }
    };

    if (userData?._id && userData.role === 'host') {
      fetchHostStats();
    }
  }, [userData]);

  if (!isLoggedIn || userData.role !== 'host') {
    return <div className="flex items-center justify-center h-screen text-gray-800 dark:text-white">Access Denied</div>;
  }

  if (!userData || !userData._id) {
    return <div className="flex items-center justify-center h-screen text-gray-800 dark:text-white">Loading...</div>;
  }

  return (
    <div className="p-6 transition-colors duration-300">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Welcome, {userData.name}!</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">Here’s a quick summary of your activity.</p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md text-center border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1">Total Vehicles</h2>
          <p className="text-3xl font-bold text-cyan-600">
            <CountUp end={vehicleCount} duration={1.5} />
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md text-center border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1">Total Bookings</h2>
          <p className="text-3xl font-bold text-indigo-600">
            <CountUp end={bookingCount} duration={1.5} />
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md text-center border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1">Total Earnings</h2>
          <p className="text-3xl font-bold text-green-600">
            ₹<CountUp end={earnings} duration={2} separator="," />
          </p>
        </div>
      </div>

      {/* Monthly Earnings Chart */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Monthly Earnings</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <Line type="monotone" dataKey="earnings" stroke="#10B981" strokeWidth={3} />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="month" stroke="#8884d8" />
            <YAxis stroke="#8884d8" />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;

