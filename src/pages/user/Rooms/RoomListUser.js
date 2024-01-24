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
    <div className="p-4 room-container">
      {/* Category dropdown for filtering */}
      <div className="w-1/2 max-w-400 mx-auto">
        <div>
          
      <h4 className="text-4xl font-bold text-primary-main border-b-4 border-blue-500 inline-block">Room List</h4>
        <br/><br/>
          <label htmlFor="category" className="text-base mb-2 block">
            Select Category:
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full border p-2 rounded mb-4"
          >
            <option value="all">All</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="priceRange" className="text-base mb-2 block">
            Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
          </label>
          <input
            type="range"
            id="priceRange"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            min={0}
            max={10000}
            className="w-full"
          />
        </div>
      </div>
      <br/><br/>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRooms.map((room, index) => (
          <div key={index}>
            <img src={room.cover_image} alt={room.title} className="h-200 w-full object-cover" />
            <div className="p-4">
              <h6 className="text-xl mb-2">Name: {room.title}</h6>
              <p className="text-lg mb-2">Price Per Day: ₹{room.price_per_night}</p>
              <RouterLink to={`/room-detail/${room.id}/`}>
                <button className="bg-blue-700 text-white px-4 py-2 rounded-full transition-transform hover:scale-105 hover:bg-primary-dark">
                  View Details
                </button>
              </RouterLink>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination component */}
      <div className="mt-4 flex justify-center">
        <nav aria-label="Pagination">
          <ul className="pagination">
            {Array.from({ length: Math.ceil(filteredRooms.length / roomsPerPage) }, (_, index) => (
              <li key={index} className={`page-item ${index + 1 === currentPage ? 'active' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default RoomListUser;



