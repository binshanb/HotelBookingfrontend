import React, { useState } from 'react';
import { Grid, TextField, Button} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import instance from "../../../utils/Axios"
import { baseUrl } from '../../../utils/constants';
import {useNavigate} from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import profileImg from '../../../assets/profile-img.jpg';



const theme = createTheme();
const ForgotPassword = () => {
    const navigate = useNavigate();
    const [mobileNumber, setMobileNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSendOTP = async () => {
        try {
            const response = await instance.post(`${baseUrl}/api/forgot-password/`, {
                phone_number: mobileNumber,
            });

            if (response.data && response.data.message) {
                setSuccessMessage(response.data.message);
            }
        } catch (error) {
            setError('Failed to send OTP.');
        }
    };

    const handleVerifyOTP = async () => {
        try {
            const response = await instance.post(`${baseUrl}/api/forgot-password-otp/`, {
                phone_number: mobileNumber,
                otp: otp,
            });

            if (response.data && response.data.message) {
                
                toast.success(response.data.message,"Please Reset Password");
                navigate('/change-password')
            }
        } catch (error) {
            setError('Invalid OTP.');
            toast.error('Invalid OTP.');
        }
    };

    const handleCloseToast = () => {
        toast.dismiss();
      };

      return (
        <>
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
           
            <div className="bg-white p-8 mt-5  rounded shadow-md max-w-md w-full">

              <div className="text-center mb-4">
              
                <img src={profileImg} alt="Profile Image" className="rounded-full w-40 h-40 mb-4 mx-auto md:mx-0" />
            
                <h1 className="text-2xl font-bold">Forgot Password</h1>
              </div>
              <form>
                <div className="mb-4">
                  <input
                    type="text"
                    className="border rounded w-full p-2"
                    placeholder="Enter Phone Number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <button
                    type="button"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
                    onClick={handleSendOTP}
                  >
                    Send OTP
                  </button>
                </div>
                <div className="mb-4">
                  <input
                    type="text"
                    className="border rounded w-full p-2"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <button
                    type="button"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
                    onClick={handleVerifyOTP}
                  >
                    Verify OTP
                  </button>
                </div>
              </form>
            </div>
            
          </div>
          <ToastContainer
            position="bottom-right"
            autoClose={6000}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
          />
          <br/><br/>
        </>
      );
    };

export default ForgotPassword;