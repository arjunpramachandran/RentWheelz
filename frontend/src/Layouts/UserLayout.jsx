// src/Layouts/HostLayout.jsx
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import SidebarUser from '../components/user/SideBarUser';
import { useSelector } from 'react-redux';



const UserLayout = () => {
  const { userData, isLoggedIn } = useSelector((state) => state.user);
  

  const [isMobile, setIsMobile] = useState(window.innerWidth < 860);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 860);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!userData || !userData._id) {
    return <div className="flex items-center justify-center h-screen text-xl">Loading...</div>;
  }

  if (!isLoggedIn || userData.role !== 'customer') {
    return <div className="flex items-center justify-center h-screen text-xl">Access Denied</div>;
  }

  return (
    <div className="flex min-h-screen ">
    
      {!isMobile && (
        <div className="w-64 flex-shrink-0">
          <SidebarUser />
        </div>
      )}

    
      {isMobile && <SidebarUser />}

      
      <div className="flex-1 flex flex-col overflow-y-auto bg-gray-50">
       
        <header className="p-4 shadow bg-white">
          <h1 className="text-xl font-semibold">Welcome, {userData?.name?.toUpperCase()}</h1>
        </header>

       
        <main className="p-6 flex-1 overflow-y-auto">
          
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
