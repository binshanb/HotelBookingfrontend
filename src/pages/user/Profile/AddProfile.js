import React, { useState,useEffect } from 'react';

import jwtDecode from 'jwt-decode';
import { useSelector } from 'react-redux';
import instance from '../../../utils/Axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const AddProfile = () => {
  
  const userInfos = useSelector((state) => state.auth.userInfo);
  const [decodedUserInfo, setDecodedUserInfo] = useState({});
  const [formData, setFormData] = useState({
    user:decodedUserInfo.user_id,
    name: '',
    address: '',
    city: '',
    state: '',
    country: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async () => {
    try {
      await instance.post('/api/user/add-profile/', formData);
      toast.success('Profile Details Added Successfully!!');
    } catch (error) {
      toast.error('Error adding user details');
      console.error('Error adding profile details', error);
    }
  };
  useEffect(() => {
    console.log('decodedUserInfo:', decodedUserInfo); // Log decodedUserInfo
    if (decodedUserInfo && decodedUserInfo.user_id) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        user: decodedUserInfo.user_id,
      }));
    }
  }, [decodedUserInfo]);
  useEffect(() => {
    if (userInfos) {
      // Decode the token and set the user info state
      const decodedInfo = jwtDecode(userInfos.access); // Assuming 'access' contains user details
      setDecodedUserInfo(decodedInfo);
    }},[]);
    const showToast = (message, type = 'error') => {
      toast[type](message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    };
  

  return (
<div className="flex justify-center items-center min-h-screen bg-gray-100 p-8">
  <div className="max-w-md w-full bg-white p-4 shadow-md rounded-md">
    <h1 className="text-2xl font-semibold mb-6">Add Profile Information</h1>
    <form onSubmit={handleSubmit}>

          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-600">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium text-gray-600">
              Address
            </label>
            <input
              type="text"
              id="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="city" className="block text-sm font-medium text-gray-600">
              City
            </label>
            <input
              type="text"
              id="city"
              value={formData.city}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="state" className="block text-sm font-medium text-gray-600">
              State
            </label>
            <input
              type="text"
              id="state"
              value={formData.state}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="country" className="block text-sm font-medium text-gray-600">
              Country
            </label>
            <input
              type="text"
              id="country"
              value={formData.country}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>

        

          <button
            type="submit"
            variant="contained"
            color="primary"
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProfile;
