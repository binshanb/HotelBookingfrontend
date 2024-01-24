// ReviewForm.js
import React, { useState,useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import instance from '../../../utils/Axios';
import { makeStyles } from '@material-ui/core/styles';
import {
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Typography,
    Grid
} from '@material-ui/core';

import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector,useDispatch } from 'react-redux';

const useStyles = makeStyles((theme) => ({
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing(2),
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: theme.spacing(1),
        boxShadow: `0 4px 8px ${theme.palette.primary.light}`,
        backgroundColor: theme.palette.background.paper,
        '& > *': {
            margin: theme.spacing(1),
            width: '100%',
            maxWidth: '400px',
        },
    },
    button: {
        width: '50%',
        alignSelf: 'center',
    },
}));



const ReviewForm = () => {

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(-1);
  const labels = {
   
    1: 'Bad',

    2: 'Okay',
 
    3: 'Good',
  
    4: 'Great',
   
    5: 'Outstanding',
  };
    const classes = useStyles();
    // const dispatch = useDispatch();
    const [roomIds, setRoomId] = useState('');
    const [userIds, setUserId] = useState('');
   
    const [comment, setComment] = useState('');

    const rooms = useSelector((state) => state.room.roomInfo);

    const userInfos = useSelector((state) => state.auth.userInfo);
    const [decodedUserInfo, setDecodedUserInfo] = useState({});


    const roomId = rooms.id
    const userId =  decodedUserInfo.user_id

    useEffect(() => {
        if (userInfos) {
          // Decode the token and set the user info state
          const decodedInfo = jwtDecode(userInfos.access); // Assuming 'access' contains user details
          setDecodedUserInfo(decodedInfo);
        }},[userInfos]);
  
        const handleAddReview = async () => {
          try {
        
    
              const requestData = {
                  room:roomId,
                  user:userId,
                  rating: rating,
                  comment: comment
              };
      
              console.log('Request data:', requestData);
      
              const response = await instance.post(`/api/booking/add-review/${roomId}/${userId}/`, requestData);
              console.log('Response data:', response.data); // Log the response
              toast.success('Review added successfully!');
              setRating('0');
              setComment('');
           
          } catch (error) {
              console.error('Error adding review:', error);
              toast.error('Failed to add review.');
          }
      };

    return (
<div className="container mx-auto p-4">
  <div className="grid grid-cols-1 justify-center">
    <div className="col-span-12 sm:col-span-6">
      <form className="bg-white p-8 shadow-md rounded-md">
        <h6 className="mb-4 text-2xl">Add Review</h6>
        <div className="mb-4">
          <div className="flex items-center">
            <Rating
              name="hover-feedback"
              value={rating}
              precision={0.5}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
              onChangeActive={(event, newHover) => {
                setHover(newHover);
              }}
              emptyIcon={<StarIcon className="opacity-55" fontSize="inherit" />}
            />
            {rating !== null && (
              <span className="ml-2">{labels[hover !== -1 ? hover : rating]}</span>
            )}
          </div>
        </div>
        <textarea
          placeholder="Comment"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded-md"
        />
        <button
          className="bg-blue-700 text-white w-1/4 py-2 rounded-full transition-transform hover:scale-105"
          onClick={handleAddReview}
        >
          Add Review
        </button>
      </form>
    </div>
  </div>
</div>
    )
            }
export default ReviewForm;












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








