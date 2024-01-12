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
  const [userData, setUserData] = useState('');
  console.log(userData, "dataaaaaaaaa");
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
    } catch (error) {
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


  useEffect(() => {
    if (userInfos) {
      // Decode the token and set the user info state
      const decodedInfo = jwtDecode(userInfos.access); // Assuming 'access' contains user details
      setDecodedUserInfo(decodedInfo);
    }
  }, []);
  useEffect(() => {
    if (decodedUserInfo && decodedUserInfo.user_id) {
      fetchUserProfile(); // Fetch user profile data when decodedUserInfo changes
    }
  }, [decodedUserInfo]);

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


  const handleEditClick = () => {
    navigate(`/edit-profile/${userIds}`)
    setShowForm((prevShowForm) => !prevShowForm);
  };
  const handleWallet = () => {
    navigate(`/wallet/${userIds}`)
    setShowForm((prevShowForm) => !prevShowForm);
  };
  const handleAddProfile = () =>{
    navigate('/add-profile')
  }
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
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-center md:justify-between items-center">
        {/* User Information */}
        <div className="w-full md:w-1/3 p-8 text-center">
          <img src={profileImg} alt="Profile Image" className="rounded-full w-40 h-40 mb-4 mx-auto md:mx-0" />
          <h2 className="text-2xl font-semibold">{userData.name}</h2>
          <p className="text-sm text-gray-600">{userData.email}</p>
          <div className="mt-8">
            <button
              className="m-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mr-2"
              onClick={() => {handleUpdateProfileClick()} /* Add edit profile functionality */}
            >
              Edit Profile
            </button>
            {/* Add more buttons */}
            <button
              className=" m-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mr-2"
              onClick={() => { handleResetPasswordClick()} /* Add edit profile functionality */}
            >
              Reset Password
            </button>
            <button
              className="m-1  bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mr-2"
              onClick={() => {handleMyBookingsClick()} /* Add edit profile functionality */}
            >
              My Bookings
            </button>
            <button
              className="m-1  bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mr-2"
              onClick={() => {handleWallet()} /* Add edit profile functionality */}
            >
              My Wallet
            </button>
          </div>
        
        </div>

        {/* User Details */}
        <div className="w-full md:w-2/3 p-8">
          <h2 className="text-2xl font-semibold mb-4">User Information</h2>
          <table className="table-auto mx-auto">
            <tbody>
              {/* User details */}
              <tr>
                <td className="border px-4 py-2">Name</td>
                <td className="border px-4 py-2">{userData.name}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Address</td>
                <td className="border px-4 py-2">{userData.address}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">City</td>
                <td className="border px-4 py-2">{userData.city}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">State</td>
                <td className="border px-4 py-2">{userData.state}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Country</td>
                <td className="border px-4 py-2">{userData.country}</td>
              </tr>
            </tbody>
          </table>
          <div className="mt-8 text-center md:text-left">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mr-2"
              onClick={() => {handleAddProfile()} }
            >
              Add Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};



export default UserProfile;

