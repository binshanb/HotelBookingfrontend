import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import jwtDecode from 'jwt-decode';
import { useSelector } from 'react-redux';
import instance from '../../../utils/Axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  formContainer: {
    padding: theme.spacing(2),
  },
  textField: {
    marginBottom: theme.spacing(3),
  },
  button: {
    marginTop: theme.spacing(2),
  },
}));

const EditProfile = () => {

  const classes = useStyles();
  const navigate = useNavigate();

  const userInfos = useSelector((state) => state.auth.userInfo);
  const [decodedUserInfo, setDecodedUserInfo] = useState({});

  const [formData, setFormData] = useState({
    user: decodedUserInfo.user_id,
    name: '',
    address: '',
    city: '',
    state: '',
    country: '',
  });
const userId = decodedUserInfo.user_id
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async () => {
    try {
     const response = await instance.put(`/api/user/edit-profile/${userId}/`, formData);
     console.log(response,"responseeeeeeeeeeeee");
      
      showToast('Profile details updated', 'success');
      navigate('/user-profile')
    } catch (error) {
      showToast('Error updating user details', 'error');
      console.error('Error updating profile details', error);
    }
  };



  useEffect(() => {
    if (userInfos) {
      // Decode the token and set the user info state
      const decodedInfo = jwtDecode(userInfos.access); // Assuming 'access' contains user details
      setDecodedUserInfo(decodedInfo);
    }},[userInfos]);
useEffect(() => {
  console.log('decodedUserInfo:', decodedUserInfo); 

  if (decodedUserInfo && decodedUserInfo.user_id) {
  const fetchUserProfile = async () => {

    try {
      const response = await instance.get(`/api/user/detail-view/${decodedUserInfo.user_id}/`);
      console.log(response.data,"response");
      if (response.ok) {
         const profileData = response.data[0]; // User profile data from the API

      // Set the retrieved user profile data into the form fields
      setFormData({
        
        user: decodedUserInfo.user_id,
        name: profileData.name || '',
        address: profileData.address || '',
        city: profileData.city || '',
        state: profileData.state || '',
        country: profileData.country || '',
    });
   } else{
    console.error('Failed to fetch user profile details');
   }

  }catch (error) {
      console.error('Error fetching user profile data', error);
      // Handle error scenarios or display an error message to the user
    }
  };

  fetchUserProfile(); // Call the function to fetch user profile data
}
}, [decodedUserInfo, setFormData]);

  const showToast = (message, type = 'error') => {
    toast[type](message, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <div className={classes.root}>
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={8} md={6}>
          <div className={classes.formContainer}>
            <Typography variant="h5" gutterBottom>
              Edit Profile Information
            </Typography>
            <form onSubmit={handleSubmit}>
          
              <TextField
                id="name"
                label="Full Name"
                variant="outlined"
                fullWidth
                value={formData.name}
                onChange={handleChange}
                margin="normal"
                className={classes.textField}
              />
                  <TextField
                id="address"
                label="Address"
                variant="outlined"
                fullWidth
                value={formData.address}
                onChange={handleChange}
                margin="normal"
                className={classes.textField}
              />
                  <TextField
                id="city"
                label="City"
                variant="outlined"
                fullWidth
                value={formData.city}
                onChange={handleChange}
                margin="normal"
                className={classes.textField}
              />
                  <TextField
                id="state"
                label="State"
                variant="outlined"
                fullWidth
                value={formData.state}
                onChange={handleChange}
                margin="normal"
                className={classes.textField}
              />
                  <TextField
                id="country"
                label="Country"
                variant="outlined"
                fullWidth
                value={formData.country}
                onChange={handleChange}
                margin="normal"
                className={classes.textField}
              />
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.button}
              >
                Save Changes
              </Button>
            </form>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default EditProfile;


































// import React, { useState } from 'react';
// import {
//   Button,
//   Grid,
//   TextField,
//   Typography,
//   Paper,
//   Avatar,
// } from '@mui/material';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// import { makeStyles } from '@mui/styles';


// const useStyles = makeStyles((theme) => ({
//   root: {
//     flexGrow: 1,
//     padding: theme.spacing(3),
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   formContainer: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: theme.spacing(2),
//     padding: theme.spacing(3),
//     borderRadius: '8px',
//     boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
//     backgroundColor: '#fff',
//     maxWidth: '400px', // Limiting the width for better readability
//   },
//   avatarContainer: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     marginBottom: theme.spacing(2),
//   },
//   avatar: {
//     backgroundColor: theme.palette.primary.main,
//     width: theme.spacing(10),
//     height: theme.spacing(10),
//   },
//   form: {
//     width: '100%',
//   },
//   textField: {
//     marginBottom: theme.spacing(2),
//   },
//   button: {
//     marginBottom: theme.spacing(2),
//     backgroundColor: theme.palette.primary.main,
//     color: '#fff',
//     '&:hover': {
//       backgroundColor: theme.palette.primary.dark,
//     },
//   },
//   textField: {
//     marginBottom: theme.spacing(2), // Add bottom margin to create space between text fields
//   },
// }));
// const EditProfile = () => {
//   const classes = useStyles();
//   const [formData, setFormData] = useState({
//     first_name: '',
//     address: '',
//     city: '',
//     state: '',
//     country: '',
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.id]: e.target.value,
//     });
//   };

//   const handleSubmit = () => {
//     // Implement submission logic here
//     console.log(formData);
//   };

//   return (
//     <div className={classes.root}>
//       <Grid container spacing={3} justifyContent="center">
//         <Grid item xs={12} md={4}>
//           <Paper className={classes.formContainer}>
//             <div className={classes.avatarContainer}>
//               <Avatar className={classes.avatar}>
//                 <LockOutlinedIcon />
//               </Avatar>
//               <Typography variant="h6">User's Full Name</Typography>
//               <Typography variant="body2" color="textSecondary">
//                 user@email.com
//               </Typography>
              
//             </div>
//             <form className={classes.form}>
//               <TextField
//                 id="first_name"
//                 label="Full Name"
//                 variant="outlined"
//                 fullWidth
//                 value={formData.first_name}
//                 onChange={handleChange}
//                 className={classes.textField}
//               />
//               <TextField
//                 id="address"
//                 label="Address"
//                 variant="outlined"
//                 fullWidth
//                 value={formData.address}
//                 onChange={handleChange}
//                 className={classes.textField}
//               />
//               <TextField
//                 id="city"
//                 label="City"
//                 variant="outlined"
//                 fullWidth
//                 value={formData.city}
//                 onChange={handleChange}
//                 className={classes.textField}
//               />
//               <TextField
//                 id="state"
//                 label="State"
//                 variant="outlined"
//                 fullWidth
//                 value={formData.state}
//                 onChange={handleChange}
//                 className={classes.textField}
//               />
//               <TextField
//                 id="country"
//                 label="Country"
//                 variant="outlined"
//                 fullWidth
//                 value={formData.country}
//                 onChange={handleChange}
//                 className={classes.textField}
//               />
//               <Button
//                 variant="contained"
//                 color="primary"
//                 className={classes.button}
//                 onClick={handleSubmit}
//               >
//                 Save Changes
//               </Button>
//             </form>
//           </Paper>
//         </Grid>
//       </Grid>
//     </div>
//   );
// };

// export default EditProfile;

