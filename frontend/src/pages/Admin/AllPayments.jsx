import { useEffect, useState } from 'react';
import { api } from '../../config/axiosinstance';
import Loader from '../../components/Loader';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';


const AllPayments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPayments = async () => {
        try {
            const res = await api.get('/admin/getAllPayments', { withCredentials: true });
            setPayments(res.data.payments);
            console.log(res);

        } catch (err) {
            console.error('Failed to fetch payments:', err);
        } finally {
            setLoading(false);
        }
    };

    const monthlyIncome = payments.reduce((acc, payment) => {
        const date = new Date(payment.createdAt);
        const month = date.toLocaleString('default', { month: 'short', year: 'numeric' }); // e.g. "Jul 2025"
        acc[month] = (acc[month] || 0) + payment.amount;
        return acc;
    }, {});
    const monthlyIncomeData = Object.entries(monthlyIncome).map(([month, total]) => ({
        month,
        total,
    }));

    useEffect(() => {
        fetchPayments();
    }, []);

    const statusColor = {
        success: 'bg-green-100 text-green-700',
        failed: 'bg-red-100 text-red-700',
        refunded: 'bg-yellow-100 text-yellow-700',
    };

    if (loading) return <Loader />;

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-6">All Payments</h1>

            <div className="bg-white p-4 rounded-lg shadow border">
                <h2 className="text-lg font-semibold mb-3">Monthly Income</h2>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={monthlyIncomeData}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="total" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4 }} />

                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
                <table className="min-w-full text-sm text-left text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 font-semibold">
                        <tr>
                            <th className="px-4 py-3">User</th>
                            <th className="px-4 py-3">Host</th>
                            <th className="px-4 py-3">Amount</th>
                            <th className="px-4 py-3">Payment Method</th>
                            <th className="px-4 py-3">Transaction ID</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Vehicle</th>

                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((payment) => (
                            <tr key={payment._id} className="border-t">
                                <td className="px-4 py-3">{payment.userId?.name || '-'}</td>
                                <td className="px-4 py-3">{payment.hostId?.name || '-'}</td>
                                <td className="px-4 py-3 font-medium text-cyan-700">₹{payment.amount}</td>
                                <td className="px-4 py-3 capitalize">{payment.paymentMethod}</td>
                                <td className="px-4 py-3 text-xs text-gray-500">{payment.transactionId}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[payment.status]}`}>
                                        {payment.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-sm">{new Date(payment.createdAt).toLocaleString()}</td>
                                <td className="px-4 py-3">
                                    {payment.bookingId?.vehicleId
                                        ? `${payment.bookingId.vehicleId.brand} ${payment.bookingId.vehicleId.model} (${payment.bookingId.vehicleId.registrationNumber})`
                                        : '-'}
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllPayments;
