import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid } from '@mui/material'; 
import { baseUrl } from '../../../utils/constants';
import { adminInstance } from '../../../utils/Axios';
import { useNavigate } from 'react-router-dom';

function CategoryList() {
  const [categoryList, setCategoryList] = useState([]);
  console.log(categoryList,"categoryyyyyyyyy");
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
    <div className="p-4 room-container">
      <div className="text-center my-5">
      <h4 className="text-4xl font-bold text-primary-main border-b-4 border-blue-500 inline-block">Room Categories</h4>
        <div className="w-40 h-2 bg-primary-main mx-auto mt-2"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categoryList.map((category, index) => (
          <div key={index} className="p-2 rounded-lg shadow-lg bg-white">
            <img
              src={category.image}
              alt={category.category_name}
              className="w-full h-48 object-cover rounded-md"
            />
            <h5 className="text-xl font-bold text-primary-main mt-2 mb-4 text-center">
              {category.category_name}
            </h5>
            <button
  onClick={handleRoomList}
  className="bg-blue-700 text-white px-4 py-2 w-full rounded-full transition-transform hover:scale-105 hover:bg-primary-dark border border-white"
 
>
  Go to Rooms
</button>


          </div>
        ))}
      </div>
    </div>
  );
        }  

export default CategoryList;













