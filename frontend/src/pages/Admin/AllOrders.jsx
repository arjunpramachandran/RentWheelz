import React, { useEffect, useState } from 'react';
import { api } from '../../config/axiosinstance';
import { format } from 'date-fns';
import { BadgeCheck, Ban, Clock, CheckCircle } from 'lucide-react';

const statusStyles = {
    pending: { text: 'Pending', icon: <Clock className="w-4 h-4 mr-1" />, class: 'bg-yellow-100 text-yellow-800' },
    confirmed: { text: 'Confirmed', icon: <BadgeCheck className="w-4 h-4 mr-1" />, class: 'bg-blue-100 text-blue-800' },
    completed: { text: 'Completed', icon: <CheckCircle className="w-4 h-4 mr-1" />, class: 'bg-green-100 text-green-800' },
    cancelled: { text: 'Cancelled', icon: <Ban className="w-4 h-4 mr-1" />, class: 'bg-red-100 text-red-800' },
};

const AllOrders = () => {
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        api.get('/admin/getAllBookings', { withCredentials: true })
            .then(res => setOrders(res.data.bookings))
            .catch(err => console.error('Failed to fetch orders', err));
    }, []);
    console.log(orders);

    const filteredOrders = orders.filter(order =>
        order.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
        order.vehicleId?.brand?.toLowerCase().includes(search.toLowerCase()) ||
        order.status?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">All Bookings</h2>

            <input
                type="text"
                placeholder="Search by user, vehicle, or status..."
                className="border p-2 rounded-md w-full max-w-md mb-4"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full bg-white text-sm text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3">User</th>
                            <th className="p-3">Vehicle</th>
                            <th className="p-3">Pickup</th>
                            <th className="p-3">Dropoff</th>
                            <th className="p-3">Amount</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Booked On</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order, idx) => {
                                const status = statusStyles[order.status];

                                return (
                                    <tr key={idx} className="border-b hover:bg-gray-50 transition">
                                        <td className="p-3">{order.userId?.name}</td>
                                        <td className="p-3">{order.vehicleId?.brand} {order.vehicleId?.model}</td>
                                        <td className="p-3">
                                            {order.pickupDateTime ? format(new Date(order.pickupDateTime), "dd MMM yyyy, hh:mm a") : 'N/A'}
                                        </td>
                                        <td className="p-3">
                                            {order.dropoffDateTime ? format(new Date(order.dropoffDateTime), "dd MMM yyyy, hh:mm a") : 'N/A'}
                                        </td>
                                        <td className="p-3">₹{order.totalBill}</td>
                                        <td className="p-3">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status.class}`}>
                                                {status.icon}
                                                {status.text}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            {order.createdAt ? format(new Date(order.createdAt), "dd MMM yyyy") : 'N/A'}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="7" className="p-4 text-center text-gray-500">No orders found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllOrders;
