import React, { useEffect, useState } from 'react';
import { api } from '../../config/axiosinstance';
import { format, differenceInDays, parseISO } from 'date-fns';

const HostOrders = () => {
    const [bookings, setBookings] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await api.get('/host/getBookingByOwner',{withCredentials:true});
                setBookings(res.data.bookings);
                setFiltered(res.data.bookings);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    useEffect(() => {
        const term = searchTerm.toLowerCase();
        const filteredList = bookings.filter((b) => {
            const name = b?.userId?.name?.toLowerCase() || '';
            const brand = b?.vehicleId?.brand?.toLowerCase() || '';
            const model = b?.vehicleId?.model?.toLowerCase() || '';
            const status = b?.status?.toLowerCase() || '';
            return (
                (name.includes(term) || brand.includes(term) || model.includes(term)) &&
                (statusFilter === 'all' || status === statusFilter)
            );
        });
        setFiltered(filteredList);
    }, [searchTerm, statusFilter, bookings]);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            case 'completed': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

   
    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-6">My Orders</h2>

            {/* Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                <input
                    type="text"
                    placeholder="Search by name, brand, or model"
                    className="border rounded px-4 py-2 w-full md:w-1/2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border rounded px-4 py-2"
                >
                    <option value="all">All Statuses</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="py-3 px-4">Vehicle</th>
                            <th className="py-3 px-4">Customer</th>
                            <th className="py-3 px-4">Contact</th>
                            <th className="py-3 px-4">Pickup</th>
                            <th className="py-3 px-4">Dropoff</th>
                            <th className="py-3 px-4">Duration</th>
                            <th className="py-3 px-4">Driver</th>
                            <th className="py-3 px-4">Total</th>
                            <th className="py-3 px-4">Payment</th>
                            <th className="py-3 px-4">Status</th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length > 0 ? (
                            filtered.map((b) => {
                                const pickup = b.pickupDateTime ? format(parseISO(b.pickupDateTime), 'PP') : '—';
                                const dropoff = b.dropoffDateTime ? format(parseISO(b.dropoffDateTime), 'PP') : '—';
                                const days = (b.pickupDateTime && b.dropoffDateTime)
                                    ? differenceInDays(new Date(b.dropoffDateTime), new Date(b.pickupDateTime)) + 1
                                    : '—';
                                const driver = b.driverRequired ? 'Yes' : 'No';
                                const paymentStatus = b.paymentId ? 'Paid' : 'Unpaid';

                                return (
                                    <tr key={b._id} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4">{b.vehicleId?.brand} {b.vehicleId?.model}</td>
                                        <td className="py-3 px-4">{b.userId?.name}</td>
                                        <td className="py-3 px-4">
                                            {b.userId?.email}
                                            <br />
                                            <span className="text-gray-600 text-xs">{b.userId?.phone}</span>
                                        </td>
                                        <td className="py-3 px-4">{pickup}</td>
                                        <td className="py-3 px-4">{dropoff}</td>
                                        <td className="py-3 px-4">{days} days</td>
                                        <td className="py-3 px-4">{driver}</td>
                                        <td className="py-3 px-4">₹{b.totalBill}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${b.paymentId ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {paymentStatus}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusStyle(b.status)}`}>
                                                {b.status}
                                            </span>
                                        </td>
                                       
                                    </tr>
                                );
                            })  
                        ) : (
                            <tr>
                                <td colSpan="11" className="text-center py-4 text-gray-500">
                                    No bookings found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HostOrders;
