  import React, { useState, useEffect } from 'react';
  import { Typography, Table, TableBody, TableCell, Button, TableContainer, TableHead, TableRow, Paper, makeStyles } from '@material-ui/core';
  import instance from '../../../utils/Axios';
  import { baseUrl } from '../../../utils/constants';
  import { useSelector } from 'react-redux';
  import jwtDecode from 'jwt-decode';
  import Dialog from '@material-ui/core/Dialog';
  import DialogTitle from '@material-ui/core/DialogTitle';
  import DialogContent from '@material-ui/core/DialogContent';
  import DialogActions from '@material-ui/core/DialogActions';

  const useStyles = makeStyles((theme) => ({
    root: {
      maxWidth: 8000,
      margin: 'auto',
      padding: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
  }));

    

    
    
  const MyBookings = () => {
    const classes = useStyles();
    const [roomBookings,setRoomBookings] = useState([])
    console.log(roomBookings,"bkkkkkkkkkkkkkkkkkkkkk");
    const userInfo = useSelector((state) => state.auth.userInfo);
    console.log(userInfo,"daatttttttttttttttttttttt");
    const [decodedUserInfo, setDecodedUserInfo] = useState({});
    console.log(decodedUserInfo,"klllllllllllllllllllllll");
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    
    console.log(selectedBookingId,"kllllllllllll");
    const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
    const [cancellationReason, setCancellationReason] = useState('');

    const handleDialogClose = () => {
      setOpenConfirmationDialog(false);
    };
    const handleCancel = async () => {
      try {
        const response = await instance.post(`/api/booking/cancel-booking/${selectedBookingId}/`, {
          cancellation_reason: cancellationReason,
          user : decodedUserInfo.user_id
        });
        console.log(response.data);
        // Call the function to update frontend logic after cancellation
        // ... (update the booking status or other UI changes)
        setRoomBookings(prevBookings =>
          prevBookings.map(booking =>
            booking.id === selectedBookingId ? { ...booking, booking_status: 'cancelled' } : booking
          )
        );
      } catch (error) {
        console.error('Error cancelling booking:', error);
        // Handle error or display an error message
      } finally {
        handleDialogClose(); // Close the dialog after cancellation
      }
    };
    useEffect(() => {
      if (userInfo) {
        // Decode the token and set the user info state
        const decodedInfo = jwtDecode(userInfo.access); // Assuming 'access' contains user details
        setDecodedUserInfo(decodedInfo);
      }
    }, [userInfo]);

    useEffect(() => {
      if (decodedUserInfo && decodedUserInfo.user_id) {
        const fetchBookings = async () => {
          try {
            const response = await instance.get(`/api/booking/my-bookings/${decodedUserInfo.user_id}/`);
            setRoomBookings(response.data);
          } catch (error) {
            console.error('Error fetching bookings:', error);
          }
        };
        fetchBookings();
      }
    }, [decodedUserInfo]);


    const handleCancelBooking = (bookingId) => {
      setSelectedBookingId(bookingId);

      setOpenConfirmationDialog(true);
    };
  
  
  // const handleCloseDialog = () => {
  //     setOpenConfirmationDialog(false);
  //   };
  // }
    return (
      <div className={classes.root}>
        <Typography variant="h4" gutterBottom>
          My Room Bookings
        </Typography>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="bookings table">
            <TableHead>
              <TableRow>
              <TableCell>Booking ID</TableCell>
                <TableCell>Room Title</TableCell>
                <TableCell align="centre">Check-in</TableCell>
                <TableCell align="centre">Check-out</TableCell>
                <TableCell align="right">Total Amount</TableCell>

                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roomBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell align="centre">{booking.id}</TableCell>
                  <TableCell component="th" scope="row">
                    {booking?.room_title || 'null'}
                  </TableCell>
                  <TableCell align="centre">{booking.check_in}</TableCell>
                  <TableCell align="centre">{booking.check_out}</TableCell>
                  <TableCell align="right">{booking?.total_amount ||'null'}</TableCell>

                  <TableCell align="right">
                    {booking.booking_status !== 'cancelled' && (
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        Cancel Booking
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Dialog open={openConfirmationDialog} onClose={handleDialogClose}>
      <DialogTitle>Confirm Cancellation</DialogTitle>
      <DialogContent>
        <p>Are you sure you want to cancel this booking?</p>
        <input
          type="text"
          value={cancellationReason}
          onChange={(e) => setCancellationReason(e.target.value)}
          placeholder="Enter reason for cancellation"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose} color="primary">
          No
        </Button>
        <Button onClick={handleCancel} color="secondary">
          Yes, Cancel
        </Button>
      </DialogActions>
    </Dialog>
      </div>
    );
  };

export default MyBookings;

































// import React, { useState, useEffect } from 'react';
// import instance from '../../../utils/Axios'
// import {useSelector} from 'react-redux'
// import jwtDecode from 'jwt-decode';
// import {
//   Box,
//   Typography,
//   Table,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   IconButton,
// } from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';
// import { baseUrl } from '../../../utils/constants';
// import { useParams } from 'react-router-dom';

// const MyBookingsPage = () => {
//   const [bookings, setBookings] = useState([]);
//   const bookingData = useSelector((state)=>state.booking.bookingInfo)
   
//   const {userId}=useParams()


//   useEffect(() => {
//     console.log('bookingID',bookingData)
//     const fetchBookings = async () => {
//       try {
//        if (userId) {
//         const response = await instance.get(`${baseUrl}/api/booking/roombooking-page/${userId}/`);
//         console.log(response,"resppppp")
//         setBookings(response.data); // Set bookings state with fetched data
//       } 
//     }catch (error) {
//         console.error('Error fetching bookings:', error);
//       }
//     };

//     fetchBookings();
//   }, [bookingData.id]);

//   const handleCancel = async (bookingData) => {
//     try {
//       await instance.delete(`${baseUrl}/api/booking/roombooking-page/${bookingData.id}/cancel-booking`);
//       setBookings(bookings.filter((booking) => booking.id !== bookingData.id));
//     } catch (error) {
//       console.error('Error canceling booking:', error);
//     }
//   };

//   return (
//     <Box p={4}>
//     <Typography variant="h4" mb={4}>
//       My Bookings
//     </Typography>
//     <Table>
//       <TableHead>
//         <TableRow>
//           <TableCell>Booking ID</TableCell>
//           <TableCell>Check-in</TableCell>
//           <TableCell>Check-out</TableCell>
//           <TableCell>Booking Status</TableCell>
//           <TableCell>Room Price Per Night</TableCell>
//           <TableCell>Room Name</TableCell>
//           <TableCell>User Email</TableCell>
//           <TableCell>Action</TableCell>
//         </TableRow>
//       </TableHead>
//       <TableBody>
//         {bookings.map((booking) => (
//           <TableRow key={booking.id}>
//             <TableCell>{booking.id}</TableCell>
//             <TableCell>{booking.check_in}</TableCell>
//             <TableCell>{booking.check_out}</TableCell>
//             <TableCell>{booking.booking_status}</TableCell>
//             <TableCell>{booking.room.price_per_night}</TableCell>
//             <TableCell>{booking.room.title}</TableCell>
//             <TableCell>{booking.user.email}</TableCell>
//             <TableCell>
//               <IconButton
//                 color="error"
//                 aria-label="Cancel Booking"
//                 onClick={() => handleCancel(booking.id)}
//               >
//                 <DeleteIcon />
//               </IconButton>
//             </TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   </Box>
// );
// };

// export default MyBookingsPage;
