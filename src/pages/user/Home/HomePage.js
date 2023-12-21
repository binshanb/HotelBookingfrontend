// import * as React from 'react';
import React,{useEffect, useState} from 'react';



import { useNavigate } from 'react-router-dom';
import Hotel1 from '../../../assets/hotel51.jpg' 
import Hotel2 from '../../../assets/hotel2.png' 
import DateSelectionForm from '../Bookings/AvailableRoomsPage';
import Hotel3 from '../../../assets/hotel16.jpg' 
import { Carousel } from 'react-responsive-carousel';
import instance from '../../../utils/Axios';
// import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
// import Grid from '@mui/material/Grid';
import { Link as RouterLink } from 'react-router-dom';
// import Stack from '@mui/material/Stack';
// import Box from '@mui/material/Box';
// import Toolbar from '@mui/material/Toolbar';
// import Container from '@mui/material/Container';
// import Link from '@mui/material/Link';
import { ThemeProvider, createTheme } from '@mui/material/styles';
// import Footer from './home/Footer';
import Typography from '@mui/material/Typography';
import Banner from './Banner';
import './HomePage.css'
import hotelImage from '../../../assets/hotel10.jpg';
import hotelImage1 from '../../../assets/hotel11.jpg';
import hotelImage2 from '../../../assets/hotel50.jpg';
import hotelImage3 from '../../../assets/hotel13.jpg';
import hotelImage4 from '../../../assets/hotel14.jpg';
import hotelImage5 from '../../../assets/hotel15.jpg';
import ImageCarousel from './Banner';
import RoomAvailabilityChecker from '../Bookings/AvailableRoomsPage';
import { Box, Container, Flex, Text, SimpleGrid, Button,Grid,Link,Card } from '@mui/material';
import { TextField,List, ListItem, ListItemText  } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { baseUrl } from '../../../utils/constants';



const useStyles = makeStyles({
  card: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%', // Maintain full height of the card
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9 aspect ratio for the images
  },
  cardContent: {
    flexGrow: 1,
  },
});

const rooms = [
  { id: 1, name: "Single Room", price: 1300},
  { id: 2, name: "Double Room", price: 2500},
  { id: 3, name: "Triple Room", price: 3500 },
  { id: 4, name: "Family Room", price: 5000 },

  // Add more room objects as needed
];

const cards = [
  {
    id: 1,
    title: 'Free Wi-Fi',
    description: 'Stay connected with complimentary high-speed Wi-Fi throughout your stay.',
    imageUrl: hotelImage, // Replace with your image URL
  },
  {
    id: 2,
    title: 'Spacious Rooms',
    description: 'Relax in our spacious and well-furnished rooms.',
    imageUrl: hotelImage1, // Replace with your image URL
  },
  {
    id: 3,
    title: 'Gourmet Dining',
    description: 'Savor delectable dishes at our on-site restaurant.',
    imageUrl: hotelImage2, // Replace with your image URL
  },
  {
    id: 4,
    title: 'Room Service',
    description: 'Enjoy the convenience of 24/7 room service.',
    imageUrl: hotelImage3, // Replace with your image URL
  },
  {
    id: 5,
    title: 'Swimming Pool',
    description: 'Take a refreshing dip in our pristine swimming pool.',
    imageUrl: hotelImage4, // Replace with your image URL
  },
  {
    id: 6,
    title: 'Concierge Services',
    description: 'Assist with travel arrangements and help you plan your activities and excursions.',
    imageUrl: hotelImage5, // Replace with your image URL
  },
];

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

