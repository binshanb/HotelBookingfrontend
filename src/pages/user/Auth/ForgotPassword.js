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
           <ThemeProvider theme={theme}>
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
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          </Avatar>
          <Typography component="h1" variant="h5" >
            Forgot PassWord
          </Typography>
          <br/><br/>
          <Box component="form" sx={{ mt: 3 }}>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField
                    variant="outlined"
                    label="Enter Phone Number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    fullWidth
                    required
                />
            </Grid>
            <Grid item xs={12}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSendOTP}
                >
                    Send OTP
                </Button>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    variant="outlined"
                    label="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    fullWidth
                    required
                />
            </Grid>
            <Grid item xs={12}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleVerifyOTP}
                >
                    Verify OTP
                </Button>
            </Grid>
       
         
        </Grid>
        </Box>
        </Box>
        </Container>
        <ToastContainer 
          position="bottom-right"
          autoClose={6000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
        />
        </ThemeProvider>
        </>
    );
};

export default ForgotPassword;