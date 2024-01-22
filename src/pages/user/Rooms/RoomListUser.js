import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Select, Slider, SliderTrack, SliderRail, SliderThumb, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import MenuItem from '@mui/material/MenuItem';
import { adminInstance } from '../../../utils/Axios';
import { baseUrl } from '../../../utils/constants';
import { useParams } from 'react-router-dom';
import { Pagination } from '@mui/lab';




function RoomListUser() {
  const [roomList, setRoomList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all'); // State for category selection
  console.log(selectedCategory,"selected");
  const [priceRange, setPriceRange] = useState([0, 10000]); // State for price range selection
  const {id} = useParams()

  
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 6; 
 
  

  useEffect(() => {
    // Fetch the list of rooms and update state
    adminInstance.get(`${baseUrl}/api/booking/roomlistuser/`)
       
      .then((response) => response.data)
    
      .then((data) => setRoomList(data))
  
      .catch((error) => console.error('Error fetching rooms:', error));
  }, []);
  
  const categories = [...new Set(roomList.map(room => room.category.category_name))];
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value); // Update selected category
  };
  console.log(selectedCategory,'selected')
console.log(roomList,'RRRRRRRRRRR');
  const filteredRooms = roomList.filter((room) => {
    // let meetsCategoryCriteria = true;
    // let meetsPriceCriteria = true;
  
    // if (selectedCategory !== 'all') {
  const meetsCategoryCriteria = selectedCategory === 'all' || room.category.category_name === selectedCategory;
    
  
  const roomPrice = parseInt(room.price_per_night);
  const meetsPriceCriteria = roomPrice >= priceRange[0] && roomPrice <= priceRange[1];
  
    return meetsCategoryCriteria && meetsPriceCriteria;
  });
 
  const selectStyle = {
    marginBottom: '8px',
    width: '20%',
    
  };

  const sliderStyle = {
    marginTop: '16px', 
    
  };
  
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

  // Function to handle page changes
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };


  return (
    <>
      <Box p={4} className="room-container">
        {/* Category dropdown for filtering */}
        <Card style={{ width: '50%', maxWidth: '400px', margin: 'auto' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Select Category:</Typography>
        <Select
          value={selectedCategory}
          onChange={handleCategoryChange}
          displayEmpty
          style={selectStyle}
        >
          <MenuItem value="all">All</MenuItem>
          {categories.map((category, index) => (
            <MenuItem key={index} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>

        <Typography variant="h6" gutterBottom>Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}</Typography>
        <Slider
          value={priceRange}
          onChange={(e, value) => setPriceRange(value)}
          valueLabelDisplay="auto"
          min={0}
          max={10000}
          style={sliderStyle}
        />
      </CardContent>
    </Card>
  
        <Typography variant="h4" align="center" gutterBottom>
          Room List
        </Typography>
  
        <Grid container spacing={4}>
          {filteredRooms.map((room, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <img src={room.cover_image} alt={room.title} style={{ height: '200px', width: '100%', objectFit: 'cover' }} />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Name: {room.title}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    Price Per Day: ₹ {room.price_per_night}
                  </Typography>
               
                  <Button
                    component={RouterLink}
                    to={`/room-detail/${room.id}/`}
                    variant="contained"
                    color="primary"
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
        {/* Pagination component */}
        <Box mt={4} display="flex" justifyContent="center">
        <Pagination
          count={Math.ceil(filteredRooms.length / roomsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          size="large"
          boundaryCount={1} // Show first and last pages
          siblingCount={2} // Show two pages before and after the current page
        />
      </Box>
      </>
    );
  }

export default RoomListUser;



