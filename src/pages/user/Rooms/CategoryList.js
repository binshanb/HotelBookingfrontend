import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid } from '@mui/material'; 
import { baseUrl } from '../../../utils/constants';
import { adminInstance } from '../../../utils/Axios';
import { useNavigate } from 'react-router-dom';

function CategoryList() {
  const [categoryList, setCategoryList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the room categories and update state
    adminInstance.get(`${baseUrl}/api/booking/admin/room-category/`)
      .then((response) => response.data)  // Use response.data instead of response.json()
      .then((data) => setCategoryList(data))
      .catch((error) => console.error('Error fetching categories:', error));
  }, []);
  const handleRoomList=()=>{
    navigate('/roomlistuser')
  }

  return (
    <Box p={4} className="room-container">
    <Box textAlign="center" my={5}>
      <Typography variant="h4" fontWeight="bold" color="textPrimary">
        Room Categories
      </Typography>
      <Box width="40px" height="2px" bgcolor="primary.main" mx="auto" mt={2}></Box>
    </Box>
    <Grid container spacing={2}>
      {categoryList.map((category, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Box p={2} borderRadius={8} boxShadow={1} bgcolor="background.paper">
            <img src={category.image} alt={category.category_name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }} />
            <Typography variant="h5" fontWeight="bold" color="textPrimary" mb={2} textAlign="center">
              {category.category_name}
            </Typography>
            <Button
              onClick={handleRoomList}
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              sx={{
                '&:hover': {
                  transform: 'scale(1.05)',
                  bgcolor: 'primary.dark',
                },
              }}
            >
              Go to Rooms
            </Button>
          </Box>
        </Grid>
      ))}
    </Grid>
  </Box>
);
}

export default CategoryList;













