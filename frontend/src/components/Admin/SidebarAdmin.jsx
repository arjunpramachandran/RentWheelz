

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MdSpaceDashboard } from 'react-icons/md';
import { RiCloseCircleFill } from 'react-icons/ri';
import { useSelector } from 'react-redux';
import { TbEdit } from 'react-icons/tb';

const links = [
  { name: 'All Vehicles', path: '/admin/vehicleList' },
  { name: 'Add Vehicle', path: '/admin/addVehicle' },
  { name: 'All Orders', path: '/admin/allOrders' },
  { name: 'All Host', path: '/host/myOrders' },
  { name: 'All Customers', path: '/host/myOrders' },
  { name: 'All Payments', path: '/reviews' },
];

const SidebarAdmin = () => {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  const updateProfile = () => {
    setIsOpen(false);
    navigate('/host/updateProfile');
  };

  return (
    <>

      <button
        className="fixed top-15 left-15 z-50 text-cyan-600 text-3xl md:hidden"
        onClick={toggleMenu}
      >
        {isOpen ? <RiCloseCircleFill /> : <MdSpaceDashboard />}
      </button>
      {/* Sidebar */}
      <aside
        className={`
          fixed md:static top-[24] left-0 z-40 h-full w-64 bg-gray-800 text-white p-4 transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0
        `}
      >
        {/* Profile */}
        <div className="flex flex-col items-center border-b-2 pb-4 mb-4 relative">
          <img
            src={userData.profilepic}
            alt={userData.name}
            className="rounded-full w-20 h-20 object-cover mb-2"
          />
          <button onClick={updateProfile} className="absolute right-2 top-2">
            <TbEdit className="text-2xl" />
          </button>
          <h3 className="uppercase">{userData.name}</h3>
          <p className="text-sm">{userData.email}</p>
          <p className="text-sm">{userData.phone}</p>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col items-center gap-2">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`p-2 rounded hover:bg-gray-700 w-full text-center ${pathname === link.path ? 'bg-gray-700' : ''
                }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>


      </aside>
    </>
  );
};

export default SidebarAdmin;
