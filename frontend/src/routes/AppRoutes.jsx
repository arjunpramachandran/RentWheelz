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
import HostOrders from '../pages/Host/HostOrders'
import VehicleLog from '../pages/Host/VehicleLog'
import AdminLayout from '../Layouts/AdminLayout'
import AdminDashboard from '../pages/Admin/AdminDashboard'
import VehicleList from '@/pages/Admin/VehicleList'
import VehicleLogAdmin from '@/pages/Admin/VehicleLogAdmin'
import VehicleUpdateAdmin from '@/pages/Admin/UpdateVehicleAdmin'
import AllOrders from '@/pages/Admin/AllOrders'
import UserReviews from '@/pages/User/UserReview'
import AllHosts from '@/pages/Admin/AllHosts'
import AllPayments from '@/pages/Admin/AllPayments'
import AllCustomers from '@/pages/Admin/AllCustomers'


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
              {path:'my-bookings',element:<MyBookings/>},
              {path:'myReviews',element:<UserReviews/>}
              
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
              { path: 'updateVehicle/:id', element: <VehicleUpdate /> },
              {path:'myOrders' , element:<HostOrders/>},
              {path:'vehicleLog/:id',element:<VehicleLog/>}

            ]
          }
        ]
      },
      {
        path:'admin',
        element:<ProtectedRoute allowedRole="admin"/>,
        children:[
          {
            path:'',
            element:<AdminLayout/>,
            children:[
              {path:'dashboard',element:<AdminDashboard/>},
              {path:'vehicleList', element:<VehicleList/>},
              {path:'addVehicle',element:<AddVehicle/>},
              {path:'updateVehicle/:id',element:<VehicleUpdateAdmin/>},
              {path:'vehicleLog/:id',element:<VehicleLogAdmin/>},
              {path:'allOrders',element:<AllOrders/>},
              {path:'allhosts',element:<AllHosts/>},
              {path:'allPayments', element:<AllPayments/>},
              {path:'updateProfile',element:<UpdateProfile/>},
              {path:'allCustomers',element:<AllCustomers/>}

            ]
          }
        ]
      }
    ],
  },

]);

export default router;



