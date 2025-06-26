import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import Loader from '../components/Loader';

const ProtectedRoute = ({allowedRole,children}) => {
  const {userData,isLoggedIn,authChecked} = useSelector((state) => state.user);
 
if (!authChecked) {
    return <Loader/>
  }

 if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (allowedRole && userData.role !== allowedRole) {
    return <Navigate to="/" />;
  }


  return <Outlet />;
};

export default ProtectedRoute;