import { useEffect, useState } from 'react';
import { api } from '../../config/axiosinstance';
import Loader from '../../components/Loader';
import {toast} from 'react-hot-toast'

const AllCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCustomers = async () => {
        try {
            const res = await api.get('/admin/getAllCustomers', { withCredentials: true });
            setCustomers(res.data.users);
        } catch (err) {
            console.error('Failed to fetch customers:', err);
        } finally {
            setLoading(false);
        }
    };

    const verifyCustomer = async (id) => {
        try {
            const res = await api.patch(`/admin/verify-customer/${id}`, {}, { withCredentials: true });
            toast.success("Customer Verified")
            fetchCustomers();
        } catch (err) {
            console.error('Verification failed:', err);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    if (loading) return <Loader />;

    return (
        <div className="max-w-7xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">All Customers</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {customers.map((user) => (
                    <div key={user._id} className="bg-white p-4 rounded-xl shadow border space-y-2">
                        <div><strong>Name:</strong> {user.name}</div>
                        <div><strong>Email:</strong> {user.email}</div>
                        <div><strong>Phone:</strong> {user.phone}</div>

                        <div>
                            <strong>License No:</strong> {user.licenseNumber || 'N/A'}
                        </div>
                        <div>
                            <strong>License Proof:</strong><br />
                            {user.licenseProof ? (
                                <a href={user.licenseProof} target={user.licenseProof} className="text-blue-600 underline">View Document</a>
                            ) : 'N/A'}
                        </div>

                        <div>
                            <strong>Address ID:</strong> {user.addressProofId || 'N/A'}
                        </div>
                        <div>
                            <strong>Address Proof:</strong><br />
                            {user.addressProof ? (
                                <a href={user.addressProof} target="_blank" className="text-blue-600 underline">View Document</a>
                            ) : 'N/A'}
                        </div>
                       
                        <div className="pt-2">
                            {user.verified ? (
                                <span className="px-2 py-1 text-sm bg-green-100 text-green-700 rounded">Verified</span>
                            ) : (
                                <button
                                    className="bg-cyan-600 text-white px-3 py-1 rounded hover:bg-cyan-700"
                                    onClick={() => verifyCustomer(user._id)}
                                >
                                    Verify Customer
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllCustomers;
