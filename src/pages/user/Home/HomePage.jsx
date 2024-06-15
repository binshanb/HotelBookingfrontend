import React, { useState } from 'react';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from "@mui/x-date-pickers";
import { Box, Container, Grid, Typography, Button, Card, CardMedia } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { toast } from 'react-toastify';
import Banner from './Banner';
import { TextField } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom'; // Changed alias to RouterLink to avoid conflict with the Link component

import Hotel1 from '../../../assets/hotel51.jpg';
import Hotel2 from '../../../assets/hotel2.png';
import Hotel3 from '../../../assets/hotel16.jpg';
import hotelImage from '../../../assets/hotel10.jpg';
import hotelImage1 from '../../../assets/hotel11.jpg';
import hotelImage2 from '../../../assets/hotel50.jpg';
import hotelImage3 from '../../../assets/hotel13.jpg';
import hotelImage4 from '../../../assets/hotel14.jpg';
import hotelImage5 from '../../../assets/hotel15.jpg';

const useStyles = makeStyles((theme) => ({
  homeBackground: {
    backgroundColor: theme.palette.background.default,
    paddingBottom: theme.spacing(8),
  },
  section: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  cardMedia: {
    paddingTop: '7%', // Adjust the height here as needed (e.g., '50%', '100px', etc.)
    objectFit: 'cover', // Ensure the image covers the entire area of the CardMedia
  },
  heading: {
    marginBottom: theme.spacing(4),
    fontWeight: 'bold',
    textAlign: 'center',
  }
}));

const cards = [
  { id: 1, title: 'Our Room Facilities', description: 'Discover the comforts of our in-room amenities', imageUrl: Hotel1 },
  { id: 2, title: 'Feel Good Experience', description: 'Stay longer and save on your accommodation on very safe', imageUrl: Hotel2 },
  { id: 3, title: 'Exclusive Offers For You', description: 'Avail exclusive discounts on your next booking', imageUrl: Hotel3 },
  { id: 4, title: 'Free Wi-Fi', description: 'Stay connected with complimentary high-speed Wi-Fi throughout your stay.', imageUrl: hotelImage },
  { id: 5, title: 'Spacious Rooms', description: 'Relax in our spacious and well-furnished rooms. Enjoy Long Stay here.', imageUrl: hotelImage1 },
  { id: 6, title: 'Gourmet Dining', description: 'Savor delectable dishes at our on-site restaurant.', imageUrl: hotelImage2 },
  { id: 7, title: 'Room Service', description: 'Enjoy the convenience of 24/7 room service.', imageUrl: hotelImage3 },
  { id: 8, title: 'Swimming Pool', description: 'Take a refreshing dip in our pristine swimming pool.', imageUrl: hotelImage4 },
  { id: 9, title: 'Concierge Services', description: 'Assist with travel arrangements and help you plan your activities and excursions.', imageUrl: hotelImage5 },
];

