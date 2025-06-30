// src/Layouts/HostLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';


import { useSelector } from 'react-redux';
import SidebarAdmin from '../components/Admin/SidebarAdmin';


const AdminLayout = () => {
  const { userData, isLoggedIn } = useSelector((state) => state.user);
  if (!isLoggedIn || userData.role !== 'admin') {
    return <div className="flex items-center justify-center h-screen">Access Denied</div>;
  }
  if (!userData || !userData._id) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      <SidebarAdmin />
      <div className="flex-1 flex flex-col">
        
        <main className="p-4 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
