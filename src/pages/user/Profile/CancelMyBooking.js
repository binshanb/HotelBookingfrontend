import React from 'react';
import { Button } from '@mui/material';
import axios from 'axios';
import { baseUrl } from '../../../utils/constants';
import { useSnackbar } from 'notistack';

const CancelMyBooking = ({ bookingId, onCancel }) => {
  const { enqueueSnackbar } = useSnackbar();

  const cancelBooking = async () => {
    try {
      await axios.delete(`${baseUrl}/api/booking/roombooking-page/${bookingId}/cancel/`);
      enqueueSnackbar('Booking canceled successfully!', { variant: 'success' });
      onCancel(bookingId); // Update UI after cancellation
    } catch (error) {
      console.error('Error canceling booking:', error);
      enqueueSnackbar('An error occurred while canceling the booking.', { variant: 'error' });
    }
  };
  return (
    <Button variant="contained" color="error" onClick={cancelBooking}>
      Cancel Booking
    </Button>
  );
};

export default CancelMyBooking;