import React, { useState, useEffect } from 'react';
import instance from '../../../utils/Axios';
import { baseUrl } from '../../../utils/constants';
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
    const [loading, setLoading] = useState(true);
    const [totalBookingCount, setTotalBookingCount] = useState(0);
    const [totalBookingAmount, setTotalBookingAmount] = useState(0);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await instance.get(`${baseUrl}/api/booking/booking-list/`);
                setBookings(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };

        fetchBookings();
    }, []);

    useEffect(() => {
        // Calculate total booking count and total booking amount
        const count = bookings.length;
        const amount = bookings.reduce((total, booking) => total + booking.amount, 0);
        
        setTotalBookingCount(count);
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
                                <TableCell>Booking ID</TableCell>
                                <TableCell>Room</TableCell>
                                <TableCell>Price Per Day</TableCell>
                                {/* Add other header columns */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {bookings.map((booking) => (
                                <TableRow key={booking.id}>
                                    <TableCell>{booking.id}</TableCell>
                                    <TableCell component="th" scope="row">
                                    {booking?.room_title || 'null'}
                                    </TableCell>
                                    <TableCell align="centre">{booking?.price ||'null'}</TableCell>
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




