import React, { useState, useEffect } from 'react';
import instance from '../../../utils/Axios';

import {
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
} from '@mui/material';

const BookingReport = () => {
    // const [bookings,setBookings] = useState(null)
    // const [totalBookingCount, setTotalBookingCount] = useState(0);
    // const [totalBookingAmount, setTotalBookingAmount] = useState(0);
    const [categoryData, setCategoryData] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await instance.get('/api/booking/admin/booking-report/'); // Replace with your API endpoint
          setCategoryData(response.data.categoryData);
        } catch (error) {
          console.error('Error fetching booking report data:', error);
        }
      };
  
      fetchData();
    }, []);

    // useEffect(() => {
    //     // Calculate total booking count and total booking amount
    //     const count = bookings.length;
    //     setTotalBookingCount(count);


    //     const amount = bookings.reduce((total, booking) => {
    //       return total + booking.total_amount;
    //        }, 0);

    //     setTotalBookingAmount(amount);
    
    // }, [bookings]);

    return (
              <div className='booking-report'>
                <Typography variant="h4" gutterBottom>Booking Report</Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">Room Category</TableCell>
                        <TableCell align="center">Total Bookings</TableCell>
                        <TableCell align="center">Total Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                    {categoryData && categoryData.length > 0 ? (
                    categoryData.map((category) => (
                 <TableRow key={category.room__category__category_name}>
                   <TableCell align="center">{category.room__category__category_name}</TableCell>
                  <TableCell align="center">{category.booking_count}</TableCell>
                   <TableCell align="center">{category.total_amount}</TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={3} align="center">No data available</TableCell>
    </TableRow>
  )}
</TableBody>
                  </Table>
                </TableContainer>
              </div>
            );
          };
          
          export default BookingReport;




