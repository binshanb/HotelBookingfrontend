import React, { useState, useEffect } from 'react';
import adminInstance from '../../../utils/Axios';
import instance from '../../../utils/Axios';
import { useSelector } from 'react-redux';
import AdminBookingStatusChange from './AdminBookingStatusChange';
import {
  Box,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  FormControl,
  Select,
  MenuItem,
  Button,
} from '@mui/material';

import { baseUrl } from '../../../utils/constants';

const BookingsList = () => {
  // const [bookings, setBookings] = useState([]);
  // const bookingData = useSelector((state) => state.booking.bookingInfo);
 
  const [roomBookings, setRoomBookings] = useState([]);

  useEffect(() => {
    const fetchRoomBookings = async () => {
      try {
        const response = await instance.get(`${baseUrl}/api/booking/booking-list/`);
        setRoomBookings(response.data);
      } catch (error) {
        console.error('Error fetching room bookings:', error);
      }
    };

    fetchRoomBookings();
  }, []);   

  // const handleCancel = async (bookingId) => {
  //   try {
  //     await instance.delete(`${baseUrl}/api/booking/roombooking-page/${bookingId}/cancel-booking`);
  //     setBookings(bookings.filter((booking) => booking.id !== bookingId));
  //   } catch (error) {
  //     console.error('Error canceling booking:', error);
  //   }
  // };

 


const handleCheckout = async () => {
  try {
    const response = await adminInstance.put(`${baseUrl}/api/booking/admin/room-checkout/${roomBookings.id}/`, {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newStatus: 'completed' }), // Change the status value as needed
    });

    if (response.ok) {

      alert("Successfully Checked Out")
      // Status updated successfully in the backend, update frontend state
      const updatedStatus = 'completed'; // Get the updated status from the response
      // Update your React state or Redux store with the updatedStatus
      // This update will reflect the new status in your UI
    } else {
      // Handle error scenario
      console.error('Failed to update status:', response.statusText);
    }
  } catch (error) {
    console.error('Error updating status:', error);
  }
};


  return (
    <Box p={4}>
    <Typography variant="h4" mb={4}>
      Booking List
    </Typography>
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Booking ID</TableCell>
            <TableCell>Room</TableCell>
            <TableCell>Booked by</TableCell>
            <TableCell>Check-in</TableCell>
            <TableCell>Check-out</TableCell>
            <TableCell>Booking Status</TableCell>
            <TableCell>Current Status</TableCell>
            {/* <TableCell>Room Name</TableCell>
            <TableCell>User Email</TableCell> */}
            {/* <TableCell>Action</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
        {roomBookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>{booking.id}</TableCell>
              <TableCell>{booking.room_title || 'N/A'}</TableCell>  
              <TableCell>{booking.user_email || 'N/A'}</TableCell>     
              
              <TableCell>{booking.check_in}</TableCell>
              <TableCell>{booking.check_out}</TableCell>
              <TableCell>
        <AdminBookingStatusChange
          bookingId={booking.id}
          initialStatus={booking.booking_status}
        />
      </TableCell>
      <TableCell>{booking.booking_status}</TableCell>
              {/* <TableCell>{booking.room.title}</TableCell>
              <TableCell>{booking.user.email}</TableCell> */}
              <TableCell>
              {booking.booking_status === 'completed' ? (
                  'Checked Out'
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleCheckout(booking.id)}
                    disabled={booking.booking_status === 'completed'} // Disable button if already completed
                  >
                    Checkout
                  </Button>
                )}
           
                </TableCell>
              {/* <TableCell>
                <IconButton
                  color="secondary"
                  aria-label="Cancel Booking"
                  onClick={() => handleCancel(booking.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
  );
};

export default BookingsList;

