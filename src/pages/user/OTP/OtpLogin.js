import React, { useState } from 'react';
import instance from '../../../utils/Axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../../redux/slices/userslices/authSlice';

const OTPLogin = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  

  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };

  const handleOtpChange = (event) => {
    setOtp(event.target.value);
  };

  const handleSendOTP = async () => {
    try {
      const response = await instance.post('/api/sent-otp/', { phone_number: phone });
      if (response.status === 200) {
        toast.success('OTP sent successfully.');
      }
    } catch (error) {
      toast.error('Error sending OTP. Please try again.');
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await instance.post('/api/verify-otp/', { phone_number: phone, otp: otp });
      if (response.status === 200) {
        toast.success('OTP verification successful. User logged in.');
        dispatch(setCredentials(true));
        navigate('/')
        // Redirect user or perform further actions upon successful login
      }
    } catch (error) {
      toast.error('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="max-w-md w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h1 className="text-2xl mb-4">OTP Login</h1>
        <input
          type="text"
          placeholder="Enter Phone Number"
          value={phone}
          onChange={handlePhoneChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <button
          onClick={handleSendOTP}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Send OTP
        </button>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={handleOtpChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 mt-4 mb-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <button
          onClick={handleVerifyOTP}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Verify OTP
        </button>
        <p className="text-red-500 mt-2">{message}</p>
      </div>
    </div>
  );
};

export default OTPLogin;


