import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button, Grid, CircularProgress } from '@mui/material';
import { adminInstance } from '../../../utils/Axios';
import { baseUrl } from '../../../utils/constants';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {activateRoomInfo} from '../../../redux/slices/roomslices/roomSlice'
import { makeStyles } from '@material-ui/core/styles';
import ReviewList from '../Review/ReviewList';
import {
  Card,
  CardContent,
} from '@material-ui/core';

import RoomImages from '../../admin/RoomCategories/RoomImages'; 




const useStyles = makeStyles((theme) => ({
  card: {
    margin: theme.spacing(2),
    border: '1px solid #ccc',
    borderRadius: theme.spacing(1),
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    '&:hover': {
      boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
    },
  },
  cardImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: theme.spacing(1),
  },
}));


function RoomDetail({rooms}) {

  const classes = useStyles();
  const [roomData, setRoomData] = useState([]);
  const[isRoomData, setIsRoomData] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
 

  

  useEffect(() => {
    // Fetch the room detail for the specified room ID
    adminInstance
      .get(`${baseUrl}/api/booking/room-detail/${id}/`)
      .then((response) => response.data)
      .then((data) => {
        console.log('Room data:',data);
        setRoomData(data[0]);
        dispatch(activateRoomInfo(data[0]))
        setIsRoomData(true);
      })
      .catch((error) => {
        console.error('Error fetching room detail:', error);
      });
  }, [id]);
  const handleReview = ()=>{
   navigate(`/add-review/${id}/`);
  }
  const handleRooms=()=>{
    navigate('/roomlistuser')
  }
  const handleBooking=()=>{
    navigate('/add-roombooking',{roomData})
    // navigate(`/add-booking/${id}/`,{ state: roomData })
  }
  // if (isLoading) {
  //   return <div>Loading...</div>; // Show a loading indicator
  // }

  // if (!Array.isArray(roomData) || roomData.length === 0) {
  //   return <div>Error: Room data not available.</div>; // Show an error message
  // }
  console.log("isRoomData:", isRoomData);


  return (
    <Box p={4} className="room-container">
      <Box textAlign="center" my={5}>
        <Typography variant="h4" fontWeight="bold" color="textPrimary">
          Room Detail
        </Typography>
        <Box width="40px" height="2px" bgcolor="primary.main" mx="auto" mt={2}></Box>
      </Box>

      {!isRoomData && (
        <Box display="flex" justifyContent="center">
          <CircularProgress size={40} color="primary" />
        </Box>
      )}
       {/* Check if roomData has loaded and is available */}
       {isRoomData && roomData && roomData.id && (
        <Box mb={4}>
          <Card className={classes.card}>
            {/* Display the first image as the cover image */}
            <img
              src={`${baseUrl}${roomData.cover_image}`}
              alt={roomData.title}
              className={classes.cardImage}
            />

            {/* Use the RoomImages component to display multiple images */}
            {/* {roomData.images && roomData.images.length > 0 && (
              <RoomImages images={roomData.images} />
            )} */}
            </Card>
            </Box>
       )}
       {/* {isRoomData && roomData && (
        <Grid container justifyContent="center" spacing={2}>
       <Box mb={4}>
      <Card className={classes.card}>
        <img
          src={`${baseUrl}${roomData.cover_image}`}
          alt={roomData.title}
          className={classes.cardImage}
        />
          
           {isRoomData && roomData && (
            <RoomImages roomData={roomData} />
    )}  */}
    {isRoomData && roomData && roomData.id && (
      <Box mb={4}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {roomData.title}
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            Category: {roomData.category ? roomData.category.category_name : 'Not available'}
          </Typography>
          <Typography variant="subtitle1" color="textPrimary" gutterBottom>
            Price Per Day: ₹{roomData.price_per_night}
          </Typography>
          <Typography variant="body1" color="textPrimary" gutterBottom>
            Description: {roomData.description}
          </Typography>
          <Typography variant="body1" color="textPrimary" gutterBottom>
            Capacity: Maximum {roomData.capacity} people
          </Typography>
          <Typography variant="body1" color="textPrimary" gutterBottom>
            Room Size: {roomData.room_size} sq.ft
          </Typography>
          <Typography variant="body1" color="textPrimary" gutterBottom>
            Room Availability: {roomData.is_active}
          </Typography>
          <Typography variant="body1" color="textPrimary" gutterBottom>
            Meals Included
          </Typography>
          <Typography variant="body1" color="textPrimary" gutterBottom>
            Features: {roomData.features ? roomData.features.map((feature) => feature.name).join(', ') : 'Not available'}
          </Typography>
        
   



<button onClick={handleReview} variant="contained" color="primary" size ="large">
  Add a Review
</button>
<Box mt={4} display="flex" justifyContent="center">
        <Button onClick={handleBooking} variant="contained" color="primary" size="large">
           Book Now
        </Button>
        <Button onClick={handleRooms} variant="outlined" color="primary" size="large">
          Back to Room List
         </Button>

         <ReviewList/>
      </Box>
      </CardContent>
      </Box>
    )}
    </Box> 
  );
};
export default RoomDetail;









// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { Box, Typography, Button, Grid, CircularProgress } from '@mui/material';
// import { useDispatch } from 'react-redux';
// import { activateRoomInfo } from '../../../redux/slices/roomslices/roomSlice'; // Make sure to import your Redux-related dependencies

// function RoomDetail() {
//   const [isRoomData, setIsRoomData] = useState(false);
//   const [roomData, setRoomData] = useState(null);
//   const { roomId } = useParams();
//   const dispatch = useDispatch();

