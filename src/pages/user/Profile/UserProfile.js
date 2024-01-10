import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import instance from '../../../utils/Axios';
import { useParams } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import profileImg from '../../../assets/profile-img.jpg';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';


import {
  Avatar
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  leftContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  card: {
    minWidth: 275,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(3),
  },
  avatar: {
    width: theme.spacing(6),
    height: theme.spacing(6),
    marginBottom: theme.spacing(2),
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  button: {
    margin: theme.spacing(1),
  },
  formContainer: {
    padding: theme.spacing(2),
  },
}));

function UserProfile() {
  const classes = useStyles();
  const { user_id } = useParams();
  const [profileImage, setProfileImage] = useState('');
  const userInfos = useSelector((state) => state.auth.userInfo);
  const [decodedUserInfo, setDecodedUserInfo] = useState({});
  // const token = useSelector((state) => state.auth.access);
  // const uid = useSelector((state) => state.auth.uidb64);
  const navigate = useNavigate();
 
  const [showForm, setShowForm] = useState(false);
  const [userData , setUserData] = useState('');
  console.log(userData,"dataaaaaaaaa");
//   const [formData, setFormData] = useState({
//     user:decodedUserInfo.user_id,
//     name: '',
//     address: '',
//     city: '',
//     state: '',
//     country: '',
//   });
// console.log(formData,"formdataaaaa");


const handleSubmit = async () => {
  try {
    navigate('/add-profile');
  }catch (error) {
    showToast('Error adding user details', 'error');
    console.error('Error adding profile details', error);
  }
};
  // useEffect(() => {
  //   console.log('decodedUserInfo:', decodedUserInfo); // Log decodedUserInfo
  //   if (decodedUserInfo && decodedUserInfo.user_id) {
  //     setFormData((prevFormData) => ({
  //       ...prevFormData,
  //       user: decodedUserInfo.user_id,
  //     }));
  //   }
  // }, [decodedUserInfo]);


// useEffect(() => {
//     if (userInfos) {
//       // Decode the token and set the user info state
//       const decodedInfo = jwtDecode(userInfos.access); // Assuming 'access' contains user details
//       setDecodedUserInfo(decodedInfo);
//     }},[]);
// useEffect(() => {
//     if (decodedUserInfo && decodedUserInfo.user_id) {
//         fetchUserProfile(); // Fetch user profile data when decodedUserInfo changes
//       }
//     }, [decodedUserInfo]);

const userIds = decodedUserInfo.user_id;


const fetchUserProfile = async () => {
  try {
    const response = await instance.get(`/api/user/detail-view/${userIds}/`);
    setUserData(response.data[0]); // Set user profile data to state
  } catch (error) {
    console.error("Error fetching user profile data", error);
    // Handle error scenarios or display an error message to the user
  }
};
useEffect(()=>{
  fetchUserProfile()
},[])

const handleUpdateProfileClick = () => {
  navigate(`/edit-profile/${userIds}`); // Navigate to My Bookings page with the userId
};
const handleMyBookingsClick = () => {
  navigate(`/my-bookings/${userIds}/`); // Navigate to My Bookings page with the userId
};
const handleResetPasswordClick = () => {

  if (userIds) {
    navigate('/reset-password/');
  } else {
    // Handle scenario where uidb64 and token are missing or invalid
    console.error('Invalid uidb64 or token');
    // You might want to display an error message to the user or perform some other action here
  }
};

const {name} = userData
  const  handleEditClick = () => {
    navigate (`/edit-profile/${userIds}`)
    setShowForm((prevShowForm) => !prevShowForm);
  }; 
  const  handleWallet = () => {
    navigate (`/wallet/${userIds}`)
    setShowForm((prevShowForm) => !prevShowForm);
  }; 

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
    <Grid container spacing={3}>
      <Grid item xs={12} sm={4} className={classes.leftContainer}>
        <Card className={classes.card}>
          <div className={classes.avatar}>
            {/* Placeholder for image */}
            <Avatar alt="Profile Image" src={profileImage || profileImg} className={classes.avatarImage} />
          </div>
          <Typography variant="h5" gutterBottom>
            User:{decodedUserInfo.first_name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Email:{decodedUserInfo.email}
          </Typography>
          <div>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={handleEditClick}
            >
              Edit Profile
            </Button>
         
            {/* Additional buttons */}
          </div>
          <div>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={handleMyBookingsClick}
            >
              My Bookings
            </Button>
         
            {/* Additional buttons */}
          </div>
          <div>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={handleResetPasswordClick}
            >
              ResetPassword
            </Button>
         
            {/* Additional buttons */}
          </div>
          <div>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={handleWallet}
            >
              My Wallet
            </Button>
         
            {/* Additional buttons */}
          </div>
        </Card>
      </Grid>
      <Grid item xs={12} sm={8}>
        <div className={classes.formContainer}>
          <form className={classes.root}>
            <Typography variant="h5" gutterBottom>
              User Information
            </Typography>
            <br/><br/>
            <TableContainer component={Paper} className={classes.tableContainer}>
            <Table>
  <TableHead>
    {/* Table headers */}
    <TableRow>
      <TableCell>Field</TableCell>
      <TableCell>Details</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {userData ? (
      <>
        <TableRow key="name">
          <TableCell component="th" scope="row">Name</TableCell>
          <TableCell>{userData.name || ''}</TableCell>
        </TableRow>
        <TableRow key="address">
          <TableCell component="th" scope="row">Address</TableCell>
          <TableCell>{userData.address || ''}</TableCell>
        </TableRow>
        <TableRow key="city">
          <TableCell component="th" scope="row">City</TableCell>
          <TableCell>{userData.city || ''}</TableCell>
        </TableRow>
        <TableRow key="state">
          <TableCell component="th" scope="row">State</TableCell>
          <TableCell>{userData.state || ''}</TableCell>
        </TableRow>
        <TableRow key="country">
          <TableCell component="th" scope="row">Country</TableCell>
          <TableCell>{userData.country || ''}</TableCell>
        </TableRow>

      </>
    ) : (
      <TableRow>
        <TableCell colSpan={2}>No user data available</TableCell>
      </TableRow>
    )}
  </TableBody>
</Table>



    </TableContainer>
        
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={handleSubmit}
            >
              Add Profile
            </Button>
          </form>
        </div>
      </Grid>
    </Grid>
  </div>
);
};

export default UserProfile;

