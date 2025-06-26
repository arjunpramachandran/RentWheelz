import React from 'react'
import { createBrowserRouter, Route, Routes } from 'react-router-dom'
import RootLayout from '../Layouts/RootLayout'
import HostLayout from '../Layouts/hostLayout'
import UserLayout from '../Layouts/UserLayout'
import Home from '../pages/Home'
import Contact from '../pages/Contact'
import Vehicles from '../pages/Vehicles'
import Login from '../pages/Login'
import Register from '../pages/Register'
import About from '../pages/About'
import Locations from '../pages/Locations'

import ProtectedRoute from '../Layouts/ProtectedRoute'



import UserBooking from '../pages/User/UserBookings'
import UserDashboard from '../pages/User/UserDashboard'


import Dashboard from '../pages/Host/Dashboard'
import HostRegister from '../pages/Host/HostRegister'
import LoginHost from '../pages/Host/LoginHost'
import AddVehicle from '../pages/Host/AddVehicle'
import MyVehicles from '../pages/Host/MyVehicle'
import VehicleDetailsPage from '../pages/VehicleDetailsPage'
import VehicleBooking from '../pages/User/VehicleBooking'
import UpdateProfile from '../pages/User/UpdateProfile'
import UpdateProfileHost from '../pages/Host/UpdateProfile_Host'
import VehicleUpdate from '../pages/Host/UpdateVehicle'
import PaymentSuccess from '../pages/User/PaymentSuccess'
import MyBookings from '../pages/User/MyBookings'


const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { path: '', element: <Home /> },
      { path: 'contact', element: <Contact /> },
      { path: 'about', element: <About /> },
      { path: 'vehicle', element: <Vehicles /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'locations', element: <Locations /> },
      { path: 'vehicle/:id', element: <VehicleDetailsPage /> },
      {
        path: "user",
        element: <ProtectedRoute allowedRole="customer" />,

        children: [
          {
            path: '',
            element: <UserLayout />,
            children: [
              { path: 'userDashboard', element: <UserDashboard /> },
              { path: 'updateProfile', element: <UpdateProfile /> },
              { path: 'userBooking', element: <UserBooking /> },
              { path: 'vehicleBooking/:id', element: <VehicleBooking /> },
              { path: 'payment-success', element: <PaymentSuccess /> },
              {path:'my-bookings',element:<MyBookings/>}
            ]


          }
        ]
      },

      {
        path: 'host/login',
        element: <LoginHost />,
      },
      {
        path: 'host/register',
        element: <HostRegister />,
      },


      {
        path: 'host',
        element: <ProtectedRoute allowedRole="host" />,
        children: [
          {
            path: '',
            element: <HostLayout />,
            children: [
              { path: "dashboard", element: <Dashboard /> },
              { path: 'add-vehicle', element: <AddVehicle /> },
              { path: 'my-Vehicle', element: <MyVehicles /> },
              { path: 'updateProfile', element: <UpdateProfileHost /> },
              { path: 'updateVehicle/:id', element: <VehicleUpdate /> }

            ]
          }
        ]
      }
    ],
  },

]);

export default router;