const HomePage = () => {
  const navigate = useNavigate();
  const classes = useStyles();
  const [formData, setFormData] = useState({
    check_in: null,
    check_out: null,
  });

  const handleCheckInDateChange = (date) => {
    if (date > new Date()) {
      setFormData({ ...formData, check_in: date });
    } else {
      toast.error('Please select a future date for Check-in');
    }
  };

  const handleCheckOutDateChange = (date) => {
    if (date > new Date()) {
      setFormData({ ...formData, check_out: date });
    } else {
      toast.error('Please select a future date for Check-out');
    }
  };

  const handleCheckAvailability = async () => {
    try {
      const formattedCheckInDate = format(formData.check_in, "yyyy-MM-dd'T'HH:mm:ss");
      const formattedCheckOutDate = format(formData.check_out, "yyyy-MM-dd'T'HH:mm:ss");
      
      // Example API call
      const response = { data: [{ id: 1, is_active: true }] }; // Replace with your API call
      if (Array.isArray(response.data)) {
        const availableRooms = response.data.filter(room => room.is_active === true);
        if (availableRooms.length > 0) {
          navigate('/get-available-rooms/', { state: availableRooms });
        }
      }
    } catch (error) {
      console.error('Error fetching available rooms:', error);
    }
  };

  return (
    <div className={classes.homeBackground}>
      <Banner />
      <Container maxWidth="xl" className={classes.section}>
        <Typography variant="h4" align="center" gutterBottom>
          Welcome to Hotel Booking System
        </Typography>
        <Typography variant="h6" align="center" color="textSecondary" paragraph>
          Book now to enjoy our limited-time offer
        </Typography>

        <Box bgcolor="white" p={6} borderRadius={8} boxShadow={3} mb={8}>
          <Typography variant="h4" align="center" gutterBottom>
            Check Room Availability
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <MuiPickersUtilsProvider utils={AdapterDateFns}>
                  <DatePicker
                    label="Check-in Date"
                    value={formData.check_in}
                    onChange={handleCheckInDateChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        value={formData.check_in ? format(new Date(formData.check_in), 'dd MMMM yyyy hh:mm a') : ''}
                      />
                    )}
                    minDate={new Date()} // Disable past dates
                  />
                </MuiPickersUtilsProvider>
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <MuiPickersUtilsProvider utils={AdapterDateFns}>
                  <DatePicker
                    label="Check-out Date"
                    value={formData.check_out}
                    onChange={handleCheckOutDateChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        value={formData.check_out ? format(new Date(formData.check_out), 'dd MMMM yyyy hh:mm a') : ''}
                      />
                    )}
                    minDate={new Date()} // Disable past dates
                  />
                </MuiPickersUtilsProvider>
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCheckAvailability}
                fullWidth
              >
                Check Availability
              </Button>
            </Grid>
          </Grid>
        </Box>
     
             {/* User Attractive Heading */}
             <Typography variant="h4" className={classes.heading}>
          Discover Our Offers
        </Typography>
      {/* Cards Section */}
      <Grid container spacing={3}>
          {cards.map((card) => (
            <Grid item xs={12} md={4} key={card.id}>
              <Card elevation={3}>
                <RouterLink to="/categorylist">
                  <CardMedia
                    component="img"
                    image={card.imageUrl}
                    alt={card.title}
                    className={classes.cardMedia}
                  />
                </RouterLink>
                <Box p={4}>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    {card.title}
                  </Typography>
                  <Typography variant="body1" mb={2}>
                    {card.description}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    component={RouterLink}
                    to="/categorylist"
                    fullWidth
                  >
                    View Here
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default HomePage;























// // import * as React from 'react';
// import React,{useEffect, useState} from 'react';
// import { MuiPickersUtilsProvider } from '@material-ui/pickers';
// import { LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { format } from 'date-fns';


// import { useNavigate } from 'react-router-dom';
// import Hotel1 from '../../../assets/hotel51.jpg' 
// import Hotel2 from '../../../assets/hotel2.png' 
// import { DatePicker } from "@mui/x-date-pickers";
// import Hotel3 from '../../../assets/hotel16.jpg' 
// import { Carousel } from 'react-responsive-carousel';
// import instance from '../../../utils/Axios';
// // import Card from '@mui/material/Card';
// // import CardActions from '@mui/material/CardActions';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
// import CssBaseline from '@mui/material/CssBaseline';
// // import Grid from '@mui/material/Grid';
// import { Link as RouterLink } from 'react-router-dom';
// // import Stack from '@mui/material/Stack';
// // import Box from '@mui/material/Box';
// // import Toolbar from '@mui/material/Toolbar';
// // import Container from '@mui/material/Container';
// // import Link from '@mui/material/Link';
// import { ThemeProvider, createTheme } from '@mui/material/styles';
// // import Footer from './home/Footer';
// import Typography from '@mui/material/Typography';
// import CardActionArea from '@mui/material/CardActionArea';
// import Banner from './Banner';
// import './HomePage.css'
// import hotelImage from '../../../assets/hotel10.jpg';
// import hotelImage1 from '../../../assets/hotel11.jpg';
// import hotelImage2 from '../../../assets/hotel50.jpg';
// import hotelImage3 from '../../../assets/hotel13.jpg';
// import hotelImage4 from '../../../assets/hotel14.jpg';
// import hotelImage5 from '../../../assets/hotel15.jpg';
// import ImageCarousel from './Banner';
// import RoomAvailabilityChecker from '../Rooms/AvailableRoomsPage';
// import { Box, Container, Flex, Text, SimpleGrid, Button,Grid,Link,Card } from '@mui/material';
// import { TextField,List, ListItem, ListItemText  } from '@mui/material';
// import { makeStyles } from '@mui/styles';
// import { baseUrl } from '../../../utils/constants';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { date } from 'yup';


// const useStyles = makeStyles({
//   card: {
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'space-between',
//     height: '100%', // Maintain full height of the card
    
//   },
//   cardMedia: {
//     paddingTop: '56.25%', // 16:9 aspect ratio for the images
//   },
//   cardContent: {
//     flexGrow: 1,
//     mainContainer: {
//       backgroundImage: `url("../../../assets/hotel2.png")`, // Replace with the path to your image
//       backgroundSize: 'cover',
//       backgroundRepeat: 'no-repeat',
//       backgroundPosition: 'center',
//     },
//   },
// });

// const rooms = [
//   { id: 1, name: "Single Room", price: 1300},
//   { id: 2, name: "Double Room", price: 2500},
//   { id: 3, name: "Triple Room", price: 3500 },
//   { id: 4, name: "Family Room", price: 5000 },

//   // Add more room objects as needed
// ];

// const cards = [
//   {
//     id: 1,
//     title: 'Free Wi-Fi',
//     description: 'Stay connected with complimentary high-speed Wi-Fi throughout your stay.',
//     imageUrl: hotelImage, // Replace with your image URL
//   },
//   {
//     id: 2,
//     title: 'Spacious Rooms',
//     description: 'Relax in our spacious and well-furnished rooms.Enjoy Long Stay here.',
//     imageUrl: hotelImage1, // Replace with your image URL
//   },
//   {
//     id: 3,
//     title: 'Gourmet Dining',
//     description: 'Savor delectable dishes at our on-site restaurant.',
//     imageUrl: hotelImage2, // Replace with your image URL
//   },
//   {
//     id: 4,
//     title: 'Room Service',
//     description: 'Enjoy the convenience of 24/7 room service.',
//     imageUrl: hotelImage3, // Replace with your image URL
//   },
//   {
//     id: 5,
//     title: 'Swimming Pool',
//     description: 'Take a refreshing dip in our pristine swimming pool.',
//     imageUrl: hotelImage4, // Replace with your image URL
//   },
//   {
//     id: 6,
//     title: 'Concierge Services',
//     description: 'Assist with travel arrangements and help you plan your activities and excursions.',
//     imageUrl: hotelImage5, // Replace with your image URL
//   },
// ];

// // TODO remove, this demo shouldn't need to reset the theme.
// const defaultTheme = createTheme();

// function HomePage() {

//   const navigate = useNavigate();
//   const [checkInDate, setCheckInDate] = useState(null);
//   console.log(checkInDate,"dateeeeeeee");
//   const [checkOutDate, setCheckOutDate] = useState(null);
//   console.log(checkOutDate,"checkoutttttt");
//   const [availableRooms, setAvailableRooms] = useState([]);
  
//   const classes = useStyles();



   
//   const [formData, setFormData] = useState({
//     check_in: '',
//     check_out: '',
  
  
//   });
//   const handleCheckInDateChange = (date) => {
//     if (date > new Date()) {
//       setFormData({
//         ...formData,
//         check_in: date,
//       });
//     } else {
//       toast.error('Please select a future date for Check-in', {
//         position: 'top-right',
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//       });
//     }
//   };

//   const handleCheckOutDateChange = (date) => {
//     if (date > new Date()) {
//       setFormData({
//         ...formData,
//         check_out: date,
//       });
//     } else {
//       toast.error('Please select a future date for Check-out', {
//         position: 'top-right',
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//       });
//     }
//   };

//   const handleCheckAvailability = async () => {
//     try {
//       const formattedCheckInDate = format(formData.check_in, "yyyy-MM-dd'T'HH:mm:ss");
//       const formattedCheckOutDate = format(formData.check_out, "yyyy-MM-dd'T'HH:mm:ss");
      
//       const response = await instance.get(`/api/booking/roomlistuser/?check_in=${formattedCheckInDate}&check_out=${formattedCheckOutDate}`);
//       console.log(response.data, "Response Data");
  
//       if (Array.isArray(response.data)) {
//         const availableRooms = response.data.filter(room => room.is_active === true);
//         setAvailableRooms(availableRooms);
//         console.log(availableRooms, "Available Rooms Data");
//       } else {
//         setAvailableRooms([]);
//       }
//     } catch (error) {
//       console.error('Error fetching available rooms:', error);
//       setAvailableRooms([]);
//     }
//   };
  
// useEffect(()=>{

//   if(availableRooms.length>0){
//     navigate('/get-available-rooms/',{state:availableRooms});

//   }
//   },[availableRooms,navigate])


// return (
//   <ThemeProvider theme={defaultTheme}>
//       <CssBaseline />
//       <div className="home-background">
//         <main>
//     {/* Hero unit */}
//     <Banner /> 
//     <br/><br/>
 

//     {/* <Box
//       bg="#ADD8E6"
//       padding={5}
//       margin={17}
//       border="1px solid #ccc"
//       borderRadius="5px"
//     > */}
// <Box padding={5} margin={3} border="1px solid #ccc" borderRadius="5px" bgcolor="#f0f0f0">

//       <Container maxWidth="xl">
//         <Grid container direction="column" alignItems="center">
//           <Typography variant="h4" fontWeight="bold" mb={4}>
//             Welcome to Hotel Booking System
//           </Typography>
//           <Typography variant="h6" mb={8}>
//             Book now to enjoy our limited-time offer
//           </Typography>
          
//           {/* Add your DateSelectionForm component */}
//           <Box bgcolor="white" padding={6} borderRadius="lg" boxShadow={3} mb={8}>
//   <div className={classes.container}>
//     <Typography variant="h4">Check Room Availability</Typography>
//     <br/><br/>
//     <div className={classes.inputContainer}>
//     <Grid item xs={12}>
//             <LocalizationProvider dateAdapter={AdapterDateFns}>
//               <MuiPickersUtilsProvider utils={AdapterDateFns}>
//                 <Grid container spacing={3}>
//                   <Grid item xs={12} md={6}>
//                     <DatePicker
//                       label="Check-in Date"
//                       value={formData.check_in}
//                       onChange={handleCheckInDateChange}
//                       renderInput={(params) => (
//                         <TextField
//                           {...params}
//                           fullWidth
//                           value={formData.check_in ? format(new Date(formData.check_in), 'dd MMMM yyyy hh:mm a') : ''}
//                         />
//                       )}
//                       minDate={new Date()} // Disable past dates
//                     />
//                     <br/><br/>
//                     <DatePicker
//                       label="Check-Out Date"
//                       value={formData.check_out}
//                       onChange={handleCheckOutDateChange}
//                       renderInput={(params) => (
//                         <TextField
//                           {...params}
//                           fullWidth
//                           value={formData.check_out ? format(new Date(formData.check_out), 'dd MMMM yyyy hh:mm a') : ''}
//                         />
//                       )}
//                       minDate={new Date()} // Disable past dates
//                     />
//                   </Grid>
//                 </Grid>
//               </MuiPickersUtilsProvider>
//             </LocalizationProvider>
//           </Grid>
//           </div>
//     <br/>
//     <Button
//         variant="contained"
//         color="primary"
//         onClick={handleCheckAvailability}
//       >
//         Check Availability
//       </Button>
//   </div>
// </Box>


//           {/* Cards Section */}
//           <Grid container spacing={6}>
//             {/* Card 1 */}
//             <Grid item xs={12} md={4}>
//               <Card elevation={3}>
//                 <Link to="/categorylist">
//                   <CardMedia component="img" height="140" image={Hotel1} alt="Certificate" />
//                 </Link>
//                 <Box p={4}>
//                   <Typography variant="h6" fontWeight="bold" mb={2}>
//                   Our Room Facilities
//                   </Typography>
//                   <Typography variant="body1" mb={2}>
//                     Discover the comforts of our in-room amenities
//                   </Typography>
//                   <Button
//     variant="contained"
//     color="primary"
//     component={RouterLink}
//     to="/categorylist"
//     mt={2}
//   >
//     View Here
//   </Button>
//                 </Box>
//               </Card>
//             </Grid>

//             {/* Card 2 */}
//             <Grid item xs={12} md={4}>
//               <Card elevation={3}>
//                 <Link to="/categorylist">
//                   <CardMedia component="img" height="140" image={Hotel2} alt="Career" />
//                 </Link>
//                 <Box p={4}>
//                   <Typography variant="h6" fontWeight="bold" mb={2}>
//                     Feel Good Experience
//                   </Typography>
//                   <Typography variant="body1" mb={2}>
//                     Stay longer and save on your accommodation on very safe
//                   </Typography>
//                   <Button
//     variant="contained"
//     color="primary"
//     component={RouterLink}
//     to="/categorylist"
//     mt={2}
//   >
//     View Here
//   </Button>
//                 </Box>
//               </Card>
//             </Grid>

//             {/* Card 3 */}
//             <Grid item xs={12} md={4}>
//               <Card elevation={3}>
//                 <Link to="/categorylist">
//                   <CardMedia component="img" height="140" image={Hotel3} alt="Computer" />
//                 </Link>
//                 <Box p={4}>
//                   <Typography variant="h6" fontWeight="bold" mb={2}>
//                     Exclusive Offers For you
//                   </Typography>
//                   <Typography variant="body1" mb={2}>
//                     Avail exclusive discounts on your next booking
//                   </Typography>
//                   <Button
//     variant="contained"
//     color="primary"
//     component={RouterLink}
//     to="/categorylist"
//     mt={2}
//   >
//     View Here
//   </Button>
//                 </Box>
//               </Card>
//             </Grid>
//           </Grid>
        
//         </Grid>
//       </Container>
//     </Box>

//     {/* <Container sx={{ py: 8 }} maxWidth="md">
//   <h2 className="text-4xl font-bold text-gray-800 underline">Features</h2> */}


// <Container py={8} maxWidth="md">
//       <Typography variant="h2" component="h2" fontWeight="italic" color="textPrimary" textDecoration="underline" mb={4}>
//         Features
//       </Typography>

//       <Grid container spacing={6}>
//         {cards.map((card, index) => (
//           <Grid item key={index} xs={12} md={6}>
//             <Card elevation={3}>
//               <CardMedia
//                 component="img"
//                 height="200"
//                 image={card.imageUrl}
//                 alt={card.title}
//                 style={{ objectFit: 'cover' }}
//               />
//               <Box p={2}>
//                 <Typography variant="h4" component="h3" mb={1}>
//                   {card.title}
//                 </Typography>
//                 <Typography variant="body1" component="p">
//                   {card.description}
//                 </Typography>
//                 <Button
//     variant="contained"
//     color="primary"
//     component={RouterLink}
//     to="/categorylist"
//     mt={2}
//   >
//     View Here
//   </Button>

//               </Box>
//             </Card>
//           </Grid>
//         ))}
      
//       </Grid>
//     </Container>
//     <br/>

//   </main>
//   </div>

// </ThemeProvider>


// );
// }

// export default HomePage