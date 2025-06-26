// src/Layouts/HostLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarHost from '../components/Host/SidebarHost';

import { useSelector } from 'react-redux';


const HostLayout = () => {
  const { userData, isLoggedIn } = useSelector((state) => state.user);
  if (!isLoggedIn || userData.role !== 'host') {
    return <div className="flex items-center justify-center h-screen">Access Denied</div>;
  }
  if (!userData || !userData._id) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      <SidebarHost />
      <div className="flex-1 flex flex-col">
        
        <main className="p-4 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default HostLayout;
