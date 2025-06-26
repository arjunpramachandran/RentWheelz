import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { api } from '../../config/axiosinstance';
import VehicleCard from '../../components/VehicleCard'; 

const MyVehicles = () => {
  const { userData, isLoggedIn } = useSelector((state) => state.user);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
    console.log('userData in MyVehicles:', userData);
    console.log('isLogedin in MyVehicles:', isLoggedIn);
    
    
   
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await api.get(`/host/getHostVehicle`, {
          withCredentials:true,
        });
        console.log('Fetched vehicles:', response.data.vehicle);
        setVehicles(response.data.vehicle || []);
      } catch (err) {
        console.error('Error fetching host vehicles:', err);
        setError('Failed to load vehicles');
      } finally {
        setLoading(false);
      }
    };
      fetchVehicles();
       console.log('vehicles:', vehicles);
  }, [userData, isLoggedIn]);
 
  
  if (loading) return <p className="text-center mt-10 text-gray-600">Loading vehicles...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="w-full mx-auto px-4 py-4 flex flex-col  items-center">
      <h2 className="text-2xl font-bold mb-6 text-center">My Vehicles</h2>
      {vehicles.length === 0 ? (
        <p className="text-center text-gray-500">You haven't added any vehicles yet.</p>
      ) : (
        <div className="grid grid-cols-1 w-auto sm:grid-cols-2 xl:grid-cols-3 gap-6 ">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle._id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyVehicles;
