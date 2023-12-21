import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Typography,Button } from '@mui/material';
import instance from '../../../utils/Axios';
import { Link } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
import { baseUrl } from '../../../utils/constants';
import jwtDecode from 'jwt-decode';

import {activateRoomInfo} from '../../../redux/slices/roomslices/roomSlice'

const ReviewList = () => {
  const dispatch = useDispatch();
  const [reviews, setReviews] = useState([]);
  const user=useSelector((state) => state.auth.userInfo);
  const [decodeInfo,setDecodeInfo]=useState({});
  const rooms = useSelector((state)=> state.room.roomInfo);
  const roomId = rooms.id 
  useEffect(() => {
    if (user) {
      // Decode the token and set the user info state
      const decodedInfo = jwtDecode(user.access); // Assuming 'access' contains user details
      console.log(decodedInfo);
      setDecodeInfo(decodedInfo);
    }
    if (rooms){
    // Fetch room info and user info when component mounts
    dispatch(activateRoomInfo(rooms));
    // dispatch(userInfos());
  }}, [dispatch,roomId,]);
    useEffect(() => {
      // Fetch existing reviews from the backend
      instance.get(`${baseUrl}/api/booking/reviews/${roomId}`) // Replace with your backend endpoint
        .then(response => {
          setReviews(response.data);
        })
        .catch(error => {
          console.error('Error fetching reviews:', error);
        });
    }, []);

  return (
    <div>
      <Typography variant="h5">Room Reviews</Typography>
      <List>
        {reviews.map((review) => (
          <ListItem key={review.id} sx={{ border: '1px solid #ccc', borderRadius: '5px', marginBottom: '10px' }}>
            <ListItemText>
              <Typography variant="body1">Rating: {review.rating}</Typography>
              <Typography variant="body2">Comment: {review.comment}</Typography>
            </ListItemText>
          </ListItem>
        ))}
      </List>
   
    </div>
  );
};

export default ReviewList;

