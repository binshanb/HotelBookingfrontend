import React, { useState,useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import instance from '../../utils/Axios';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../utils/constants';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import  {userInfo} from "../../redux/slices/userslices/authSlice"
import { activateRoomInfo } from '../../redux/slices/roomslices/roomSlice';

import { activateBookingInfo } from '../../redux/slices/bookingslices/bookingslice';
import TextInput from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { DatePicker } from "@mui/x-date-pickers";
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns// Adapter for date functions
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { makeStyles} from '@mui/styles';
import { createTheme } from '@mui/material/styles';
// import { useParams } from 'react-router-dom';



const theme = createTheme();
const useStyles = makeStyles(() => ({
  formContainer: {
    padding: theme.spacing(2),
    '& .MuiTextField-root': {
      marginBottom: theme.spacing(2),
    },
  },
}));

const BookingForm = ({roomId}) => {

  const classes = useStyles();
// const{id} = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const roomInfo= useSelector((state) => state.room.roomInfo);



  const userInfos = useSelector((state) => state.auth.userInfo);
  
  const loading = useSelector((state) => state.room.loading);
  const error = useSelector((state) => state.room.error);
  const [decodedUserInfo, setDecodedUserInfo] = useState({});
 
  
  const [formData, setFormData] = useState({
    check_in: '',
    check_out: '',
    number_of_guests: '',
  });
  useEffect(() => {
    if (userInfos) {
      // Decode the token and set the user info state
      const decodedInfo = jwtDecode(userInfos.access); // Assuming 'access' contains user details
      setDecodedUserInfo(decodedInfo);
    }
    if (roomId){
    // Fetch room info and user info when component mounts
    dispatch(activateRoomInfo(roomId));
    // dispatch(userInfos());
}}, [dispatch,roomId]);
  

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleCheckInDateChange = (date) => {
    setFormData({
      ...formData,
      check_in: date,
    });
  };

  const handleCheckOutDateChange = (date) => {
    setFormData({
      ...formData,
      check_out: date,
    });
  };
  function validateDate(date) {
    const currentDate = new Date();
    return date > currentDate;
  }
  const updatedFormData = {
    ...formData,
    user: decodedUserInfo.user_id,
    room: roomInfo.id,
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('UpdatedForm data:', updatedFormData);

    const { check_in, check_out } = formData;
    const checkInTimestamp = Date.parse(check_in);
    const checkOutTimestamp = Date.parse(check_out);



    if (checkInTimestamp >= checkOutTimestamp) {
      toast.error("Invalid date selection. Please choose future dates for check-in and checkout.", {
        position: 'top-right',
        autoClose: 3000, // Duration for which the toast is shown (in milliseconds)
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    console.log('Form is valid. Proceeding with submission.');



    // try {
    //   // Validate formData and retrieve needed information
    //   // ... (assuming formData, decodedUserInfo, and roomInfo are defined)
  
    //   if (formData.check_in && formData.check_out) {
    //     // Construct Date objects from formData
    //     const checkInDate = new Date(formData.check_in);
    //     const checkOutDate = new Date(formData.check_out);
  
    //     // Check if the dates are valid
    //     if (!isNaN(checkInDate) && !isNaN(checkOutDate)) {
    //       // Convert dates to IST (India Standard Time)
    //       const istTimezone = 'Asia/Kolkata';
  
    //       // const checkInIST = new Date(checkInDate.toLocaleString('en-US', { timeZone: istTimezone }));
    //       // const checkOutIST = new Date(checkOutDate.toLocaleString('en-US', { timeZone: istTimezone }));
    //       const currentDate = AdapterDateFns.utcToday();
    //       // Format dates as ISO strings
    //       const formattedData = {
    //         ...formData,
    //         user: decodedUserInfo.user_id,
    //         room: roomInfo.id,
    //         // check_in: checkInIST.toISOString(),
    //         // check_out: checkOutIST.toISOString(),
    //       };
  
    //       console.log(formattedData, "This is formatted data");
 
    try {
      const response = await instance.post(`${baseUrl}/api/booking/check-overlapping-bookings/`, {
        check_in: updatedFormData.check_in,
        check_out: updatedFormData.check_out,
        number_of_guests:updatedFormData.number_of_guests,
        user: updatedFormData.user.user_id,
        room: updatedFormData.room.id,
        
      });

      // Perform API call to create a booking
      if (response.data && response.data.message !== 'Overlapping booking exists') {
          await instance.post(`${baseUrl}/api/booking/add-roombooking/`, updatedFormData);
    
      // Check if the booking creation was successful
      // if (response && response.data) {
      //   const bookingId = response.data.id;
      //   dispatch(activateBookingInfo({ ...response.data.data }));
        toast.success('Booking added. Proceed to Payments to Complete!', {
          position: 'top-right',
          autoClose: 3000, // Duration for which the toast is shown (in milliseconds)
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        navigate('/roombooking-page');
      }
      else {
        // If an overlapping booking exists, display an error message
        toast.error('Overlapping booking exists. Please choose different dates or room.');
      }
    } catch (error) {
      // Handle API errors or other exceptions
      console.error('Error creating booking:', error);
      toast.error('Error creating booking. Please try again.');


    }}
return (
    <div>
      <h2>Room Booking Form</h2>
      <form className={classes.formContainer} onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Room"
              type="text"
              name="name"
              value={roomInfo.title}
              placeholder="Enter Name"
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>
          <Grid container spacing={3}></Grid>
          <Grid item xs={12}>
            <TextField
              label="User"
              type="email"
              name="email"
              value={decodedUserInfo.email}
              placeholder="Enter Email"
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Number of Guests:"
              type="text"
              name="number_of_guests"
              value={formData.number_of_guests}
              placeholder="Enter number of guests"
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MuiPickersUtilsProvider utils={AdapterDateFns}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <DatePicker
              label="Check-in Date"
              value={formData.check_in}
              onChange={handleCheckInDateChange}
              renderInput={(params) => <TextField {...params} fullWidth />}
              minDate={new Date()} // Disable past dates
            />
            <DatePicker
              label="Check-Out Date"
              value={formData.check_out}
              onChange={handleCheckOutDateChange}
              renderInput={(params) => <TextField {...params} fullWidth />}
              minDate={new Date()} // Disable past dates
            />
          </Grid>
        </Grid>
      </MuiPickersUtilsProvider>
    </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" size="large">
              Book
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default BookingForm;

























// import React, { useState } from 'react';
// import axios from 'axios';
// import TextInput from '../../components/Bookings/TextInput'
// import instance from '../../utils/Axios'
// import { useSelector } from 'react-redux';

// import jwt_decode from 'jwt-decode';



// const BookingForm = () => {

 
//   const [formData, setFormData] = useState({
//     first_name: '',
//     email: '',
//     phone_number: '',
//     checking_date: '',
//     checkout_date: '',
//   });

  
//   const { userInfo } = useSelector((state) => state.auth || {});
//   console.log(userInfo,'yttggggg')
//   const { access } = userInfo || {};

//   console.log(access,"jhhghhjhj")


//   const {roomInfo}=useSelector((state)=> state.room || {});
  
//   console.log(roomInfo,'roomInfo');
//   console.log(userInfo,'userInfo');


  

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     console.log('Form Data:', formData);
//     console.log('Room Info:', roomInfo);
//     console.log('userInfo:' ,userInfo)
//     console.log(access,'access')
   
//     try {
//       console.log('hello')
//       // const token = localStorage.getItem('access'); 
//       // console.log(token,'token')
//       const decodedToken = jwt_decode(access);
//       console.log(decodedToken,'hjkkjkjj');
//       const headers = {
//         Authorization: `Bearer ${access}`,
//         'Content-Type': 'application/json',
//       };
//       console.log('hiiiiiiiii');
//       const response = await instance.post(
//         '/api/booking/add-booking/',
//         {
//           ...formData,
//           room: roomInfo,
          
//         },
//         {
//           headers: headers, // Pass the headers in the request configuration
//         }
//       );
    
//       // Handle the response
    
    
      
//       console.log('Response:', response);
//       console.log('Booking successful:', response.data.message);

//       // Clear form data after successful submission
//       setFormData({
//         name: '',
//         email: '',
//         phone_number: '',
//         checking_date: '',
//         checkout_date: '',
//       });

//       // Handle further actions here after successful booking
//     } catch (error) {
//       console.error('Error during booking:', error);
//       // Handle error scenarios here
//     }
//   };

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   return (
//     <form className="booking-form mt-5" onSubmit={handleSubmit}>
//       {/* Your input fields */}
//       {/* Example: */}
//        <div className="row">
//          <TextInput
//           divClass="form-group col-md-6 m-auto"
//           htmlForLabel="inputName"
//           labelName="Name"
//           inputClass="form-control"
//           inputType="name"
//           inputName="name"
//           inputValue={formData.name}
//           inputPlaceHolder="Enter Name"
//           onChange={handleChange}
//           required={true}
//         />
//       </div>

//       <div className="row">
//          <TextInput
//           divClass="form-group col-md-6 m-auto"
//           htmlForLabel="inputEmail"
//           labelName="Email"
//           inputClass="form-control"
//           inputType="email"
//           inputName="email"
//           inputValue={formData.email}
//           inputPlaceHolder="Enter Email"
//           onChange={handleChange}
//           required={true}
//         />
//       </div>

//       <div className="row">
//          <TextInput
//           divClass="form-group col-md-6 m-auto"
//           htmlForLabel="inputPhoneNumber"
//           labelName="Phone Number"
//           inputClass="form-control"
//           inputType="text"
//           inputName="phone_number"
//           inputValue={formData.phone_number}
//           inputPlaceHolder="Enter Phone Number"
//           onChange={handleChange}
//           required={true}
//         />
//       </div>
    
//         <div className="row">
//          <TextInput
//           divClass="form-group col-md-6 m-auto"
//           htmlForLabel="inputCheckinDate"
//           labelName="Check in Date"
//           inputClass="form-control"
//           inputType="datetime-local"
//           inputName="checking_date"
//           inputValue={formData.checking_date}
//           inputPlaceHolder="Enter CheckinDate"
//           onChange={handleChange}
//           required={true}
//         />
//       </div>

//           <div className="row">
//          <TextInput
//           divClass="form-group col-md-6 m-auto"
//           htmlForLabel="inputCheckinDate"
//           labelName="Check in Date"
//           inputClass="form-control"
//           inputType="datetime-local"
//           inputName="checkout_date"
//           inputValue={formData.checkout_date}
//           inputPlaceHolder="Enter CheckoutDate"
//           onChange={handleChange}
//           required={true}
//         />
//       </div>
//       <button type="submit" className="btn btn-primary px-5 my-3">Book</button>
//     </form>
//   );
// };

// export default BookingForm;

















// import React from "react";
// import { useState } from "react";
// import { useSelector } from "react-redux";
// import instance from '../../utils/Axios';
// // import { loadRazorpayScript, createRazorpayOrder } from '../../utils/razorpay';
// import { useNavigate } from 'react-router-dom';
// import jwt_decode from 'jwt-decode';
// import TextInput from "../../components/TextInput/TextInput";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";
// // import { useParams } from "react-router-dom";

// export default function BookingForm() {

  

 
//   const navigate = useNavigate();
//   const { userInfo } = useSelector((state) => state.auth || {});
//   const decode = jwt_decode(userInfo.access);
//   const { user_id } = decode;
//   const { roomInfo } = useSelector((state) => state.room);
//   console.log(roomInfo,'qwerty');
//   const { id } = roomInfo; // Only destructure the properties you need
  
//   // const {id} = useParams();
//   const [data, setData] = useState({
//     first_name: "",
//     email: "",
//     phone_number: "",
//     checking_date: "",
//     checkout_date: "",
//   });
//   console.log(roomInfo,"hgfgjjgh")

//   const isValid = () => {
//     console.log(data,"hggfhdjd")
//     const phoneRegex = /^\d{10}$/; 
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (!data.first_name || !data.email || !data.phone_number || !data.checking_date || !data.checkout_date) {
//       console.error("All fields are required.");
//       return false;
//     }

//     if (!phoneRegex.test(data.phone_number)) {
//       console.error("Invalid Phone Number");
//       return false;
//     }

//     if (!emailRegex.test(data.email)) {
//       console.error("Invalid Email");
//       return false;
//     }

//     const checkinDate = new Date(data.checking_date);
//     const checkoutDate = new Date(data.checkout_date);
  
//     if (checkinDate >= checkoutDate) {
//       console.error("Checkout Date should be after Check-in Date");
//       return false;
//     }
//     return true;
//   };
//   const handleSubmit = async (event) => {
//     event.preventDefault();
    
//     try {
      
//       const isFormValid = isValid(); // Check form validation here if needed
  
//       // if (isFormValid) {
//         const userToken = userInfo?.accessToken || '';
//         const roomToken = roomInfo?.accessToken || '';
  
//         const config = {
//           headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${userToken}`,
//             "Room-Authorization": `Bearer ${roomToken}`,
//           },
//         };
//         console.log(id,'room')
//         console.log(user_id,'user_id')
//         const bookingDate = {
//           name: data.first_name,
//           email: data.email,
//           phone_number: data.phone_number,
//           checking_date: data.checking_date,
//           checkout_date: data.checkout_date,
//           room: id,
//           customer: user_id,
//         };
  
//         const response = await instance.post('/api/booking/add-booking/', bookingDate,);
  
//         // Handle success
//         console.log("Booking successful:", response.data);
  
//         setData({
//           first_name: "",
//           email: "",
//           phone_number: "",
//           checking_date: "",
//           checkout_date: "",
//         });
  
//         // const queryParams = new URLSearchParams({
//         //   firstName: data.first_name,
//         //   email: data.email,
//         //   phoneNumber: data.phone_number,
//         //   checkingDate: data.checking_date,
//         //   checkoutDate: data.checkout_date,
//         //   // Add more form data fields as needed
//         // });
  
//         // navigate(`booking-page/?${queryParams.toString()}`);
  
//         // Show success message or handle further actions as needed
//       // }
//     } catch (error) {
//       // Handle errors
//       console.error("Error during booking:", error);
//       toast.error('validation is not working')
//       // Display error message or perform actions based on error
//       // For example:
//       // showToast("Error occurred during booking. Please try again.", "error");
//     }
//   };
  
//   return (
//     <form className="booking-form mt-5"onSubmit={(event) => handleSubmit(event)} >
//       <div className="row">
//         <div className="form-group col-md-6 m-auto text-center">
//           {/* <p className="success-message mb-2 font-weight-bold" id="message"></p> */}
//           <Link to='/roomlistuser'role="button">
//             <button>Goto Room</button>
//           </Link>
//         </div>
//       </div>

      
//       <div className="row">
//         <TextInput
//           divClass="form-group col-md-6 m-auto"
//           htmlForLabel="inputEmail"
//           labelName="Name"
//           inputClass="form-control"
//           inputType="first_name"
//           inputName="first_name"
//           inputValue={data.first_name}
//           inputPlaceHolder="Enter Name"
//           onChange={(event) => setData({ ...data, first_name: event.target.value })}
//           required={true}
//         />
//       </div>

//       <div className="row">
//         <TextInput
//           divClass="form-group col-md-6 m-auto"
//           htmlForLabel="inputEmail"
//           labelName="Email"
//           inputClass="form-control"
//           inputType="email"
//           inputName="email"
//           inputValue={data.email}
//           inputPlaceHolder="Enter Email"
//           onChange={(event) => setData({ ...data, email: event.target.value })}
//           required={true}
//         />
//       </div>

//       <div className="row">
//         <TextInput
//           divClass="form-group col-md-6 m-auto"
//           htmlForLabel="inputPhoneNumber"
//           labelName="Phone Number"
//           inputClass="form-control"
//           inputType="text"
//           inputName="phone_number"
//           inputValue={data.phone_number}
//           inputPlaceHolder="Enter Phone Number"
//           onChange={(event) =>
//             setData({ ...data, phone_number: event.target.value })
//           }
//           required={true}
//         />
//       </div>

//       <div className="row" id="phoneID" style={{ display: "none" }}>
//         <div className="form-group col-md-6 m-auto text-danger">
//           <p id="phone"></p>
//         </div>
//       </div>

//       <div className="row">
//         <TextInput
//           divClass="form-group col-md-6 m-auto"
//           htmlForLabel="inputCheckingDate"
//           labelName="Checking Date"
//           inputClass="form-control"
//           inputType="datetime-local"
//           inputName="checking_date"
//           inputValue={data.checking_date}
//           inputPlaceHolder="Enter Checking Date"
//           onChange={(event) =>
//             setData({ ...data, checking_date: event.target.value })
//           }
//           required={true}
//         />
//       </div>

//       <div className="row">
//         <TextInput
//           divClass="form-group col-md-6 m-auto"
//           htmlForLabel="inputCheckoutDate"
//           labelName="Checkout Date"
//           inputClass="form-control"
//           inputType="datetime-local"
//           inputName="checkout_date"
//           inputValue={data.checkout_date}
//           inputPlaceHolder="Enter Checkout Date"
//           onChange={(event) =>
//             setData({ ...data, checkout_date: event.target.value })
//           }
//           required={true}
//         />
//       </div>

//       <div className="row" id="checkoutID" style={{ display: "none" }}>
//         <div className="form-group col-md-6 m-auto text-danger">
//           <p id="checkout"></p>
//         </div>
//       </div>

//       <div className="row">
//         <div className="col-md-6 m-auto text-center">
//           <button type="submit" className="btn btn-primary px-5 my-3">
//             Book
//           </button>
//         </div>
//       </div>
//     </form>
//   );
// }






























// import React, { useState,useContext} from 'react';
// import { useSelector } from 'react-redux'; // Import Redux hooks or methods
// import { RoomContext } from '../../Context/Context';
// import { useLocation } from 'react-router-dom';


// function BookingForm( ) {

//   const location = useLocation();
//   const roomData = location.state;
//   const { rooms } = useContext(RoomContext);
//   const [selectedRoom, setSelectedRoom] = useState(null);
//   const user = useSelector(state => state.user); // Replace 'user' with your actual Redux state slice

//   const handleRoomSelection = (roomId) => {
//     // Logic to handle room selection
//     setSelectedRoom(roomId); // Set the selected room ID
//   };
//   const handleSubmit = e => {
//     e.preventDefault();
//     // ... Your form submission logic goes here
//     // Access form data using e.target or state variables
    
//     // For example, to access selectedRoom and room details
//     if (selectedRoom) {
//       const selectedRoomDetails = rooms.find(room => room.id === selectedRoom);
//       console.log('Selected Room:', selectedRoom,"ggggghhgh");
//       // Continue with the form submission or API call
//     } else {
//       alert('Please select a room before submitting.');
//     }
//   };

//   return (
//     <>
//   <div className="container mx-auto">
//   <div className="py-5 text-center">
//     <img className="d-block mx-auto mb-4" src="" alt="" width="72" height="72" />
//     <h1 className="text-4xl font-semibold">Booking Form</h1>
//     <div className="w-16 h-1 bg-blue-500 mx-auto mt-2"></div>

    
//   </div>
//     <div className="container">
//       <div className="row">
//         <div className="col-md-4 order-md-2 mb-4">
//           <h4 className="d-flex justify-content-between align-items-center mb-3">
//             <span className="text-3xl font-semibold ">Payment Details</span>
//             <span className="badge badge-secondary badge-pill"></span>
//           </h4>
//           <ul className="list-group mb-3">
//             {/* Display room details if a room is selected */}
//             {selectedRoom && rooms.find(room => room.id === selectedRoom) ? (
//               <li className="list-group-item d-flex justify-content-between lh-condensed">
//                 <div>
//                   <h6 className="my-0">Amount Per Day</h6>
//                 </div>
//                 <span className="text-muted">
//                  ₹ {rooms.find(room => room.id === selectedRoom).price_per_night}
//                 </span>
//               </li>
//             ) : null}
//             {/* Other payment details */}
//             {/* ... */}
//           </ul>
//           <form className="card p-2">
//             {/* Payment form details */}
//             {/* ... */}
//           </form>
//         </div>

       
   
   

          
    
//     <div className="col-md-8 order-md-1">
//       <h3 className="mb-6 text-3xl font-semibold">Customer Details</h3>
//       <div className="mb-6 w-16 h-1 bg-blue-500 mx-auto mt-2"></div>
//       <form className="needs-validation" noValidate>
//       <div className="row">
//     <div className="col-md-6 mb-3">
//       <label htmlFor="firstName">First name</label>
//       <input type="text" className="form-control" id="firstName" placeholder="Enter Your First Name" required/>
//       <div className="invalid-feedback">
//         Valid first name is required.
//       </div>
//     </div>
//     <div className="col-md-6 mb-3">
//       <label htmlFor="lastName">Last name</label>
//       <input type="text" className="form-control" id="lastName" placeholder="Enter Your Last Name" required/>
//       <div className="invalid-feedback">
//         Valid last name is required.
//       </div>
//     </div>
//   </div>

//         <div className="mb-3">
//           <label htmlFor="email">Email</label>
//           <div className="input-group">
//             <div className="input-group-prepend">
//               <span className="input-group-text">@</span>
//             </div>
//             <input type="email" className="form-control" id="Email" placeholder="Enter your Email" required/>
//             <div className="invalid-feedback" style={{ width: '100%' }}>
//                 Email is required
//               </div>

//           </div>
//         </div>

//         <div className="mb-3">
//           <label htmlFor="phone">Phone Number <span className="text-muted">(Optional)</span></label>
//           <input type="tel" className="form-control" id="phone" placeholder="Enter Your Phone Number"/>
//           <div className="invalid-feedback">
//             Please Enter Your Phone number
//           </div>
//         </div>

//         <div className="mb-3">
//           <label htmlFor="address">Address</label>
//           <input type="text" className="form-control" id="address" placeholder="1234 Main St" required/>
//           <div className="invalid-feedback">
//             Please enter your shipping address.
//           </div>
//         </div>
//         <div className="mb-3">
//   <label htmlFor="checkIn">Check-in Date</label>
//   <input type="date" className="form-control" id="checkIn" required/>
//   <div className="invalid-feedback">
//     Please select a valid check-in date.
//   </div>
// </div>

// <div className="mb-3">
//   <label htmlFor="checkOut">Check-out Date</label>
//   <input type="date" className="form-control" id="checkOut" required/>
//   <div className="invalid-feedback">
//     Please select a valid check-out date.
//   </div>
// </div>


//         {/* <div className="mb-3">
//           <label for="address2">Address 2 <span class="text-muted">(Optional)</span></label>
//           <input type="text" className="form-control" id="address2" placeholder="Apartment or suite"/>
//         </div> */}

//         {/* <div className="row">
//           <div className="col-md-5 mb-3">
//             <label for="country">Country</label>
//             <select className="custom-select d-block w-100" id="country" required>
//               <option value="">Choose...</option>
//               <option>United States</option>
//             </select>
//             <div className="invalid-feedback">
//               Please select a valid country.
//             </div>
//           </div>
//           <div className="col-md-4 mb-3">
//             <label for="state">State</label>
//             <select className="custom-select d-block w-100" id="state" required>
//               <option value="">Choose...</option>
//               <option>California</option>
//             </select>
//             <div className="invalid-feedback">
//               Please provide a valid state.
//             </div>
//           </div>
//           <div className="col-md-3 mb-3">
//             <label for="zip">Zip</label>
//             <input type="text" className="form-control" id="zip" placeholder="" required/>
//             <div className="invalid-feedback">
//               Zip code required.
//             </div>
//           </div>
//         </div> */}
//         <hr className="mb-4" />
//         {/* <div className="custom-control custom-checkbox">
//           <input type="checkbox" className="custom-control-input" id="same-address" />
//           <label className="custom-control-label" htmlFor="same-address">Shipping address is the same as my billing address</label>
//         </div> */}
//         <div className="custom-control custom-checkbox">
//           <input type="checkbox" className="custom-control-input" id="save-info" />
//           <label className="custom-control-label" htmlFor="save-info">Save this information for next time</label>
//         </div>
//         <hr className="mb-4" />

//         <h4 className="mb-3">Payment Method</h4>
//         <div className="d-block my-3">
       
//           <div className="custom-control custom-radio">
//             <input id="razorpay" name="paymentMethod" type="radio" className="custom-control-input" required/>
//             <label className="custom-control-label" htmlFor="razorpay">Razorpay</label>
//           </div>
//         </div>
//         {/* <div className="row">
//           <div className="col-md-6 mb-3">
//             <label for="cc-name">Name on card</label>
//             <input type="text" className="form-control" id="cc-name" placeholder="" required/>
//             <small className="text-muted">Full name as displayed on card</small>
//             <div className="invalid-feedback">
//               Name on card is required
//             </div>
//           </div>
//           <div className="col-md-6 mb-3">
//             <label for="cc-number">Credit card number</label>
//             <input type="text" className="form-control" id="cc-number" placeholder="" required/>
//             <div className="invalid-feedback">
//               Credit card number is required
//             </div>
//           </div>
//         </div>
//         <div className="row">
//           <div className="col-md-3 mb-3">
//             <label for="cc-expiration">Expiration</label>
//             <input type="text" className="form-control" id="cc-expiration" placeholder="" required/>
//             <div className="invalid-feedback">
//               Expiration date required
//             </div>
//           </div>
//           <div className="col-md-3 mb-3">
//             <label for="cc-cvv">CVV</label>
//             <input type="text" className="form-control" id="cc-cvv" placeholder="" required/>
//             <div className="invalid-feedback">
//               Security code required
//             </div>
//           </div>
//          </div> */}
//         <hr className="mb-4"/>
//         <button className="btn btn-primary btn-lg btn-block" type="submit">Confirm Now</button>
//       </form>
//     </div>
  
//       </div>

  
//     </div>
//     </div>
   
//     </>
  
//     );
// }

// export default BookingForm;












































// import React, { useState,useEffect } from 'react';

// import instance from '../../utils/Axios';


// import { Link } from "react-router-dom";
// import { useParams } from 'react-router-dom';
// import TextInput from './TextInput';
// import { baseUrl } from '../../utils/constants';

// const BookingForm = () => {
//   const {id} = useParams();
//   const [data, setData] = useState({
//     email: "",
//     phone_number: "",
//     checking_date: "",
//     checkout_date: "",
//   });
//   const [roomPrice, setRoomPrice] = useState(null); // State to store room price
//   const [amount, setAmount] = useState(null); // State to store the calculated amount

//   useEffect(() => {
//     const fetchRoomPrice = async () => {
//       try {
//         const response = await instance.get(`${baseUrl}/api/booking/roomprice/${id}/`, {
//           params: {
//             checking_date: data.checking_date,
//             checkout_date: data.checkout_date,
//           },
//         });

//         if (response.status === 200) {
//           const { room_price } = response.data; // Assuming the response contains room price
//           setRoomPrice(room_price); // Update the room price state
//           calculateAmount(room_price); // Calculate amount based on room price
//         } else {
//           console.error('Failed to fetch room price');
//         }
//       } catch (error) {
//         console.error('Error fetching room price:', error);
//       }
//     };

//     // Fetch room price only when both check-in and check-out dates are available
//     if (data.checking_date && data.checkout_date) {
//       fetchRoomPrice();
//     }
//   }, [id, data.checking_date, data.checkout_date]);

//   const isValid = () => {
//     const phone = /^\+?(88)?01[0-9]{9}/;
//     if (!phone.test(data.phone_number)) {
//       document.getElementById("phoneID").style.display = "block";
//       document.getElementById("phone").innerHTML = "Invalid Phone Number";
//       return false;
//     }
//     document.getElementById("phoneID").style.display = "none";
//     document.getElementById("phone").innerHTML = "";
//     if (new Date(data.checkout_date) < new Date(data.checking_date)) {
//       document.getElementById("checkoutID").style.display = "block";
//       document.getElementById("checkout").innerHTML =
//         "Checkout Date should be greater than Checkin Date";
//       return false;
//     }
//     document.getElementById("checkoutID").style.display = "none";
//     document.getElementById("checkout").innerHTML = "";
//     return true;
//   };
//   const handleSubmit = (event) => {
//     event.preventDefault();
//     let isFormValid = isValid();
//     let bookingDate = {
//       email: data.email,
//       phone_number: data.phone_number,
//       checking_date: data.checking_date,
//       checkout_date: data.checkout_date,
   
//     };
//     if (isFormValid) {
//       const config = {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${data}`,
//         },
//       };
//       instance
//         .post("api/booking/add-booking", bookingDate, config)
//         .then((response) => {
//           setData(
//             {
//               email: "",
//               phone_number: "",
//               checking_date: "",
//               checkout_date: "",
//             },
//             // context.handleBook(room.id)
//           );
//           return response.data;
          
//         })
//         .then((response) => {
//           document.getElementById(
//             "common-message"
//           ).innerHTML = `${response["response"]}`;
//           setTimeout(function () {
//             document.getElementById("common-message").innerHTML = "";
//           }, 3000);
//         })
//         .catch((error) => {
//         });
//     }
//   };

//   const calculateAmount = (roomPricePerNight) => {
//     if (data.checking_date && data.checkout_date && new Date(data.checkout_date) > new Date(data.checking_date)) {
//       const timeDiff = new Date(data.checkout_date).getTime() - new Date(data.checking_date).getTime();
//       const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
//       const calculatedAmount = roomPricePerNight * nights;
//       setAmount(calculatedAmount);
//     } else {
//       setAmount(null); // Reset amount if dates are not valid
//     }
//   };
//   const handleInputChange = (event) => {
//     const { name, value } = event.target;
//     setData({ ...data, [name]: value });
//   };

    
  
    



//   return (
//     <form className="booking-form mt-5" onSubmit={handleSubmit}>
//     <div className="row">
//       <div className="form-group col-md-6 m-auto text-center">
//         <p className="success-message mb-2 font-weight-bold" id="message"></p> 
//         <Link to={`/booking/room-detail/${id}/`} role="button">
//           <button>Goto Room</button>
//         </Link>
//       </div>
//     </div>

//     <div className="row">
//       <TextInput
//         divClass="form-group col-md-6 m-auto"
//         htmlForLabel="inputEmail"
//         labelName="Email"
//         inputClass="form-control"
//         inputType="email"
//         inputName="email"
//         inputValue={data.email}
//         inputPlaceHolder="Enter Email"
//         onChange={(event) => setData({ ...data, email: event.target.value })}
//         required={true}
//       />
//     </div>

//     <div className="row">
//       <TextInput
//         divClass="form-group col-md-6 m-auto"
//         htmlForLabel="inputPhoneNumber"
//         labelName="Phone Number"
//         inputClass="form-control"
//         inputType="text"
//         inputName="phone_number"
//         inputValue={data.phone_number}
//         inputPlaceHolder="Enter Phone Number"
//         onChange={(event) =>
//           setData({ ...data, phone_number: event.target.value })
//         }
//         required={true}
//       />
//     </div>

//     <div className="row" id="phoneID" style={{ display: "none" }}>
//       <div className="form-group col-md-6 m-auto text-danger">
//         <p id="phone"></p>
//       </div>
//     </div>

//     <div className="row">
//       <TextInput
//         divClass="form-group col-md-6 m-auto"
//         htmlForLabel="inputCheckingDate"
//         labelName="Checking Date"
//         inputClass="form-control"
//         inputType="datetime-local"
//         inputName="checking_date"
//         inputValue={data.checking_date}
//         inputPlaceHolder="Enter Checking Date"
//         onChange={(event) =>
//           setData({ ...data, checking_date: event.target.value })
//         }
//         required={true}
//       />
//     </div>

//     <div className="row">
//       <TextInput
//         divClass="form-group col-md-6 m-auto"
//         htmlForLabel="inputCheckoutDate"
//         labelName="Checkout Date"
//         inputClass="form-control"
//         inputType="datetime-local"
//         inputName="checkout_date"
//         inputValue={data.checkout_date}
//         inputPlaceHolder="Enter Checkout Date"
//         onChange={(event) =>
//           setData({ ...data, checkout_date: event.target.value })
//         }
//         required={true}
//       />
//     </div>

//     <div className="row" id="checkoutID" style={{ display: "none" }}>
//       <div className="form-group col-md-6 m-auto text-danger">
//         <p id="checkout"></p>
//       </div>
//     </div>

//     <div className="row">
//         <div className="form-group col-md-6 m-auto">
//           <label htmlFor="roomPrice">Room Price:</label>
//           <p className="font-weight-bold">
//             {roomPrice !== null ? `$${roomPrice}` : 'Select dates to calculate price'}
//           </p>
//         </div>
//       </div>
//       <div className="row">
//         <div className="form-group col-md-6 m-auto">
//           <label htmlFor="amount">Total Amount:</label>
//           <p className="font-weight-bold">{amount !== null ? `$${amount}` : 'Calculate amount'}</p>
//         </div>
//       </div>

//     <div className="row">
//       <div className="col-md-6 m-auto text-center">
//         <button type="submit" className="btn btn-primary px-5 my-3">
//           Book
//         </button>
//       </div>
//     </div>
//   </form>
// );
// }
// export default BookingForm;















  // const navigate = useNavigate();
  // const location = useLocation();
  // const { state: roomData } = location;
  // const [bookingId, setBookingId] = useState(null);
  // const [amount, setAmount] = useState(null);


  // const [roomPricePerNight, setRoomPricePerNight] = useState(0); // Initialize room price

  // useEffect(() => {
  //   // Fetch the room's price per night from the backend
  //   const fetchRoomPrice = async () => {
  //     try {
  //       const response = await instance.get('/api/booking/roomlistuser/'); // Replace with your API endpoint
  //       if (response.status === 200) {
  //         const data = response.data; // Assuming the response contains the price per night
  //         setRoomPricePerNight(data.room.price_per_night); // Update the room's price per night
  //       } else {
  //         console.error('Failed to fetch room price');
  //       }
  //     } catch (error) {
  //       console.error('Error fetching room price:', error);
  //     }
  //   };

  //   fetchRoomPrice();
  // }, []);


  // const handleBookingSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await instance.post('/api/booking/add-booking/', formData, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     });
  
  //     if (response.ok) {
  //       const data = await response.json();
  //       setBookingId(data.bookingId); // Assuming your response contains a bookingId
  //     } else {
  //       console.error('Failed to create booking');
  //     }
  //   } catch (error) {
  //     console.error('Error creating booking:', error);
  //   }
  // };
  

  // const handleDateChange = (e) => {
  //   if (new Date(data.checkout_date) < new Date(data.checking_date)) {
  //     document.getElementById("checkoutID").style.display = "block";
  //     document.getElementById("checkout").innerHTML =
  //       "Checkout Date should be greater than Checkin Date";
  //     return false;
  //   }
  //   document.getElementById("checkoutID").style.display = "none";
  //   document.getElementById("checkout").innerHTML = "";
  //   return true;
  // };
  
  //     if (checkInDate && checkOutDate && checkOutDate > checkInDate)  {
  //       const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
  //       const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
  //       const calculatedAmount = roomPricePerNight * nights;
  //       setAmount(calculatedAmount,"hhujjjjjjjj");
  //     } else {
  //       setAmount(null); // Reset amount if dates are not valid
  //     }
//     <div className="max-w-md mx-auto mt-8 p-6 border rounded shadow-md text-center">
//     <h2 className="text-2xl font-semibold mb-4">Booking Form</h2>
//     <form onSubmit={handleBookingSubmit}>
//       <div className="mb-4">
//         <label className="block text-sm font-bold mb-2">Name:</label>
//         <input
//           type="text"
//           placeholder="Name"
//           value={formData.name}
//           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//           className="w-full border rounded p-2"
//         />
//         </div>
//         <div className="mb-4">
//         <label className="block text-sm font-bold mb-2">Email:</label>
//         <input
//           type="email"
//           placeholder="Email"
//           value={formData.email}
//           onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//           className="w-full border rounded p-2"
//         />
//         </div>
//         <div className="mb-4">
//         <label className="block text-sm font-bold mb-2">Check-in Date:</label>
//         <input
//           type="datetime-local"
//           name="checking_date"
//           value={formData.checking_date}
//           onChange={(e) => {
//             handleDateChange(e);
//             setFormData({ ...formData, checking_date: e.target.value });
//           }}
//           className="w-full border rounded p-2"
//         />
//       </div>
//       <div className="mb-4">
//         <label className="block text-sm font-bold mb-2">Check-out Date:</label>
//         <input
//           type="datetime-local"
//           name="checkout_date"
//           value={formData.checkout_date} 
//           onChange={(e) => {
//             handleDateChange(e);
//             setFormData({ ...formData, checkout_date: e.target.value });
//           }}
//           className="w-full border rounded p-2"
//         />
//       </div>
//       <div className="mb-4">
//           <label className="block text-sm font-bold mb-2">Price:</label>
//           <p className="text-lg font-semibold">Price: {amount !== null ? amount : ''}</p>
//         </div>

//              <button
//           type="submit"
//           className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer w-full"
//         >
//           Submit
//         </button>
//       </form>
     
    
//     </div>
//   );
// };

// export default BookingForm;
































// import React, { useState } from 'react';
// import axios from 'axios';
// import instance from '../../utils/Axios';

// const BookingForm = () => {
//   const [formData, setFormData] = useState({
//     checking_date: '',
//     checkout_date: '',
//     phone_number: '',
//     email: '',
//   });
//   const [bookingSuccess, setBookingSuccess] = useState(false);
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//         const {checking_date, checkout_date, phone_number, email } = formData;
//         const user_id = 1; // Replace with the actual user ID
//         const room_id = 1; // Replace with the actual room ID
//         const bookingData = {
//             customer: user_id,
//             room: room_id,
//             checking_date,
//             checkout_date,
//             phone_number,
//             email,
//           };
//         instance.post('/api/booking/add-booking/', bookingData);
//         setBookingSuccess(true);
//         // Optionally, reset the form data after successful booking
//         setFormData({
          
//           checking_date: '',
//           checkout_date: '',
//           phone_number: '',
//           email: '',
//         });
//       // Handle successful submission or redirect
//     } catch (error) {
//       // Handle error
//       console.error('Error creating booking:', error);
//     }
//   }; 
//   const validatePhoneNumber = (phone) => {
//     // Regular expression for a basic 10-digit phone number
//     const phoneRegex = /^\d{10}$/;
//     return phoneRegex.test(phone);
//   };
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === 'phone_number') {
//         if (validatePhoneNumber(value) || value === '') {
//           setFormData({ ...formData, [name]: value });
//         }
//         }else{
//     setFormData({ ...formData, [name]: value });
//   }};

//   return (
//     <div className="max-w-md mx-auto mt-8 p-6 border rounded shadow-md">
//       <h2 className="text-2xl font-semibold mb-4 text-center">Booking Form</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label className="block text-sm font-bold mb-2">Check-in Date:</label>
//           <input
//             type="datetime-local"
//             name="checking_date"
//             value={formData.checking_date}
//             onChange={handleChange}
//             className="w-full border rounded p-2"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-sm font-bold mb-2">Check-out Date:</label>
//           <input
//             type="datetime-local"
//             name="checkout_date"
//             value={formData.checkout_date}
//             onChange={handleChange}
//             className="w-full border rounded p-2"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-sm font-bold mb-2">Phone Number:</label>
//           <input
          
//           type="text"
//           name="phone_number"
//           value={formData.phone_number}
//           onChange={handleChange}
//           placeholder="Enter your phone number"
//           className="w-full border rounded p-2"
//         />
        
//         </div>
//         <div className="mb-4">
//           <label className="block text-sm font-bold mb-2">Email:</label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             className="w-full border rounded p-2"
//           />
//         </div>

        
//         <button
//           type="submit"
//           className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer w-full"
//         >
//           Submit
//         </button>
//       </form>
//     </div>
//   );
// };

// export default BookingForm;







































































// import React, { useState,useEffect } from 'react';
// import instance from '../../utils/Axios';
// import { baseUrl } from '../../utils/constants';
// import { UseSelector, useSelector } from 'react-redux/es/hooks/useSelector';
// import jwt_decode from 'jwt-decode';

// import {useParams } from 'react-router-dom';



// const BookingForm = ({ onSubmit }) => {
//   const userData = useSelector((state)=>state.auth.userInfo);
//   const [user, setUser] = useState(null);

//       if (userData) {
//       try {
//         const decodedUser = jwt_decode(userData);
//         setUser(decodedUser);
//       } catch (error) {
//         console.error('Error decoding token:', error);
//       }
//     }

//   const [bookingData, setBookingData] = useState({
//     customer: '',
//     room: '',
//     checkingDate: '',
//     checkoutDate: '',
//     phoneNumber: '',
//     email: '',
//   });

//   const [customers, setCustomers] = useState([]); // state to store customers
//   const [rooms, setRooms] = useState([]); 
//   const { userId, roomId} = useParams();
//   console.log(roomId,"kjeblkjeb")
//         // state to store rooms
//  console.log(customers,rooms,userId)
//   useEffect(() => {
//     if (userData) {
//         try {
//           const decodedUser = jwt_decode(userData);
//           setUser(decodedUser);
//         } catch (error) {
//           console.error('Error decoding token:', error);
//         }
//       }
//     const fetchCustomersAndRooms = async () => {
//       try {
  
//         if (userId && roomId) {
//         const customerResponse = await instance.get(`${baseUrl}/api/user/user-detail/${userId}/`); // Adjust the API endpoint
//         const roomResponse = await instance.get(`${baseUrl}/api/booking/room-detail/${roomId}/`);  // Adjust the API endpoint

//         console.log('Customer response:', customerResponse); // Log the customers response
//         console.log('Room response:', roomResponse); // Log the rooms response
    
     
//         setCustomers([customerResponse.data]);
//         setRooms([roomResponse.data]);
//         }
//       } catch (error) {
//         console.error('Error fetching customers and rooms:', error);
//       }
//     };

//     fetchCustomersAndRooms();
// }

//   , [userData, userId, roomId]);
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setBookingData({ ...bookingData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
  
//     // Find the selected customer object
//     const selectedCustomer = customers.find(customer => customer.userId === parseInt(bookingData.customer, 10));
  
//     // Find the selected room object
//     const selectedRoom = rooms.find(room => room.roomId === parseInt(bookingData.room, 10));
  
//     // Update bookingData with selected customer and room
//     setBookingData(prevData => ({
//       ...prevData,
//       customer: selectedCustomer,
//       room: selectedRoom,
//     }));
  
//     console.log('Form data:', bookingData);
//     // Validate and submit the form data
//     onSubmit(bookingData);
//   };

//   return (
    
//         <div className="max-w-md mx-auto mt-8">
//           <div className="bg-white p-6 rounded-lg shadow-md">
//             <h2 className="text-2xl font-semibold mb-4">Booking Form</h2>
//             <form onSubmit={handleSubmit}>
    
//             <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">
//               Customer:
//             </label>
//             <select
//   name="customer"
//   value={bookingData.customer}
//   onChange={handleChange}
//   className="w-full border rounded p-2"
// >
//   <option value="">Select Customer</option>
//   {customers.map((customer) => (
//     <option key={customer.id} value={customer.id}>
//       {customer.first_name}
//     </option>
//   ))}
// </select>
//           </div>

//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">
//               Room:
//             </label>
//             <select
//   name="room"
//   value={bookingData.room}
//   onChange={handleChange}
//   className="w-full border rounded p-2"
// >
//   <option value="">Select Room</option>
//   {rooms.map((room) => (
//     <option key={room.id} value={room.id}>
//       {room.title}
//     </option>
//   ))}
// </select>
//           </div>
    
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-bold mb-2">
//                   Check-in Date and Time:
//                 </label>
//                 <input
//                   type="datetime-local"
//                   name="checkingDate"
//                   value={bookingData.checkingDate}
//                   onChange={handleChange}
//                   className="w-full border rounded p-2"
//                 />
//               </div>
    
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-bold mb-2">
//                   Check-out Date and Time:
//                 </label>
//                 <input
//                   type="datetime-local"
//                   name="checkoutDate"
//                   value={bookingData.checkoutDate}
//                   onChange={handleChange}
//                   className="w-full border rounded p-2"
//                 />
//               </div>
    
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-bold mb-2">
//                   Phone Number:
//                 </label>
//                 <input
//                   type="text"
//                   name="phoneNumber"
//                   value={bookingData.phoneNumber}
//                   onChange={handleChange}
//                   className="w-full border rounded p-2"
//                 />
//               </div>
    
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-bold mb-2">
//                   Email:
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={bookingData.email}
//                   onChange={handleChange}
//                   className="w-full border rounded p-2"
//                 />
//               </div>
    
//               <button
//                 type="submit"
//                 className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
//               >
//                 Submit
//               </button>
//             </form>
//           </div>
//         </div>
//       );
//     };
    
//     export default BookingForm;
    