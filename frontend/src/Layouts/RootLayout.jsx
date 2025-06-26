import React from 'react'
import Nav from '../components/Navbar/Nav'
import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { api } from '../config/axiosinstance'
import { logoutUser, saveUser } from '../app/features/user/userSlice'




const RootLayout = () => {
  const dispatch = useDispatch()
  useEffect(()=>{
    const checkAuth = async ()=>{
      try {
        const res = await api.get('user/checkUser');
        dispatch(saveUser(res.data.user))
      } catch (error) {
        dispatch(logoutUser())
      }
    };


    checkAuth()
  },[dispatch])
  return (
    <div className='min-h-screen   flex flex-col'>
     
        <Nav />
     

      <main className='pt-24  flex-grow'>
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default RootLayout