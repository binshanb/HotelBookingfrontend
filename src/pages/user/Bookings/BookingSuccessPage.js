import React from 'react';
import { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import instance from '../../../utils/Axios';

import {
  Box,
  Typography,
  Divider,
  Button,
  Container,
} from '@mui/material';

import { Link } from 'react-router-dom'; 
import { useSelector } from 'react-redux';
const BookingSuccessPage = () => {

  const {bookingId} = useParams();
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await instance.get(`/api/booking/booking-success/${bookingId}/`);
        console.log(response.data,"dataresponsee");
        
        setBookingData(response.data);

      } catch (error) {
        console.error('Error fetching booking data:', error);
      }
    };
  
    fetchBookingData();
  }, [bookingId]);


  return (
    <Container maxWidth="sm">
      <Box p={6}>
        <Typography variant="h4" align="center">
          Booking Successful!
        </Typography>
        <Divider />
        <Typography variant="body1" align="center" mt={2}>
          Thank you for your booking. Your booking ID is: {bookingId}
        </Typography>
        <Typography variant="body1" align="center" mt={2}>
          Your room has been successfully booked. We hope you enjoy your stay!
        </Typography>
        {/* Add more details or options/buttons as needed */}
        <Box mt={4} display="flex" justifyContent="center">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Button variant="contained" color="primary">
              Back to Home
            </Button>
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default BookingSuccessPage;

