import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button, Grid, CircularProgress } from '@mui/material';

import { adminInstance } from '../../../utils/Axios';
import { baseUrl } from '../../../utils/constants';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {activateRoomInfo} from '../../../redux/slices/roomslices/roomSlice'

import ReviewList from '../Review/ReviewList';
import instance from '../../../utils/Axios';
import jwtDecode from 'jwt-decode';




import { useSelector} from 'react-redux';







function RoomDetail({rooms}) {

  
  const [roomData, setRoomData] = useState([]);
  console.log(roomData,"roomdataaaaaaaaaaaa");
  const[isRoomData, setIsRoomData] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [reviews,setReviews] = useState([]);
  const dispatch = useDispatch();
  const userInfos = useSelector((state) => state.auth.userInfo);
  const [decodedUserInfo, setDecodedUserInfo] = useState({});

  useEffect(() => {
    if (userInfos) {
      // Decode the token and set the user info state
      const decodedInfo = jwtDecode(userInfos.access); // Assuming 'access' contains user details
      setDecodedUserInfo(decodedInfo);
    }
;
}, [userInfos]);
 const userId = decodedUserInfo.user_id

  useEffect(() => {
    // Fetch the room detail for the specified room ID
    adminInstance
      .get(`booking/room-detail/${id}/`)
      .then((response) => response.data)
      .then((data) => {
        console.log('Room data:',data);
        if (Array.isArray(data) && data.length > 0) {

        setRoomData(data[0]);
        dispatch(activateRoomInfo(data[0]))
        setIsRoomData(true);
      }      else {
        console.error('Error: Invalid room data format');
      }
    })
      .catch((error) => {
        console.error('Error fetching room detail:', error);
        setIsRoomData(false);

      });
  }, [id]);
  const handleReview = ()=>{
   navigate(`/add-review/${id}/${userId}`);
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


  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await instance.get(`/api/booking/room-reviews/${id}/`);
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
  
    fetchReviews();
  }, [id]);

  
  return (
    <div className="p-4 room-container">
      <div className="text-center my-5">
      <h4 className="text-4xl font-bold text-primary-main border-b-4 border-blue-500 inline-block">Room Detail</h4>
        <div className="w-40 h-2 bg-primary-main mx-auto mt-2"></div>
      </div>
  
      {!isRoomData && (
        <div className="flex justify-center">
          <CircularProgress size={40} color="primary" />
        </div>
      )}
  
      {isRoomData && roomData && roomData.id && (
        <div className="container mx-auto">
          <div className="flex justify-center space-x-2">
            <div className="w-full md:w-1/2">
              <div className="card">
                {/* Display the first image as the cover image */}
                <div className="image-container">
                  <img
                    src={`${baseUrl}${roomData.cover_image}`}
                    alt={roomData.title}
                    className="card-image"
                  />
                </div>
              </div>
            </div>
  
            <div className="w-full md:w-1/2">
              <div className="card">
                <div className="card-content">
                  <h6 className="text-xl font-bold mb-4">{roomData.title}</h6>
                  <p className="text-sm text-gray-500 mb-4">
                    Category: {roomData ? roomData.category.category_name : 'Not available'}
                  </p>
                  <p className="text-lg text-primary-main mb-4">
                    Price Per Day: ₹{roomData.price_per_night}
                  </p>
                  <p className="text-lg text-primary-main mb-4">
                    Room Status: {roomData?.is_active === true ? 'Available' : 'Not Available'}
                  </p>
                  <p className="text-lg text-primary-main mb-4">
                    Capacity: Maximum {roomData.capacity} people
                  </p>
                  <p className="text-lg text-primary-main mb-4">
                    Room Size: {roomData.room_size} sq.ft
                  </p>
                  <p className="text-lg text-primary-main mb-4">Meals Included</p>
                  <p className="text-lg text-primary-main mb-4">
                    Features: {roomData.features ? roomData.features.map((feature) => feature.name).join(', ') : 'Not available'}
                  </p>
                  <div className="description-container">
                    <h5 className="text-2xl text-black mb-2">Description</h5>
                    <p className="text-lg text-gray-700">{roomData.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
     
  
          
          <div className="mt-4 flex justify-center">
  <button
    onClick={handleReview}
    className="bg-gradient-to-r from-blue-900 to- blue-500 text-black px-6 py-3 rounded-full transition-transform hover:scale-105"
  >
    Add a Review
  </button>
</div>



<div className="mt-4 flex justify-center space-x-2">
  <button
    onClick={handleBooking}
    className="bg-blue-700 text-white px-4 py-2 rounded-full transition-transform hover:scale-105"
  >
    Book Now
  </button>
</div>

<br/>


  <button
    onClick={handleRooms}
    className="border border-primary-main text-primary-main px-4 py-2 rounded-full transition-transform hover:scale-105 hover:bg-primary-light"
  >
    Back to Room List
  </button>
</div>

      )}
      <br/><br/>
      <ReviewList/>
    </div>
  );
      }
      export default RoomDetail;


















































