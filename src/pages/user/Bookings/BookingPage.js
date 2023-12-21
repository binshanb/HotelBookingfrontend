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


function BookingPage  ({ razorpayKey}) {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [price,setPrice] = useState(0);
  console.log(price,"price:");
  // const location = useLocation();
  // const queryParams = new URLSearchParams(location.search);
  const [bookingDetails, setBookingDetails] = useState(null);

  const userInfos = useSelector((state) => state.auth.userInfo);
  const [decodedUserInfo, setDecodedUserInfo] = useState({});
  const roomData = useSelector((state)=>state.room.roomInfo)
  const bookingData = useSelector((state)=>state.booking.bookingInfo);
  
  // const bookingRoomData = { id: bookingData.id };
 


  useEffect(() => {
    if (userInfos) {
      // Decode the token and set the user info state
      const decodedInfo = jwtDecode(userInfos.access); // Assuming 'access' contains user details
      console.log(decodedInfo);
      setDecodedUserInfo(decodedInfo);
}},[userInfos]);

  // useEffect(()=>{
  //   if (bookingId){
  //     dispatch(setBookingInfo(bookingId));
  //   }
  // },[dispatch,bookingId]);

  // useEffect(() => {
  //   instance.get(`/api/booking/roombooking-page/${bookingData.id}/`)
  //     .then((response) => response.data)
  //       .then((data) => {
  //         console.log('Booking data:',data[0]);
  //       setBookingDetails(data[0]);
  //       dispatch(activateBookingInfo(data[0]))
  //     })
  //     .catch(error => {
  //       console.error('Error fetching booking details:', error);
  //     });
  // }, [bookingData.id]);
  

  // Calculate price based on booking details
  useEffect(() => {
    if (bookingData) {
      const checkInDate = new Date(bookingData.check_in);

      const checkOutDate = new Date(bookingData.check_out);
      const numberOfGuests = parseInt(bookingData.number_of_guests);
  
      const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
      const diffDays = Math.round(Math.abs((checkOutDate - checkInDate) / oneDay));
    

      const pricePerNight = roomData.price_per_night; // Replace with actual price per night

      const calculatedPrice = diffDays * pricePerNight * numberOfGuests;
      

      setPrice(calculatedPrice)
  

    }
  }, [bookingData,roomData]);
  // Retrieve other form data fields similarly
  const bookingId = bookingData.id
  console.log(bookingId,"ideeee");
  console.log(price,"amount");
  console.log(roomData,"room");


  const handleHotelBookingPayment = async (bookingId, price, roomData) => {

    console.log(bookingId,price,"joooo");
  
    try {
      // Load the Razorpay script
      await loadRazorpayScript();
  
      // Create a Razorpay order
      const order = await createRazorpayOrder(bookingId, price);

      console.log(bookingId,price,"boook amt");

    
      // Open the Razorpay payment UI
      const options = {
        key: order.notes.key,
        amount: order.amount,
        currency: order.currency,
        name: 'Hotel Booking',
        description: `Payment for Room ${bookingId}`,
        order_id: order.id,
        handler: function (response) { 
          // Handle successful payment response
          console.log('Payment successful:', response);
          // const bookingId = bookingData.id;
         navigate('/booking-success',{bookingId})
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


  // const bookRoom = async (roomId, bookingData) => {
  //   try {
  //     // Implement the logic to book the room with the provided roomId and bookingDetails
  //     // Make an API call or perform necessary actions to confirm the booking
  
  //     // Example API call to book the room
  //     const response = await instance.post('/api/hotel/booking', {
  //       room_id: roomId,
        
  //       email: decodedUserInfo.email,
  //       phone: decodedUserInfo.phone,
  //       // Add other relevant booking details
  //     });
  
      // if (response.status === 201) {
      //   console.log('Room booked successfully:', response.data);
      //   navigate('/booking-success');
      // } else {
      //   console.error('Failed to book the room:', response.data);
      // }
    
  


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
          <Typography variant="body1">
            Category: {roomData && roomData.category ? roomData.category.category_name : ''}
          </Typography>
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
          Price Per Night: {roomData ? roomData.price_per_night : ''}
        </Typography>
        <Typography variant="body1">
          Check In Date : {bookingData.check_in}
        </Typography>
        <Typography variant="body1">
          Check Out Date : { bookingData.check_out}
        </Typography>
        <Typography variant="body1">
          Number Of Guests : {bookingData.number_of_guests}
        </Typography>
        <Divider />
        <Typography variant="body1">Total Price: ${price}</Typography>

        {/* Payment method using Razorpay */}
        <Button variant="contained" color="primary" onClick={() => handleHotelBookingPayment(bookingId, price,roomData)} sx={{ mt: 2 }}>
          Pay Now with Razorpay
        </Button>
      </Paper>
    </Grid>
  </Grid>
  );
};
export default BookingPage;




