import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Typography, List, ListItem,Button, ListItemText } from '@mui/material';
import { makeStyles } from '@mui/styles';




const useStyles = makeStyles({
  listItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px',
    border: '1px solid #ccc',
    marginBottom: '10px',
    borderRadius: '5px',
  },
  roomImage: {
    width: '100px',
    height: '100px',
    marginRight: '20px',
    borderRadius: '5px',
  },
  roomDetails: {
    flex: 1,
  },
  bookNowButton: {
    marginLeft: 'auto',
  },
});


const AvailableRoomsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const classes = useStyles();
  console.log(location.state,'state2222')
  const  availableRooms  = location.state || { availableRooms: [] };
  console.log(availableRooms,"roooooooooooooooooms");
  const handleBookNow = () => {
    // Logic to handle booking for the selected room
    const isLoggedIn = checkUserLoggedIn(); // Implement your user authentication logic here

    if (isLoggedIn) {
      // User is logged in, proceed to the booking form page
      navigate('/add-roombooking');
    } else {
      // User is not logged in, redirect to the login page
      navigate('/login');
    }
  };
  const checkUserLoggedIn = () => {
    // Simulated check for logged-in user (example using local storage)
    const userLoggedIn = localStorage.getItem('setCredentials');
    return userLoggedIn === 'true'; 
  };
  return (
        <div>
          <Typography variant="h4" gutterBottom>
            Available Rooms
          </Typography>
          {availableRooms.length > 0 ? (
            <List>
              {availableRooms.map((room) => (
                <ListItem key={room.id} className={classes.listItem}>
                  <img src={room.cover_image} alt={room.title} className={classes.roomImage} />
                  <div className={classes.roomDetails}>
                    <Typography variant="h6">{room.title}</Typography>
                    <Typography variant="body1">Price per night: ₹ {room.price_per_night}</Typography>
                    {/* Add other room details as needed */}
                          {/* Book Now button */}
                  {/* Book Now button aligned to the right */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleBookNow(room.id)}
          >
            Book Now
          </Button>
          </div>
                  </div>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body1">No rooms available for the selected dates.</Typography>
          )}
        </div>
      );
    };
    

export default AvailableRoomsPage;











// import React, { useState } from 'react';
// import DatePicker from 'react-datepicker'; // Assuming you use a date picker library like react-datepicker
// import 'react-datepicker/dist/react-datepicker.css';
// import instance from '../../../utils/Axios';
// import { Button, TextField, Typography,List, ListItem, ListItemText  } from '@mui/material';





// const RoomAvailabilityChecker = () => {
//   const classes = useStyles();
//   const [checkInDate, setCheckInDate] = useState(null);
//   const [checkOutDate, setCheckOutDate] = useState(null);
//   // const [isRoomAvailable, setIsRoomAvailable] = useState(false);
//   const [availableRooms, setAvailableRooms] = useState([]);


//   const handleCheckAvailability = async () => {
//     try {
//       const response = await instance.get(`/api/booking/get-available-rooms/?check_in=${checkInDate}&check_out=${checkOutDate}`);
//       setAvailableRooms(response.data);
//       console.log(response.data,"iuuyuuuuuuuuuuuuu");
    
//       if (response.data.is_available) {
//       // If room is available, update availableRooms state with available room data
//       setAvailableRooms(response.data);
//       }}catch (error) {
//       console.error('Error fetching available rooms:', error);
//       setAvailableRooms([]); // Set availability to false in case of an error
//     }
//   };

//   return (
//     <div className={classes.container}>
//     <Typography variant="h4">Check Room Availability</Typography>
//     <div className={classes.inputContainer}>
//       <TextField
//         label="Check-in Date"
//         type="date"
//         onChange={(e) => setCheckInDate(e.target.value)}
//         InputLabelProps={{
//           shrink: true,
//         }}
//       />
//     </div>
//     <div className={classes.inputContainer}>
//       <TextField
//         label="Check-out Date"
//         type="date"
//         onChange={(e) => setCheckOutDate(e.target.value)}
//         InputLabelProps={{
//           shrink: true,
//         }}
//       />
//     </div>
//     <Button variant="contained" color="primary" onClick={handleCheckAvailability} className={classes.button}>
//       Check Availability
//     </Button>
//     {/* {isRoomAvailable ? <Typography>Room is available for the selected dates!</Typography> : <Typography>Room is not available for the selected dates.</Typography>} */}

//       {/* Display available rooms */}
//       {availableRooms && availableRooms.length >= 0 && (
//         <div>
//           <Typography variant="h5" component="h3">Available Rooms</Typography>
//           <List>
//             {availableRooms.map((room) => (
//               <ListItem key={room.id}>
//                 <ListItemText primary={room.title} />
//                 {/* Display relevant room information */}
//               </ListItem>
//             ))}
//           </List>
//         </div>
//       )}
//     </div>

// );
// };
 

// export default RoomAvailabilityChecker;



