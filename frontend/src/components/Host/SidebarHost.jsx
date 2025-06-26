import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { MdSpaceDashboard } from "react-icons/md";
import { RiCloseCircleFill } from "react-icons/ri";
import { useSelector } from 'react-redux';
import { TbEdit } from 'react-icons/tb';

const links = [
  { name: 'My Vehicles', path: '/host/my-vehicle' },
  { name: 'Add Vehicle', path: '/host/add-vehicle' },
  { name: 'Orders', path: '' },
  { name: 'Payments', path: '/reviews' },
];

const SidebarUser = () => {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 860);
  const { userData, isLoggedIn } = useSelector((state) => state.user)

  const handleResize = () => {
    setIsMobile(window.innerWidth < 860);
    if (window.innerWidth >= 860) setIsOpen(false); // Reset on desktop
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const navigate = useNavigate()
  const toggleMenu = () => setIsOpen(!isOpen);
  const updateProfile = () => {
    setIsOpen(!isOpen);
    navigate('/host/updateProfile')
  }

  return (
    <>

      {isMobile && (
        <button
          className="fixed top-10 left-30 z-50 text-cyan-600 text-3xl"
          onClick={toggleMenu}
        >
          {isOpen ? <RiCloseCircleFill /> : <MdSpaceDashboard />}
        </button>
      )}


      <aside
        className={` top-[24] left-0 h-full bg-gray-800 text-white  p-4 z-40 transition-transform duration-300 ${isMobile
          ? isOpen
            ? 'translate-x-0 w-64 fixed'
            : '-translate-x-full w-64 fixed'
          : 'translate-x-0 w-64 '
          }`}
      >
        <div className='flex flex-col font-Montserrat mb-4  items-center border-b-2 p-2  gap-1 relative'>
          <img src={userData.profilepic} className='rounded-full w-50 h-50 object-cover item-center mb-4  ' alt={userData.name} />
          <button onClick={updateProfile} className='btn btn-circle absolute right-5 top-43'><TbEdit className='text-2xl' /></button>
          <h3>{userData.name.toUpperCase()}</h3>
          <p className='text-sm'>{userData.email}</p>
          <p className='text-sm'>{userData.phone}</p>

        </div>

        <nav className="flex flex-col  items-center">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => isMobile && setIsOpen(false)}
              className={`p-2 rounded hover:bg-gray-700 ${pathname === link.path ? 'bg-gray-700' : ''
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

export default SidebarUser;
