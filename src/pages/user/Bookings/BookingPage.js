import React ,{useState,useEffect}from 'react';
import { loadRazorpayScript, createRazorpayOrder } from '../../../utils/razorpay';
import {
  Box,
  Typography,
  Divider,
  Button,
  Input,
  FormControl,
  Grid,
  GridItem,
  Paper, 

} from '@mui/material';
import { baseUrl } from '../../../utils/constants';
import instance from '../../../utils/Axios';
// import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import jwtDecode from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { activateBookingInfo } from '../../../redux/slices/bookingslices/bookingslice';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';


function BookingPage  ({ razorpayKey}) {
  const dispatch = useDispatch();
  const {bookingId} = useParams();

  console.log(bookingId,"idbookinggggg");

  const navigate = useNavigate();

  // const [price,setPrice] = useState(0);
  // console.log(price,"price:");
  // const location = useLocation();
  // const queryParams = new URLSearchParams(location.search);
  const [bookingData, setBookingData] = useState(null);
  console.log(bookingData,"bookingggggggggg");

  const userInfos = useSelector((state) => state.auth.userInfo);
 
  const [decodedUserInfo,setDecodedUserInfo] = useState({});
  

 
  
  const roomData = useSelector((state)=>state.room.roomInfo);
  console.log(roomData,"roomdataaaa");

  // const bookingData = useSelector((state)=>state.booking.bookingInfo);
  
  // const bookingRoomData = { id: bookingData.id };
 


  useEffect(() => {
    if (userInfos) {
      // Decode the token and set the user info state
      const decodedInfo = jwtDecode(userInfos.access); // Assuming 'access' contains user details
      console.log(decodedInfo);
      setDecodedUserInfo(decodedInfo);
}},[userInfos]);

useEffect(() => {
  const fetchBookingData = async () => {
    try {
      const response = await instance.get(`/api/booking/roombooking-page/${bookingId}/`);
      console.log(response.data,"booking room datas")
      setBookingData(response.data);
    } catch (error) {
      console.error('Error fetching booking data:', error);
      // Handle errors...
    }
  };

  fetchBookingData();
}, [bookingId]);




  // Calculate price based on booking details
  
  // Retrieve other form data fields similarly
  const bookingIds = bookingData ? bookingData.id : null;
  console.log(bookingId,"ideeee");

  console.log(roomData,"room");


  const handleHotelBookingPayment = async (bookingId,booking_amount, roomData) => {

    console.log(bookingId,booking_amount,"joooo");
  
    try {
      // Load the Razorpay script
      await loadRazorpayScript();
  
      // Create a Razorpay order
      const order = await createRazorpayOrder(bookingIds, booking_amount);

      

    
      // Open the Razorpay payment UI
      const options = {
        key: order.notes.key,
        amount: order.amount,
        currency: order.currency,
        name: 'Hotel Booking',
        description: `Payment for Room ${bookingIds}`,
        order_id: order.id,
        handler: function (response) { 
          // Handle successful payment response
          console.log('Payment successful:', response);
          // const bookingId = bookingData.id;
         navigate(`/booking-success/${bookingId}`)
          // Proceed to book the room after successful payment
          // bookRoom(roomData, bookingData);
        },
        prefill: {
          email: decodedUserInfo.email, // Replace with the user's email for booking
          contact: decodedUserInfo.phone_number, // Replace with the user's contact number for booking
        },
      };
  
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Error handling Hotel Booking Razorpay payment:', error); 
    }
  };



  


  return (
    <Grid container spacing={3}>
    <Grid item xs={12} md={6}>
      <Paper elevation={3}>
        <Typography variant="h4" gutterBottom>
          Booking Details
        </Typography>

        {/* Guest Details Card */}
        <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h5" gutterBottom>
            Guest Details
          </Typography>
          {/* Input fields for guest details */}
          <FormControl fullWidth>
            <Input value={decodedUserInfo.email} readOnly />
          </FormControl>
          {/* Add more input fields for other guest details */}
        </Paper>

        {/* Room Details Card */}
        <Paper elevation={1} sx={{ p: 2 }}>
          <Typography variant="h5" gutterBottom>
            Room Details
          </Typography>
          {/* Display room details */}
          <Typography variant="body1">
            Room Name: {roomData ? roomData.title : ''}
          </Typography>
          {roomData && roomData.category && roomData.category ? (
          <Typography variant="body1">
             Category: {roomData.category.category_name}
          </Typography>
          ) : (
            <Typography variant="body1">Category: N/A</Typography>
          )}
          {/* Add more room details */}
        </Paper>
      </Paper>
    </Grid>

    {/* Price Summary Card */}
    <Grid item xs={12} md={6}>
      <Paper elevation={3}>
        <Typography variant="h4" gutterBottom>
          Price Summary
        </Typography>
        {/* Display price details */}
        <Typography variant="body1">
          Price Per Night: ₹{roomData ? roomData.price_per_night : ''}
        </Typography>
        {bookingData && (
        <Typography variant="body1">
          Check In Date : {bookingData.check_in}
        </Typography>
           )}
        {bookingData && (
        <Typography variant="body1">
          Check Out Date : { bookingData.check_out}
        </Typography>
         )}
         {bookingData && (
        <Typography variant="body1">
          Number Of Guests : {bookingData.number_of_guests}
        </Typography>
       
         )}
        <Divider />
        <Typography variant="body1">Total Price: { bookingData ? bookingData.total_amount :""}</Typography>
     
        {/* Payment method using Razorpay */}
        <Button variant="contained" color="primary" onClick={() => handleHotelBookingPayment(bookingIds,  bookingData?.total_amount,roomData)} sx={{ mt: 2 }}>
          Pay Now with Razorpay
        </Button>
      </Paper>
    </Grid>
  </Grid>
  );
};
export default BookingPage;




