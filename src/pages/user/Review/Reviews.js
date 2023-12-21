import React, { useState, useEffect } from 'react';
import instance from '../../../utils/Axios';
import jwtDecode from 'jwt-decode';
import { baseUrl } from '../../../utils/constants';
import {activateRoomInfo} from '../../../redux/slices/roomslices/roomSlice'
import { useSelector,useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List, ListItem, ListItemText, Divider
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  formControl: {
    minWidth: 120,
    marginBottom: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));
const Reviews = () => {

  const classes = useStyles();
  const dispatch = useDispatch();
  const [reviews, setReviews] = useState([]);
  console.log(reviews,"reviewssssssssssssss");
  const user=useSelector((state) => state.auth.userInfo);
  const [decodeInfo,setDecodeInfo]=useState({});
  const rooms = useSelector((state)=> state.room.roomInfo);
  const roomId = rooms.id 
  console.log(rooms,"roomssssssssssss");
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [formData, setFormData] = useState({
    rating: '',
    comment: '',
  });

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleRoomSelect = (roomId) => {
    setSelectedRoomId(roomId);
    try {
      // Fetch reviews for the selected room
      instance.get(`${baseUrl}/api/booking/reviews/${roomId}/`) // Adjust the endpoint to fetch reviews based on room ID
        .then((response) => {
          setReviews(response.data);
        })
        .catch((error) => {
          console.error('Error fetching room reviews:', error);
        });
    } catch (error) {
      // Handle any synchronous errors here
      console.error('Synchronous error:', error);
    }
  };
  
    

  const handleSubmit = (e) => {
    e.preventDefault();
    const postData = {
      customer: decodeInfo.user_id,
      room: roomId, // Ensure roomId is defined or passed correctly to this function
      rating: formData.rating,
      comment: formData.comment
    };
  
    console.log(postData, "posttttttttttttttttt");
  
    try {
      instance.post(`${baseUrl}/api/booking/add-review/${roomId}/`, postData)
        .then(response => {
          console.log('Review added:', response.data);
          alert("Review added successfully");
  
          // Update reviews state to include the newly added review
          setReviews([...reviews, response.data]);
  
          // Reset form data after successful submission
          setFormData({
            rating: '',
            comment: '',
          });
        })
        .catch(error => {
          if (error.response) {
            // Handle error response from the server
            console.error('Error response from server:', error.response.data);
            console.error('Status code:', error.response.status);
            console.error('Headers:', error.response.headers);
            // Handle the error (show an error message, etc.)
          } else if (error.request) {
            // Handle request made but no response received
            console.error('Request made but no response received:', error.request);
            // Handle the error (show an error message, etc.)
          } else {
            // Handle other errors
            console.error('Error setting up the request:', error.message);
            // Handle the error (show an error message, etc.)
          }
        });
    } catch (error) {
      // Handle any synchronous errors here
      console.error('Synchronous error:', error);
      // Handle the error (show an error message, etc.)
    }
  };
  

  return (
    <div className={classes.root}>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
      <FormControl className={classes.formControl}>
            <InputLabel htmlFor="room-select">Select Room:</InputLabel>
            <Select
              value={selectedRoomId || ''}
              onChange={(e) => handleRoomSelect(e.target.value)}
              inputProps={{
                name: 'room-select',
                id: 'room-select',
              }}
            >
              {/* Map through available rooms */}
              {reviews.map((review) => (
                <MenuItem key={review.id} value={review.roomId}>
                  {review.title}
                  {/* {room.client} - {room.uuid} */}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        <Paper className={classes.paper}>
          <Typography variant="h6">Review Form</Typography>
          <form onSubmit={handleSubmit}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="rating">Rating:</InputLabel>
              <Select
                value={formData.rating}
                onChange={handleChange}
                inputProps={{
                  name: 'rating',
                  id: 'rating',
                }}
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              id="comment"
              name="comment"
              label="Comment"
              multiline
              rows={4}
              value={formData.comment}
              onChange={handleChange}
              fullWidth
            />

            <Button type="submit" variant="contained" color="primary">
              Submit Review
            </Button>
          </form>
        </Paper>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Paper className={classes.paper}>
          {selectedRoomId && (
              <React.Fragment>
            <Typography variant="h6">Existing Reviews</Typography>
            <List>
              {reviews.map((review) => (
                   <React.Fragment key={review.id}>
                   <ListItem alignItems="flex-start">
                     <ListItemText
                       secondary={
                         <React.Fragment>
                            {/* Display user email */}
                            <Typography variant="body2" color="textSecondary">
                                User Email: {review.user_email}
                           <Typography component="span" variant="body2" color="textPrimary">
                             Rating: {review.rating}
                           </Typography>
                           <Typography variant="body2" color="textSecondary">
                             {review.comment}
                           </Typography>
                           
                              </Typography>
                         </React.Fragment>
                       }
                     />
                   </ListItem>
                   <Divider variant="inset" component="li" />
                 </React.Fragment>
               ))}
             </List>
           </React.Fragment>
         )}
         {!selectedRoomId && (
           <Typography variant="body2">Select a room to view reviews.</Typography>
         )}
                      </Paper>
                    </Grid>
                    </Grid>
    </Grid>
  </div>
);
};

export default Reviews;













//     <div>
//       <h2>Review Form</h2>
//       <form onSubmit={handleSubmit}>

//         <label htmlFor="rating">Rating:</label>
//         <select id="rating" name="rating" value={formData.rating} onChange={handleChange}>
//           <option value="1">1</option>
//           <option value="2">2</option>
//           <option value="3">3</option>
//           <option value="4">4</option>
//           <option value="5">5</option>
//         </select><br />

//         <label htmlFor="comment">Comment:</label><br />
//         <textarea id="comment" name="comment" value={formData.comment} onChange={handleChange}></textarea><br />
        

//         <button type="submit">Submit Review</button>
//       </form>

//       <h2>Existing Reviews</h2>
//       {reviews.map(review => (
//         <div key={review.id}>
//           <p>Room: {review.room_id} | Rating: {review.rating} | Comment: {review.comment}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Reviews;























// import React, { useState,useEffect } from 'react';
// import { makeStyles } from '@mui/styles';
// import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';
// import Rating from '@mui/material/Rating';
// import Box from '@mui/material/Box';
// import {useSelector,useDispatch } from 'react-redux';
// import { baseUrl } from '../../../utils/constants';
// import { activateRoomInfo } from '../../../redux/slices/roomslices/roomSlice';
// import { useNavigate } from 'react-router-dom';
// import instance from '../../../utils/Axios';
// import jwtDecode from 'jwt-decode';
// // import { addReview } from '../../redux/actions/reviewActions'; // Assuming an action for adding a review

// const useStyles = makeStyles((theme) => ({
//   formContainer: {
//     padding: theme.spacing,
//     '& .MuiTextField-root': {
//       marginBottom: theme.spacing,
//     },
//   },
// }));

// const ReviewForm = ({ roomId, customerId }) => {
//   const classes = useStyles();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const roomInfo= useSelector((state) => state.room.roomInfo);
//   console.log( roomInfo,"gggggg")


//   const userInfos = useSelector((state) => state.auth.userInfo);
  
//   const [decodedUserInfo, setDecodedUserInfo] = useState({});


//   const [formData, setFormData] = useState({
//     rating: 0,
//     comment: '',
//   });
//   console.log(formData,"kloooopooo");
// console.log(formData,"dataaaaaaaaaaaa");

// useEffect(() => {
//     if (userInfos) {
//       // Decode the token and set the user info state
//       const decodedInfo = jwtDecode(userInfos.access); // Assuming 'access' contains user details
//       console.log(decodedInfo);
//       setDecodedUserInfo(decodedInfo);
//     }
//     if (roomId){
//     // Fetch room info and user info when component mounts
//     dispatch(activateRoomInfo(roomId));
//     // dispatch(userInfos());
// }}, [dispatch,roomId]);
//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleRatingChange = (newValue) => {
//     setFormData({
//       ...formData,
//       rating: newValue,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try{
//         const response = await instance.post('/api/booking/add-reviews/', formData);
//          console.log('Review Added:', response.data);

//          alert('Review Added');
//     }
//     catch (error) {
//         console.error('Error creating booking:', error);
//     if (error.response) {
//       console.error('Response data:', error.response);
//           }
// alert('An error occurred while booking. Please try again.');
// }
// }

//   return (
//     <div>
//       <h2>Write a Review</h2>
//       <form className={classes.formContainer} onSubmit={handleSubmit}>
//       <TextField
//           label="Customer"
//           multiline
//           rows={4}
//           variant="outlined"
//           name="customer"
//           value={decodedUserInfo.user_id}
//           onChange={handleChange}
//           fullWidth
//         />
//             <TextField
//           label="Comment"
//           multiline
//           rows={4}
//           variant="outlined"
//           name="comment"
//           value={roomInfo.id}
//           onChange={handleChange}
//           fullWidth
//         />
//         <Box component="fieldset" mb={3} borderColor="transparent">
//           <legend>Rating</legend>
//           <Rating
//             name="rating"
//             value={formData.rating}
//             onChange={(event, newValue) => {
//               handleRatingChange(newValue);
//             }}
//           />
//         </Box>
//         <TextField
//           label="Comment"
//           multiline
//           rows={4}
//           variant="outlined"
//           name="comment"
//           value={formData.comment}
//           onChange={handleChange}
//           fullWidth
//         />
//         <Button type="submit" variant="contained" color="primary" size="large">
//           Submit Review
//         </Button>
//       </form>
//     </div>
//   );
// };

// export default ReviewForm;








































// // ReviewFormComponent.js

// import React, { useState } from 'react';
// import instance from '../../../utils/Axios';
// import { useSelector} from 'react-redux';


// const ReviewForm = ({ roomId }) => {
//   const [rating, setRating] = useState('');
//   const [comment, setComment] = useState('');

//   const roomInfo= useSelector((state) => state.room.roomInfo);
//   const userInfos = useSelector((state) => state.auth.userInfo);
//   const [decodedUserInfo, setDecodedUserInfo] = useState({});

//   useEffect(() => {
//     if (userInfos) {
//       // Decode the token and set the user info state
//       const decodedInfo = jwtDecode(userInfos.access); // Assuming 'access' contains user details
//       console.log(decodedInfo);
//       setDecodedUserInfo(decodedInfo);
//     }
//     if (roomId){
//     // Fetch room info and user info when component mounts
//     dispatch(activateRoomInfo(roomId));
//     // dispatch(userInfos());
// }}, [dispatch,roomId]);

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await instance.post('/api/booking/reviews/', {
//         room: roomId,
//         rating: rating,
//         comment: comment,
//       });

//       console.log('Review added:', response.data);
//       // You can add further logic after submitting the review, like updating the UI.
//     } catch (error) {
//       console.error('Error adding review:', error);
//     }
//   };

//   return (
//     <div>
//       <h2>Add Review</h2>
//       <form onSubmit={handleFormSubmit}>
//         <label>
//           Rating:
//           <input type="number" min="1" max="5" value={rating} onChange={(e) => setRating(e.target.value)} />
//         </label>
//         <br />
//         <label>
//           Comment:
//           <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
//         </label>
//         <br />
//         <button type="submit">Submit Review</button>
//       </form>
//     </div>
//   );
// };

// export default ReviewForm;


// import React, { useState,useEffect } from 'react';
// import { Button, Rating, TextField, Typography } from '@mui/material';
// import { useSelector,useDispatch } from 'react-redux';
// import instance from '../../../utils/Axios'; // Import your Axios instance
// import { baseUrl } from '../../../utils/constants';
// import jwtDecode from 'jwt-decode';
// import { activateRoomInfo } from '../../../redux/slices/roomslices/roomSlice';

// const ReviewForm = () => {

//   const dispatch = useDispatch();
//   const [rating, setRating] = useState(0);
//   console.log(rating,"0000000000000000000");
//   const [comment, setComment] = useState('');
//   console.log(comment,"commmm");
//   // Fetch the user ID from Redux state
//   const userId = useSelector((state) => state.auth.userInfo);
//   console.log(userId,"userrrrrr");
//   const roomId = useSelector((state) => state.room.roomInfo);
//   console.log(roomId,"roomId");

//   const [decodedUserInfo, setDecodedUserInfo] = useState({});
//   console.log(decodedUserInfo,"infooooooooooo");

//   useEffect(() => {
//     if (userId) {
//       // Decode the token and set the user info state
//       const decodedInfo = jwtDecode(userId.access); // Assuming 'access' contains user details
//       console.log(decodedInfo);
//       setDecodedUserInfo(decodedInfo);
//     } if (roomId){
//       // Fetch room info and user info when component mounts
//       dispatch(activateRoomInfo(roomId));
//       // dispatch(userInfos());
//   }}, [dispatch,roomId]);

//   const handleRatingChange = (event, newRating) => {
//     setRating(newRating);
//   };


//   const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     try {
//       const response = await instance.post(`${baseUrl}/api/booking/add-reviews/`, {
//         room: roomId.id,
//         customer: decodedUserInfo.user_id,
//         rating: rating, // Ensure 'rating' is the correct value
//         comment: comment, // Ensure 'comment' is the correct value
//       });
      
//       console.log('Review submitted:', response.data);
//       alert("Review Added Successfully")
      
//       // Additional logic after successful review submission
//     } catch (error) {
//       console.error('Error submitting review:', error);
//       // Handle error scenario
//     }
//   };
//   return (
//     <div>
//       <Typography variant="h5">Add Review</Typography>
//       <form onSubmit={handleSubmit}>
//         <Rating
//           name="simple-controlled"
//           value={rating}
//           onChange={handleRatingChange}
//           precision={1}
//           size="large"
//         />
//         <TextField
//           label="Comment"
//           multiline
//           rows={4}
//           value={comment}
//           onChange={(e) => setComment(e.target.value)}
//           variant="outlined"
//           fullWidth
//           margin="normal"
//         />
//         <Button variant="contained" color="primary" type="submit">
//           Submit Review
//         </Button>
//       </form>
//       <br />
//     </div>
//   );
// };

// export default ReviewForm;

// import React, { useState } from 'react';
// import axios from 'axios';
// import { makeStyles } from '@mui/styles';
// import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';
// import { baseUrl } from '../../../utils/constants';
// import { useSelector } from 'react-redux';

// const useStyles = makeStyles((theme) => ({
//   formContainer: {
//     '& .MuiTextField-root': {
//       marginBottom: theme.spacing(2),
//     },
//   },
// }));

// const ReviewForm = ({ roomId, userId }) => {
//   const classes = useStyles();
//   const roomInfo = useSelector((state) => state.room.roomInfo);
//   const userInfo = useSelector((state) => state.auth.userInfo);
//   const [formData, setFormData] = useState({
//     rating: '',
//     comment: '',
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const reviewData = {
//         room: roomId,
//         customer: userId,
//         rating: formData.rating,
//         comment: formData.comment,
//       };

//       const response = await axios.post(`${baseUrl}/api/booking/add-reviews/`, reviewData);

//       console.log('Review created:', response.data);
//       // Additional logic after successful review creation, if needed

//       setFormData({
//         rating: '',
//         comment: '',
//       });
//     } catch (error) {
//       console.error('Error creating review:', error);
//       alert('An error occurred while creating a review. Please try again.');
//     }
//   };

//   return (
//     <div>
//       <h2>Write a Review</h2>
//       <form className={classes.formContainer} onSubmit={handleSubmit}>
//         <TextField
//           label="Rating"
//           type="number"
//           name="rating"
//           value={formData.rating}
//           onChange={handleChange}
//           required
//           InputProps={{
//             inputProps: { min: 1, max: 5 },
//           }}
//           fullWidth
//         />
//         <TextField
//           label="Comment"
//           name="comment"
//           value={formData.comment}
//           onChange={handleChange}
//           required
//           multiline
//           rows={4}
//           fullWidth
//         />
//         <Button type="submit" variant="contained" color="primary">
//           Submit Review
//         </Button>
//       </form>
//     </div>
//   );
// };

// export default ReviewForm;








