import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';
// import Link from '@mui/material/Link';
// import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {useNavigate } from 'react-router-dom';
// import {useDispatch ,useSelector} from 'react-redux'
// import axios from '../../Utils/axios'
// import jwt_decode from 'jwt-decode'
// import { userLoginUrl } from '../../Utils/urls';
// import { userLogin } from '../../../Redux/slices/userSlice/authSlice';

// import { GoogleLogin } from '@react-oauth/google';
// import { googleLogout, useGoogleLogin } from '@react-oauth/google';
// import { display } from '@mui/system';
import instance from '../../../utils/Axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const defaultTheme = createTheme();

const EmailVerification = () => {

const [timer, setTimer] = useState(100);
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const email = localStorage.getItem('randomUserEmail')


  

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timer === 0) {
        const verificationFailFunction = async()=>{
            await instance.post('/api/user/verify-email-fail/',{email})
            .then((response)=>{
                console.log(response.data)
            })
        }
      // toast.error('Verification Failed! Please Try Again.');
      navigate('/signup'); 
      verificationFailFunction()

    }
  }, [timer]);



  const verifyOtpSuccess = async () => {
    try {
      const response = await instance.post('/api/user/verify-email/', { email, otp });
  
      if (response.status === 200) {
        console.log(response.data, 'responseeeeeee');
        toast.success('The user details have been updated.', {
          position: toast.POSITION.TOP_RIGHT,
        });
        navigate('/login');
      } else {
        // Handle other possible success statuses if needed
        toast.error('Verification Failed! Please Try Again.');
      }
    } catch (error) {
      // Log detailed error information for debugging purposes
      console.error('Error in verifyOtpSuccess:', error.response || error);
  
      toast.error('Verification Failed! Please Try Again.');
    }
  };
  

  const handleSubmit = () => {
    verifyOtpSuccess()
    

  }

  return (
    <div className="container">
        <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Verify OTP
          </Typography>
          <Typography component="h1" variant="h6">
            {/* {email} */}
          </Typography>
         <strong>Time remaining: {timer} seconds </strong> 

          <Box component="form"  noValidate  onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="otp"
              label="Enter your otp"
              name="otp"
              autoComplete="otp"
              value={otp}
              onChange={(e)=>{
                setOtp(e.target.value)
              }}
              autoFocus
            />
   
           
            <Button
              type="submit"
              fullWidth
              variant="contained"
              // onClick={()=>handleSubmit()}
              sx={{ mt: 3, mb: 2 }}
            >
                Submit Otp
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
    </div>
  );
};

export default EmailVerification;