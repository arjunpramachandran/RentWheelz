import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../config/axiosinstance'; // assuming you use axios instance
import VehicleDetails from '../components/VehicleDetails';

const VehicleDetailsPage = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await api.get(`user/getVehicle/${id}`);
        setVehicle(res.data);
        
        
      } catch (err) {
        console.error('Failed to load vehicle:', err);
      }
    };

    fetchVehicle();
  }, [id]);

  if (!vehicle) return <div>Loading...</div>;

  return (
    <div>
     <VehicleDetails vehicle={vehicle} />
     <div>
       
     </div>
    </div>
  );
};

export default VehicleDetailsPage;
