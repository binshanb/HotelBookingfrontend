import React, { useState, useEffect } from 'react';
import instance from '../../../utils/Axios';
import { useParams } from 'react-router-dom';
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
    const [bookings, setBookings] = useState([]);
    console.log(bookings,"bookinfffffff");
    const [loading, setLoading] = useState(true);
    const [totalBookingCount, setTotalBookingCount] = useState(0);
    const [totalBookingAmount, setTotalBookingAmount] = useState(0);

    const { bookingId } = useParams();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await instance.get('/api/booking/booking-list/');
                console.log(response.data,"responseeeeeeeeeee");
                setBookings(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };

        fetchBookings();
    }, []);
    // useEffect(() => {
    //     const fetchTotalAmount = async () => {
    //         try {
    //             const response = await instance.get('/api/booking/booking-details/');
    //             setTotalAmount(response.data);
    //             setLoading(false);
    //         } catch (error) {
    //             console.error('Error fetching total amount:', error);
    //             setLoading(false);
    //         }
    //     };

    //     fetchTotalAmount();
    // }, [bookingId]);

    useEffect(() => {
        // Calculate total booking count and total booking amount
        const count = bookings.length;
        setTotalBookingCount(count);


        const amount = bookings.reduce((total, booking) => {
          return total + booking.total_amount;
           }, 0);

        setTotalBookingAmount(amount);
    
    }, [bookings]);

    return (
        <div>
            <Typography variant="h4" gutterBottom>Booking Report</Typography>
            {loading ? (
                <CircularProgress />
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Booking ID</TableCell>
                                <TableCell align="center">Room</TableCell>
                                <TableCell align="center">Price Per Day</TableCell>
                                {/* Add other header columns */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {bookings.map((booking) => (
                                <TableRow key={booking.id}>
                                    <TableCell align="center">{booking.id}</TableCell>
                                    <TableCell align="center" component="th" scope="row">
                                    {booking?.room_title || 'null'}
                                    </TableCell>
                                    <TableCell align="center">{booking?.total_amount ||'null'}</TableCell>
                                    {/* Display other booking details */}
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan="3">Total Bookings: {totalBookingCount}</TableCell>
                                <TableCell colSpan="3">Total Amount: ${totalBookingAmount}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </div>
    );
};

export default BookingReport;




