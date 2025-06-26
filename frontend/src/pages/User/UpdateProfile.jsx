import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { api } from '../../config/axiosinstance';
import { useDispatch, useSelector } from 'react-redux';
import { saveUser } from '../../app/features/user/userSlice';


const UpdateProfile = () => {
  const { userData } = useSelector((state) => state.user)


  const [profilePreview, setProfilePreview] = useState(null);
  const [licensePreview, setLicensePreview] = useState(null);
  const [addressPreview, setAddressPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  
  const [isLoadingPass, setIsLoadingPass] = useState(false);
  const [errorPass, setErrorPass] = useState(null);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      formik.setFieldValue(field, file);

      // Show preview
      if (field === 'profilepic') {
        const reader = new FileReader();
        reader.onloadend = () => setProfilePreview(reader.result);
        reader.readAsDataURL(file);
      }
      else if (field === 'licenseProof') {
        const reader = new FileReader();
        reader.onloadend = () => setLicensePreview(reader.result);
        reader.readAsDataURL(file);
      } else if (field === 'addressProof') {
        const reader = new FileReader();
        reader.onloadend = () => setAddressPreview(reader.result);
        reader.readAsDataURL(file);
      }
    }
  };
  const handleSubmit = async (values) => {
    try {
      setIsLoading(true);
      const formData = new FormData();

      //  text fields
      formData.append('name', values.name);

      formData.append('phone', values.phone);

      formData.append('licenseNumber', values.licenseNumber);
      formData.append('addressProofId', values.addressProofId);

      formData.append('oldpassword', values.oldpassword)
      formData.append('newpassword', values.newpassword)
      formData.append('confirmpassword', values.confirmpassword)
      //  file fields

      if (values.profilepic) {
        formData.append('profilepic', values.profilepic);
      }
      if (values.licenseProof) {
        formData.append('licenseProof', values.licenseProof);
      }
      if (values.addressProof) {
        formData.append('addressProof', values.addressProof);
      }



      const res = await api({
        method: "PATCH",
        url: "/user/update",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true
      });
      alert('Profile Updated Successfully!');
      console.log('Response:', res.data);
      dispatch(saveUser(res.data?.updatedUser))
      if (userData.role === 'host') {
        navigate('/host/dashboard');
      } else if (userData.role === 'admin') {
        navigate('/admin/adminDashboard');
      } else {
        navigate('/user/userDashboard');
      }

    } catch (error) {
      console.error(error.response?.data || error.message);
      setError(error.response?.data?.error || 'Update Failed');

    } finally {
      setIsLoading(false)
    }

  }


  const handlePass = async(values)=>{
    try {
      
      setIsLoadingPass(true)
     
      
       const res = await api({
        method: "PATCH",
        url: "/user/updatePassword",
        data: values,
        
        withCredentials: true
      });

      alert("password updated successfully")
      if (userData.role === 'host') {
        navigate('/host/dashboard');
      } else if (userData.role === 'admin') {
        navigate('/admin/adminDashboard');
      } else {
        navigate('/user/userDashboard');
      }

    } catch (error) {
      console.log(error.response?.data || error.message);
      setErrorPass(error.response?.data?.error || 'Password Update Failed');
    } finally {
      setIsLoadingPass(false)
    }

  }
  const formik = useFormik({
    initialValues: {
      name: userData?.name || '',

      phone: userData?.phone || '',
      role: userData?.role || 'customer',
      licenseNumber: userData?.licenseNumber || '',
      addressProofId: userData?.addressProofId || '',
      profilepic: '',
      licenseProof: '',
      addressProof: '',
    },

    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),

      phone: Yup.string()
        .required('Phone number is required')
        .matches(/^\d{10}$/, 'Phone number must be 10 digits'),
      role: Yup.string().oneOf(['customer', 'host', 'admin']).required(),


    }),
    onSubmit: handleSubmit,



  });

  const passformik = useFormik({
    initialValues: {
      oldpassword: '',
      newpassword: '',
      confirmpassword: ''

    },
    validationSchema: Yup.object({
      oldpassword: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .max(128, 'Password must be less than 128 characters')
        .required('Password is required'),
      newpassword:Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .max(128, 'Password must be less than 128 characters')
        .required('Password is required'),
      confirmpassword: Yup.string()
        .oneOf([Yup.ref('newpassword')], 'Passwords must match')
        .required('Confirm password is required'),
    }),
    validateOnChange:true,

    onSubmit:(values)=>{handlePass(values)}
  })



  return (
    <div className='flex sm:flex-row gap-3 justify-center'>
      <div className="w-auto  bg-white shadow-md rounded-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Update Your Account</h2>
        <div className="space-y-4">
          <form onSubmit={formik.handleSubmit} className="space-y-4 ">
            <div className='md:flex gap-4'>
              <div className='flex-1 gap-4 space-y-4'>
                <div>
                  <label className="block text-sm font-medium">Name</label>
                  <input
                    name="name"
                    className="input"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className="text-red-500 text-sm">{formik.errors.name}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium">Phone</label>
                  <input
                    name="phone"
                    type="tel"
                    className="input"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.phone}
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <p className="text-red-500 text-sm">{formik.errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium">License Number</label>
                  <input
                    name="licenseNumber"
                    className="input"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.licenseNumber}
                  />
                  {formik.touched.licenseNumber && formik.errors.licenseNumber && (
                    <p className="text-red-500 text-sm">{formik.errors.licenseNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium">Address Proof ID</label>
                  <input
                    name="addressProofId"
                    className="input"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.addressProofId}
                  />
                  {formik.touched.addressProofId && formik.errors.addressProofId && (
                    <p className="text-red-500 text-sm">{formik.errors.addressProofId}</p>
                  )}
                </div>



              </div>

              <div className='flex-1 space-y-4'>
                {/* Profile pic */}
                <div>
                  <label className="block text-sm font-medium mb-1">Profile Picture</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'profilepic')}
                    className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0 file:text-sm file:font-semibold
                   file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                  />
                  {profilePreview && (
                    <img
                      src={profilePreview}
                      alt="Preview"
                      className="mt-2 w-32 h-32 rounded-full object-cover shadow border"
                    />
                  )}
                </div>

                {/* Address Proof */}

                <div>
                  <label className="block text-sm font-medium mb-1">Address Proof</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'addressProof')}
                    className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0 file:text-sm file:font-semibold
                   file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                  />
                  {addressPreview && (
                    <img
                      src={addressPreview}
                      alt="Preview"
                      className="mt-2 w-32 h-32 rounded-full object-cover shadow border"
                    />
                  )}
                </div>



                {/* License Proof */}

                <div>
                  <label className="block text-sm font-medium mb-1">License Proof</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'licenseProof')}
                    className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0 file:text-sm file:font-semibold
                   file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                  />
                  {licensePreview && (
                    <img
                      src={licensePreview}
                      alt="Preview"
                      className="mt-2 w-32 h-32 rounded-full object-cover shadow border"
                    />
                  )}
                </div>



              </div>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-1/2 bg-cyan-600 text-white py-2 rounded-md ${isLoading ? 'bg-cyan-400 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-700'
                  } flex items-center justify-center gap-2`}
              >
                {isLoading && (<span className="loading loading-ring loading-xl"></span>)}

                {isLoading ? 'Updating...' : 'Update Profile'}
              </button>

            </div>
            {error && (
              <p className="text-red-500 text-sm text-center mt-2">{error}</p>
            )}

          </form>
        </div>
      </div>
      <form onSubmit={passformik.handleSubmit} className="w-auto gap-3 bg-white shadow-md rounded-xl p-8 flex flex-col justify-center items-center">
        <h6 className="text-l font-bold text-center mb-6 text-gray-800">Update Password</h6>
        <div>
          <label className="block text-sm font-medium">Old Password</label>
          <input
            name="oldpassword"
            type="password"
            className="input"
            onChange={passformik.handleChange}
            onBlur={passformik.handleBlur}
            value={passformik.values.oldpassword}
          />
          {passformik.touched.oldpassword && passformik.errors.oldpassword && (
            <p className="text-red-500 text-sm">{passformik.errors.oldpassword}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">New Password</label>
          <input
            name="newpassword"
            type="password"
            className="input"
            onChange={passformik.handleChange}
            onBlur={passformik.handleBlur}
            value={passformik.values.newpassword}
          />
          {passformik.touched.newpassword && passformik.errors.newpassword && (
            <p className="text-red-500 text-sm">{passformik.errors.newpassword}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Confirm Password</label>
          <input
            name="confirmpassword"
            type="password"
            className="input"
            onChange={passformik.handleChange}
            onBlur={passformik.handleBlur}
            value={passformik.values.confirmpassword}
          />
          {passformik.touched.confirmpassword && passformik.errors.confirmpassword && (
            <p className="text-red-500 text-sm">{passformik.errors.confirmpassword}</p>
          )}
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isLoadingPass}
            className={`w-auto bg-cyan-600 text-white py-2 p-3 rounded-md ${isLoading ? 'bg-cyan-400 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-700'
              } flex items-center justify-center gap-2`}
          >
            {isLoadingPass && (<span className="loading loading-ring loading-xl"></span>)}

            {isLoadingPass ? 'Updating...' : 'Update Password'}
          </button>

        </div>
        {errorPass && (
          <p className="text-red-500 text-sm text-center mt-2">{errorPass}</p>
        )}
      </form>
    </div>


  );
};

export default UpdateProfile;
