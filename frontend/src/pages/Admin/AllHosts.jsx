import { useEffect, useState } from 'react';
import { api } from '../../config/axiosinstance';
import Loader from '../../components/Loader';
import { useNavigate } from 'react-router-dom';

const AllHosts = () => {
  const [hosts, setHosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchHosts = async () => {
    try {
      const res = await api.get('/admin/getAllHosts', { withCredentials: true });
    
      
      setHosts(res.data.users);
    } catch (err) {
      console.error('Error fetching hosts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHosts();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">All Hosts</h1>

      {hosts.length === 0 ? (
        <div className="text-center text-gray-500">No hosts found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hosts.map((host) => (
            <div
              key={host._id}
              className="bg-white rounded-xl border shadow-sm p-5 hover:shadow-md transition"
            >
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{host.name}</h2>
                <p className="text-sm text-gray-500">{host.email}</p>
                <p className="text-sm text-gray-500">{host.phone || '-'}</p>
                <p className="text-sm text-gray-500">{host.location || '-'}</p>
                <p className="text-sm text-gray-400">
                  Joined: {new Date(host.createdAt).toLocaleDateString()}
                </p>
                <span
                  className={`inline-block mt-2 px-2 py-1 text-xs rounded-full font-semibold ${
                    host.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}
                >
                  {host.isBlocked ? 'Blocked' : 'Active'}
                </span>
              </div>

              <div>
                <h3 className="font-medium text-gray-700 mb-2">Vehicles:</h3>
                {host.vehicles?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {host.vehicles.map((vehicle) => (
                      <button
                        key={vehicle._id}
                        onClick={() => navigate(`/admin/vehicleLog/${vehicle._id}`)}
                        className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded hover:bg-blue-200 transition"
                      >
                        {vehicle.brand} {vehicle.model}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">No vehicles listed</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllHosts;
