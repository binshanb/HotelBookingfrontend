  import React, { useState, useEffect } from 'react';
  import { Typography, Table, TableBody, TableCell, Button, TableContainer, TableHead, TableRow, Paper, makeStyles } from '@material-ui/core';
  import instance from '../../../utils/Axios';

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
      console.log(bookingId,"bookiiiiiiii");
      setSelectedBookingId(bookingId);

      setOpenConfirmationDialog(true);
    };
  
  
  // const handleCloseDialog = () => {
  //     setOpenConfirmationDialog(false);
  //   };
  // }
    return (
      <div className="container mx-auto p-4">
  <h4 className="text-2xl mb-4">My Room Bookings</h4>
  <div className="mb-8">
    <table className="w-full border" aria-label="bookings table">
      <thead>
        <tr>
          <th className="border p-2">Booking ID</th>
          <th className="border p-2">Room Title</th>
          <th className="border p-2 text-center">Check-in</th>
          <th className="border p-2 text-center">Check-out</th>
          <th className="border p-2 text-right">Total Amount</th>
          <th className="border p-2 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {roomBookings.map((booking) => (
          <tr key={booking.id} className="hover:bg-gray-100">
            <td className="border p-2 text-center">{booking.id}</td>
            <td className="border p-2">{booking?.room_title || 'null'}</td>
            <td className="border p-2 text-center">{booking.check_in}</td>
            <td className="border p-2 text-center">{booking.check_out}</td>
            <td className="border p-2 text-right">{booking?.total_amount || 'null'}</td>
            <td className="border p-2 text-right">
              {booking.booking_status !== 'cancelled' && (
                <button
                  className="border border-red-500 text-red-500 px-4 py-2 rounded-full transition-transform hover:scale-105 hover:bg-red-100"
                  onClick={() => {
                    setCancellationReason('');
                    handleCancelBooking(booking.id);
                  }}
                >
                  Cancel Booking
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  <div className={openConfirmationDialog ? 'block' : 'hidden'}>
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div className="relative w-auto max-w-md mx-auto my-6">
        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
          <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
            <h3 className="text-3xl font-semibold">Confirm Cancellation</h3>
            <button
              className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
              onClick={handleDialogClose}
            >
              <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                ×
              </span>
            </button>
          </div>
          <div className="relative p-6 flex-auto">
            <p className="my-4 text-gray-600 text-lg leading-relaxed">
              Are you sure you want to cancel this booking?
            </p>
            <input
              type="text"
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              placeholder="Enter reason for cancellation"
              className="border border-gray-400 p-2 w-full mb-4"
            />
          </div>
          <div className="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
            <button
              className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              onClick={handleDialogClose}
            >
              No
            </button>
            <button
              className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              onClick={handleCancel}
            >
              Yes, Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
  </div>
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
