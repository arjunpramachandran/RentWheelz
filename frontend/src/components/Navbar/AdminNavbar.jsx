
import React, { useState } from 'react'
import { CgProfile } from "react-icons/cg";
import { FiMenu, FiX } from "react-icons/fi";
import { Link } from 'react-router-dom';
import { useSelector ,useDispatch } from 'react-redux';
import { logoutUser } from '../../app/features/user/userSlice';


const list = [
  { name: "Home", link: "/" },
  { name: "About", link: "/about" },
  { name: "Vehicles", link: "/vehicle" },
  { name: "Locations", link: "/locations" },
  { name: "Contact", link: "/contact" }
]
const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
 

  const { isLoggedIn, userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const toggleMobileMenu = () => {
    setMenuOpen(!menuOpen)
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    setIsOpen(false);
    setMenuOpen(false);
  }
  return (

    <nav className='relative rounded-full  shadow-lg z-50 hover:shadow-cyan-600'>
      <div className='flex   justify-between items-center px-4 py-2 md:px-10 text-black'>
        <img src="Logo-New-Trans.png" alt="logo" className='w-20 h-auto' />


        <ul className="hidden lg:flex gap-8 text-[16px] font-Nanum text-teal-700 items-center">
          {list.map((item, index) => (
            <Link key={index} to={item.link} className='relative group cursor-pointer p-2'>
              {item.name}
            </Link>
          ))}
          <Link to="/host/login" className='bg-gradient-to-r from-cyan-500 to-green-400 text-white rounded-full p-2'>
            Host
          </Link>
        </ul>


        <div className="flex items-center gap-4">

          <button className="lg:hidden text-black text-2xl" onClick={toggleMobileMenu}>
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>


          <div className='relative'>
            <button className='w-auto bg-cyan-500 rounded-full' onClick={toggleMenu}>
              {isLoggedIn && userData?.avatar ? (
                <img src={userData.avatar} alt="Profile" className='w-10 h-10 rounded-full' />
              ) : (
                <CgProfile className='text-4xl text-white bg-cyan-500 rounded-full' />
              )}
             
            </button>
            <div
              className={`z-50 font-Montserrat absolute right-0 mt-2 bg-white text-cyan-500 rounded-lg shadow-lg p-4 w-40 
                transition-all duration-300 origin-top transform ${isOpen ? 'scale-y-100' : 'scale-y-0'
                }`}
            >
              <ul className='flex flex-col gap-2 text-sm'>
                {!isLoggedIn ? (
                  <>
                    <Link to='/login' onClick={()=>setIsOpen(false)} className="py-1 px-2 hover:bg-gray-100 rounded">Login</Link>
                    <Link to='/register' onClick={()=>setIsOpen(false)} className="py-1 px-2 hover:bg-gray-100 rounded">Register</Link>
                  </>
                ) : (
                  <>
                    <Link onClick={()=>setIsOpen(false)} className="py-1 px-2 hover:bg-gray-100 rounded">Profile</Link>
                    <Link onClick={()=>setIsOpen(false)} className="py-1 px-2 hover:bg-gray-100 rounded">Settings</Link>
                    <Link onClick={handleLogout} className="py-1 px-2 hover:bg-gray-100 rounded">Logout</Link>
                  </>
                )}
              </ul>
            </div>
          </div>


          <label className="swap swap-rotate">
            <input
              type="checkbox"
              className="theme-controller"
              onChange={(e) =>
                document.documentElement.setAttribute('data-theme', e.target.checked ? 'dark' : 'light')
              }
            />
            <svg
              className="swap-on h-10 w-10 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24">
              <path
                d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>

            {/* moon icon */}
            <svg
              className="swap-off h-10 w-10 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24">
              <path
                d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>
          </label>
        </div>
      </div>



      <div className={`absolute pb-10 border-2 top-full left-0 w-auto h-auto p-10 rounded-b-2xl rounded-tl-4xl bg-white text-cyan-600 ms-2
         flex flex-col items-center justify-center gap-3 text-l lg:hidden transition-all duration-400 origin-top transform ${menuOpen ? 'scale-y-100' : 'scale-y-0'}`}>
        {list.map((item, index) => (
          <Link
            key={index}
            to={item.link}
            onClick={() => setMenuOpen(false)}
            className="hover:text-cyan-600"
          >
            {item.name}
          </Link>
        ))}
        <Link
          to="/host/login"
          onClick={() => setMenuOpen(false) }
          className="bg-gradient-to-r from-cyan-500 to-green-400 text-white rounded-full px-6 py-2 text-lg "
        >
          Host
        </Link>
       
      </div>

    </nav>


  )
}

export default Nav 