function HomePage() {

  const navigate = useNavigate();
  const [checkInDate, setCheckInDate] = useState(null);
  console.log(checkInDate,"dateeeeeeee");
  const [checkOutDate, setCheckOutDate] = useState(null);
  console.log(checkOutDate,"checkoutttttt");
  const [availableRooms, setAvailableRooms] = useState([]);
  
  const classes = useStyles();


  const handleCheckAvailability = async () => {
    try {
      const response = await instance.get(`${baseUrl}/api/booking/roomlistuser/?check_in=${checkInDate}&check_out=${checkOutDate}`);
      console.log(response.data, "Response Data"); // Assuming the response data has 'is_active' property
      if (Array.isArray(response.data)) {
        const availableRooms = response.data.filter(room => room.is_active === true);
        setAvailableRooms(availableRooms);
        console.log(availableRooms, "Available Rooms Data");
       
        
      } 
      else {
        setAvailableRooms([]); // If not active, set available rooms to empty array
      }
    } catch (error) {
      console.error('Error fetching available rooms:', error);
      setAvailableRooms([]); // Set availability to false in case of an error
    }
  };

useEffect(()=>{

  if(availableRooms.length>0){
    navigate('/get-available-rooms/',{state:availableRooms});

  }
  },[availableRooms,navigate])


return (
  <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <div className="home-background">
        <main>
    {/* Hero unit */}
    <Banner /> 
    <br/><br/>
 

    {/* <Box
      bg="#ADD8E6"
      padding={5}
      margin={17}
      border="1px solid #ccc"
      borderRadius="5px"
    > */}
     <Box padding={5} margin={17} border="1px solid #ccc" borderRadius="5px">
      <Container maxWidth="xl">
        <Grid container direction="column" alignItems="center">
          <Typography variant="h4" fontWeight="bold" mb={4}>
            Welcome to Hotel Booking System
          </Typography>
          <Typography variant="h6" mb={8}>
            Book now to enjoy our limited-time offer
          </Typography>
          
          {/* Add your DateSelectionForm component */}
          <Box bgcolor="white" padding={6} borderRadius="lg" boxShadow={3} mb={8}>
  <div className={classes.container}>
    <Typography variant="h4">Check Room Availability</Typography>
    <div className={classes.inputContainer}>
      <TextField
        label="Check-in Date"
        type="date"
        onChange={(e) => setCheckInDate(e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
      />
    </div>
    <br/>
    <div className={classes.inputContainer}>
      <TextField
        label="Check-out Date"
        type="date"
        onChange={(e) => setCheckOutDate(e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
      />
    </div>
    <br/>
    <Button
      variant="contained"
      color="primary"
      onClick={handleCheckAvailability}
      className={classes.button}
    >
      Check Availability
    </Button>
  </div>
</Box>


          {/* Cards Section */}
          <Grid container spacing={6}>
            {/* Card 1 */}
            <Grid item xs={12} md={4}>
              <Card elevation={3}>
                <Link to="/categorylist">
                  <CardMedia component="img" height="140" image={Hotel1} alt="Certificate" />
                </Link>
                <Box p={4}>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                  Our Room Facilities
                  </Typography>
                  <Typography variant="body1" mb={2}>
                    Discover the comforts of our in-room amenities
                  </Typography>
                  <Link to="/categorylist">Explore More</Link>
                </Box>
              </Card>
            </Grid>

            {/* Card 2 */}
            <Grid item xs={12} md={4}>
              <Card elevation={3}>
                <Link to="/categorylist">
                  <CardMedia component="img" height="140" image={Hotel2} alt="Career" />
                </Link>
                <Box p={4}>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Feel Good Experience
                  </Typography>
                  <Typography variant="body1" mb={2}>
                    Stay longer and save on your accommodation
                  </Typography>
                  <Link to="/categorylist">Discover More</Link>
                </Box>
              </Card>
            </Grid>

            {/* Card 3 */}
            <Grid item xs={12} md={4}>
              <Card elevation={3}>
                <Link to="/categorylist">
                  <CardMedia component="img" height="140" image={Hotel3} alt="Computer" />
                </Link>
                <Box p={4}>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Exclusive Offers
                  </Typography>
                  <Typography variant="body1" mb={2}>
                    Avail exclusive discounts on your next booking
                  </Typography>
                  <Link to="/categorylist">Book Now</Link>
                </Box>
              </Card>
            </Grid>
          </Grid>
        
        </Grid>
      </Container>
    </Box>

    {/* <Container sx={{ py: 8 }} maxWidth="md">
  <h2 className="text-4xl font-bold text-gray-800 underline">Features</h2> */}

<Container py={8} maxWidth="lg">
      <Typography variant="h2" component="h2" fontWeight="bold" color="textPrimary" textDecoration="underline" mb={4}>
        Features
      </Typography>

      <Grid container spacing={6}>
        {cards.map((card, index) => (
          <Grid item key={index} xs={12} md={4}>
            <Card elevation={3}>
              <CardMedia
                component="img"
                height="200"
                image={card.imageUrl}
                alt={card.title}
                style={{ objectFit: 'cover' }}
              />
              <Box p={2}>
                <Typography variant="h4" component="h3" mb={1}>
                  {card.title}
                </Typography>
                <Typography variant="body1" component="p">
                  {card.description}
                </Typography>
                <Button
    variant="contained"
    color="primary"
    component={RouterLink}
    to="/categorylist"
    mt={2}
  >
    View Here
  </Button>

              </Box>
            </Card>
          </Grid>
        ))}
      
      </Grid>
    </Container>
    <br/>

  </main>
  </div>

</ThemeProvider>


);
}

export default HomePage