//   useEffect(() => {
//     // Fetch room data using Material-UI compatible method (similar to Axios)
//     // Update setIsRoomData and setRoomData with fetched data
//     // Example: 
//     // const fetchRoomData = async () => {
//     //   try {
//     //     const response = await yourFetchMethod(`${baseUrl}/rooms/${roomId}`);
//     //     const data = await response.json();
//     //     setRoomData(data);
//     //     setIsRoomData(true);
//     //   } catch (error) {
//     //     console.error('Error fetching room data:', error);
//     //   }
//     // };
//     // fetchRoomData();
//   }, [roomId]);

//   const handleBooking = () => {
//     // Handle booking functionality
//   };

//   const handleRooms = () => {
//     // Handle navigation back to room list
//   };

//   return (
//     <Box p={4} className="room-container">
//       <Box textAlign="center" my={5}>
//         <Typography variant="h4" fontWeight="bold" color="textPrimary">
//           Room Detail
//         </Typography>
//         <Box width="40px" height="2px" bgcolor="primary.main" mx="auto" mt={2}></Box>
//       </Box>

//       {!isRoomData && (
//         <Box display="flex" justifyContent="center">
//           <CircularProgress size={40} color="primary" />
//         </Box>
//       )}

//       {isRoomData && roomData && (
//         <Grid container justifyContent="center" spacing={2}>
//           <Grid item xs={12} md={6}>
//             {/* Replace Image component with Material-UI Image component */}
//             {/* For simplicity, consider using <img> or Material-UI Image component */}
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <Box p={2}>
//               <Typography variant="h5" fontWeight="bold" color="textPrimary" mb={2}>
//                 {roomData.title}
//               </Typography>
//               {/* Render other room details using Typography components */}
//               {/* Example: */}
//               {/* <Typography variant="body1" color="textSecondary" mb={2}>
//                 Category: {roomData.category ? roomData.category.category_name : 'Not available'}
//               </Typography> */}
//             </Box>
//             {/* Render other room details using Typography components */}
//             {/* Use Typography components for other room details */}
//           </Grid>
//         </Grid>
//       )}

//       {/* Render buttons */}
//       <Box mt={4} display="flex" justifyContent="center">
//         <Button onClick={handleBooking} variant="contained" color="primary" size="large">
//           Book Now
//         </Button>
//         <Button onClick={handleRooms} variant="outlined" color="primary" size="large">
//           Back to Room List
//         </Button>
//       </Box>
//     </Box>
//   );
// }

// export default RoomDetail;










































// import React, { useContext } from "react";
// import { MyContext } from "../../../Context/Context";
// import Title from "../Services/Title";
// import Banner from "../Home/Banner"

// export default function RoomDetail({ match }) {
//   const context = useContext(MyContext);
//   const room = context.rooms.find(
//     (room) => room.room_slug === match.params["room_slug"]
//   );
//   if (!room) {
//     return <div>Eroror</div>;
//   } else {
//     return (
//       <>
//         <Banner room={room} />
//         <div className="container my-5 align-items-center justify-content">
//           <Title title="Description" />

//           <div className="row">
//             <div className="col-md-6 m-auto">
//               <h6>Details</h6>
//               <p className="text-justify" style={{ width: "80%" }}>
//                 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
//                 eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
//                 enim ad minim veniam, quis nostrud exercitation ullamco laboris
//                 nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
//                 in reprehenderit in voluptate velit esse cillum dolore eu fugiat
//                 nulla pariatur. Excepteur sint occaecat cupidatat non proident,
//                 sunt in culpa qui officia deserunt mollit anim id est laborum.
//               </p>
//             </div>
//             <div className="col-md-6 m-auto">
//               <h6>Information</h6>
//               <p>Price ${room.price_per_night}</p>
//               <p>Size {room.room_size} Sqr Feet</p>
//               <p>Capacity Maxium {room.capacity} People</p>
//               <p>Meals Included</p>
//             </div>
//           </div>

//           <Title title="Facilities" />

//           <div className="row mt-5">
//             <div className="col-md-4">
//               <p>
//                 eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
//                 proident, sunt in culpa qui officia deserunt mollit anim id est
//                 laborum.
//               </p>
//               <p>
//                 eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
//                 proident, sunt in culpa qui officia deserunt mollit anim id est
//                 laborum.
//               </p>
//               <p>
//                 eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
//                 proident, sunt in culpa qui officia deserunt mollit anim id est
//                 laborum.
//               </p>
//             </div>
//             <div className="col-md-4">
//               <p>
//                 eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
//                 proident, sunt in culpa qui officia deserunt mollit anim id est
//                 laborum.
//               </p>
//               <p>
//                 eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
//                 proident, sunt in culpa qui officia deserunt mollit anim id est
//                 laborum.
//               </p>
//               <p>
//                 eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
//                 proident, sunt in culpa qui officia deserunt mollit anim id est
//                 laborum.
//               </p>
//             </div>
//             <div className="col-md-4">
//               <p>
//                 eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
//                 proident, sunt in culpa qui officia deserunt mollit anim id est
//                 laborum.
//               </p>
//               <p>
//                 eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
//                 proident, sunt in culpa qui officia deserunt mollit anim id est
//                 laborum.
//               </p>
//               <p>
//                 eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
//                 proident, sunt in culpa qui officia deserunt mollit anim id est
//                 laborum.
//               </p>
//             </div>
//           </div>
//         </div>
//       </>
//     );
//   }
// }
