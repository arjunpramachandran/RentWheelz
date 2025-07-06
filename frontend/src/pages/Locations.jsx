import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FaMapMarkerAlt, FaCarSide } from 'react-icons/fa';

const attractions = [
  {
    name: 'Munnar',
    image: './public/WEb/munnar.jpg',
    description: 'A hill station with tea gardens, cool climate, and lush greenery.',
    cars: [
      { car: 'Mahindra Thar', path: '#' },
      { car: 'Toyota RAV4', path: '/vehicle/682c33555824e5246f677c75' },
      { car: 'Maruti Swift', path: '#' }
    ]
  },//'Mahindra Thar', 'Toyota Innova', 'Maruti Swift'
  {
    name: 'Alleppey',
    image: './public/WEb/Allepy.jpg',
    description: 'Known for its backwaters, houseboats, and serene lakes.',
    cars: [
      { car: 'Maruti Suzuki Ertiga', path: '#' },
      { car: 'Hyundai Creta', path: '#' },
      { car: 'Toyota Innova HyCross', path: '/vehicle/68592b538d4b440d44bb5c2b' }
    ]
  },
  {
    name: 'Wayanad',
    image: './public/WEb/Wayanad.jpg',
    description: 'Forests, wildlife, waterfalls, and trekking destinations.',
    cars: [
      { car: 'Jeep Compass', path: '#' },
      { car: 'Ford EcoSport', path: '#' },
      { car: 'Toyota Hyrider', path: '/vehicle/684fb0e6b050b368118e6d58' }
    ]
  },
  {
    name: 'Kochi',
    image: './public/WEb/Kochi.jpg',
    description: 'A blend of modern city life and colonial history.',
    cars: [
      { car: 'Maruti Baleno', path: '#' },
      { car: 'Hyundai Creta', path: '#' },
      { car: 'Tata Nexon', path: '/vehicle/6834812e946f52c32f558141' }

    ]
  }
];

const Locations = () => {
  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Top Locations With RentWheelz in Kerala</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {attractions.map((place, index) => (
          <Card key={index} className="overflow-hidden shadow-md hover:shadow-lg transition">
            <img src={place.image} alt={place.name} className="h-48 w-full object-cover" />
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2 text-cyan-600 font-semibold">
                <FaMapMarkerAlt />
                <h2 className="text-xl">{place.name}</h2>
              </div>
              <p className="text-gray-600 mb-3">{place.description}</p>
              <h3 className="font-medium text-gray-800 mb-1">Top Available Cars:</h3>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {place.cars.map((car, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <a href={car.path}><FaCarSide className="text-cyan-500" />
                      {car.car}
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Locations;
