import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
// import EditIcon from '@material-ui/icons/Edit';

import { useNavigate } from 'react-router-dom';
import AddProfile from './AddProfile';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import instance from '../../../utils/Axios';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#fcdad1',
  },
  card: {
    maxWidth: 345,
  },
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    margin: '0 auto',
  },
  button: {
    margin: theme.spacing(1),
  },
}));




function UserProfile() {
  const { user_id } = useParams();
  const userInfos = useSelector((state) => state.auth.userInfo);
  const [decodedUserInfo, setDecodedUserInfo] = useState({});// Access userId from Redux state
  const token = useSelector((state) => state.auth.access);
  const uid = useSelector((state) => state.auth.uidb64);
  const navigate = useNavigate();
  const classes = useStyles();
  const [showForm, setShowForm] = useState(false);
  const [userData , setUserData] = useState('');
  

useEffect(() => {
    if (userInfos) {
      // Decode the token and set the user info state
      const decodedInfo = jwtDecode(userInfos.access); // Assuming 'access' contains user details
      setDecodedUserInfo(decodedInfo);
    }},[]);

const userIds = decodedUserInfo.user_id;
useEffect(() => {
  console.log('id',userIds)
  const fetchUserData = async () =>{
    try{
      const response = await instance.get(`/api/user/detail-view/${userIds}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data,'data')
      setUserData(response.data)
    }catch (error) {
      console.error("Error fetching user data", error);
    }
  }
  fetchUserData();
}, [userIds, token]);
const handleUpdateProfileClick = () => {
  navigate(`/user/update-profile/${userIds}`); // Navigate to My Bookings page with the userId
};
const handleMyBookingsClick = () => {
  navigate(`/my-bookings/${userIds}/`); // Navigate to My Bookings page with the userId
};
const handleResetPasswordClick = () => {
  // Check if uidb64 and token have valid values
  if (uid && token) {
    navigate(`/reset-password-confirm/${uid}/${token}/`);
  } else {
    // Handle scenario where uidb64 and token are missing or invalid
    console.error('Invalid uidb64 or token');
    // You might want to display an error message to the user or perform some other action here
  }
};

const {first_name} = userData
  const  handleEditClick = () => {
    navigate (`/user/update-profile/${userIds}`)
    setShowForm((prevShowForm) => !prevShowForm);
  }; 
  const  handleWallet = () => {
    navigate (`/wallet/${userIds}`)
    setShowForm((prevShowForm) => !prevShowForm);
  }; 


  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardContent>
          <div className={classes.avatar}>
            <img
              src=""
              alt="Profile"
              className="w-24 h-24 mx-auto rounded-full border-2 border-gold transition-transform hover:scale-125"
            />
          </div>
          <Typography gutterBottom variant="h5" component="h2" align="center">
            {first_name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p" align="center">
            {userData.email}
          </Typography>
          <div className="centered-container">
            {/* Other buttons and icons */}
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              // startIcon={<EditIcon />}
              onClick={handleEditClick}
            >
              Edit Profile
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              // startIcon={<EditIcon />}
              onClick={handleMyBookingsClick}
            >
              My Bookings
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              // startIcon={<EditIcon />}
              onClick={handleResetPasswordClick}
            >
              Reset Password
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              // startIcon={<EditIcon />}
              onClick={handleWallet}
            >
              Wallet
            </Button>
            {/* Other buttons */}
          </div>
        </CardContent>
      </Card>
      <AddProfile />
    </div>
  );
}


export default UserProfile;



































// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Style.css";
// import  instance from "../../../utils/Axios";
// import { toast } from "react-toastify";
// import { Col, Container, Button, Form, Row, FormGroup } from "react-bootstrap";
// import { Avatar, useToast } from "@chakra-ui/react";
// import { SpinnerChakra } from "../../user/loadingState/SpinnerChakra";
// import Cookies from "js-cookie";
// import { baseUrl } from "../../../utils/constants";

// export default function UserProfile() {
//   const navigate = useNavigate();
//   const [userData, setUserData] = useState([]);
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [mobile, setMobile] = useState("");
//   const [isEditable, setIsEditable] = useState(false);
//   const [image, setImage] = useState();
//   const [imageLoading, setImageLoading] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const toasty = useToast();

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     switch (name) {
//       case "name":
//         setName(value);
//         break;
//       case "email":
//         setEmail(value);
//         break;
//       case "mobile":
//         setMobile(value);
//         break;
//       default:
//         break;
//     }
//   };

//   const handleImage = async (pic) => {
//     setImageLoading(true);
//     if (pic === undefined) {
//       toasty({
//         title: "Please Select an Image !",
//         status: "warning",
//         duration: 3000,
//         isClosable: true,
//         position: "bottom",
//       });
//       return;
//     }
//     if (pic.type === "image/jpeg" || pic.type === "image/png") {
//       const userImage = new FormData();
//       userImage.append("file", pic);
//       userImage.append("upload_preset", "chat-app");
//       // userImage.append("cloud_name","istayprocess");
//       // console.log(userImage)
//       fetch("https://api.cloudinary.com/v1_1/istayprocess/image/upload", {
//         method: "POST",
//         body: userImage,
//       })
//         .then((res) => res.json())
//         .then((value) => {
//           setImage(value.url.toString());
//           setImageLoading(false);
//           toast.success("Image uploaded");
//         })
//         .catch((error) => {
//           console.error(error);
//           setImageLoading(false);
//         });
//     } else {
//       toasty({
//         title: "Please Select an Image",
//         status: "warning",
//         duration: 3000,
//         isClosable: true,
//         position: "bottom",
//       });
//       setImageLoading(false);
//       return;
//     }
//   };

//   const handleSave = async () => {
//     setIsEditable(false);
//     const dataToUpdate = {
//       name,
//       email,
//       mobile,
//       image: image,
//     };
//     const response = await instance.put("api/users/user-profile/", dataToUpdate, {
//       params: { userId: userData[0]?._id },
//     });
//     if (response.data.updated) {
//       setName(response.data.name);
//       setEmail(response.data.email);
//       setMobile(response.data.mobile);
//       setImage(response.data.image);
//       toast.success(`${name} Profile Updated`);
//     }
//   };

//   useEffect(() => {
//     const userInfo = JSON.parse(localStorage.getItem("userInfo"));
//     if (userInfo) {
//       const fetchUserDetails = async () => {
//         try {
//           setIsLoading(true)
//           const response = await instance.get(`${baseUrl}api/users/user-profile/`, {
//             params: { userId: userInfo?.id },
//           });
//           if (response.data.userData) {
//             setUserData(response?.data?.userData);


//             setEmail(userData[0]?.email);
//             setMobile(userData[0]?.mobile);
//             setIsLoading(false)
//           }
//         } catch (error) {
//           if (
//             error.response &&
//             error.response.data &&
//             error.response.data.message
//           ) {
//             toast.error(error.response.data.message);
//             if (error.response.data.redirect) {
//               setTimeout(() => {
//                 navigate(`${error.response.data.redirect}`);
//               }, 1000);
//             }
//           } else {
//             toast.error("Please Login");
//             setTimeout(() => {
//               navigate("/login");
//             }, 3000);
//           }
//         }
//       };
//       fetchUserDetails();
//     } else {
//       navigate("/login");
//     }
//   }, [mobile]);
//   return isLoading ? (
//     <SpinnerChakra />
//   ) : (
//     <div>
//       <div style={{ height: "100vh", display: "flex", alignItems: "start" }}>
//         <Container fluid className="m-5">
//           <Row>
//             <Col sm={12} className="content">
//               <div>
//                 <h3 className="head text-white">
//                   My Profile
//                   <span style={{ marginLeft: "20px", alignItems: "center" }}>
//                     <Avatar src={userData[0]?.pic} alt="User Avatar" />
//                   </span>
//                 </h3>

//                 <div className="formDiv">
//                   {userData ? (
//                     <Form>
//                       <Form.Group className="mb-3" controlId="formBasicName">
//                         <Form.Label className="fields text-white">
//                           Name
//                         </Form.Label>
//                         <Form.Control
//                           type="text"
//                           readOnly={!isEditable}
//                           name="name"
//                           value={name}
//                           onChange={handleInputChange}
//                         />
//                       </Form.Group>
//                       <Form.Group className="mb-3" controlId="formBasicEmail">
//                         <Form.Label className="fields text-white">
//                           Email
//                         </Form.Label>
//                         <Form.Control
//                           type="email"
//                           name="email"
//                           readOnly
//                           value={email}
//                           onChange={handleInputChange}
//                         />
//                       </Form.Group>

//                       <Form.Group
//                         className="mb-3"
//                         controlId="formBasicExperience"
//                       >
//                         <Form.Label className="fields text-white">
//                           Mobile Number
//                         </Form.Label>
//                         <Form.Control
//                           type="number"
//                           readOnly={!isEditable}
//                           name="mobile"
//                           value={mobile}
//                           onChange={handleInputChange}
//                         />
//                       </Form.Group>

//                     {isEditable ? (
//                           <Form.Group
//                           className="mb-3"
//                           controlId="formBasicExperience"
//                         >
//                           <Form.Label className="fields text-white">
//                             User Profile Picture
//                           </Form.Label>
//                           <input
//                             type="file"
//                             readOnly={!isEditable}
//                             accept="image/*"
//                             // value={mobile}
//                             onChange={(e) => handleImage(e.target.files[0])}
//                           />
//                         </Form.Group>
//                     ):(
//                       ""
//                     )}

//                       {isEditable ? (
//                         <>
//                           <Button
//                             className="m-2"
//                             variant="primary"
//                             onClick={handleSave}
//                             // isLoading={true}
//                           >
//                             Save
//                           </Button>
//                           <Button
//                             variant="secondary"
//                             onClick={() => setIsEditable(false)}
//                           >
//                             Cancel
//                           </Button>
//                         </>
//                       ) : (
//                         <Button
//                           className="text-white"
//                           variant="info"
//                           onClick={() => setIsEditable(true)}
//                         >
//                           Edit
//                         </Button>
//                       )}

//                       {/* <Button variant="primary" onClick={handleSave}>
//                 Save
//               </Button> */}
//                     </Form>
//                   ) : (
//                     // If userData is not available, show loading or default content
//                     <p>Loading user data...</p> // You can replace this with any loading content
//                   )}
//                 </div>
//               </div>
//             </Col>
//           </Row>
//         </Container>
//         <Container
//           fluid
//           className="m-5"
//           style={{ borderRadius: "20px", border: "1px solid silver" }}
//         >
//           <Row
//             style={{
//               backgroundColor: "#0f172a",
//               height: "auto",
//               width: "auto",
//               borderRadius: "20px",
//             }}
//           >
//             <Col sm={12} className="content">
//               <div className="wallet-container">
//                 <h1 className="head text-center text-white p-3">
//                   My Wallet Balance
//                 </h1>
//                 <div className="wallet-balance">
//                   <h1 className="balance-amount p-1 text-white text-center">
//                     {/* Use text-center className */}
//                     {userData[0]?.wallet?.balance || 0}
//                   </h1>
//                 </div>
//               </div>
//             </Col>
//           </Row>
//         </Container>
//       </div>
//     </div>
//   );
// }



































// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { Box, Button, Input, Image, Heading, Divider } from '@chakra-ui/react';
// import { baseUrl } from '../../../utils/constants';
// import instance from '../../../utils/Axios';
// import ProfileSideBar from '../../user/Profile/ProfileSideBar'

// function UserProfile() {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [phone_number, setPhoneNumber] = useState('');
//   const [address, setAddress] = useState('');
//   const [image, setImage] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     instance.get(`${baseUrl}/api/user/user-profile`)
//       .then((response) => {
//         const userData = response.data;
//         setName(userData.name);
//         setEmail(userData.email);
//         setPhoneNumber(userData.phone_number);
//         setAddress(userData.address);
//       })
//       .catch((error) => {
//         console.error('Error fetching user profile:', error);
//       });
//   }, []);

//   const handleUpdateProfile = () => {
//     const formData = new FormData();
//     formData.append('name', name);
//     formData.append('email', email);
//     formData.append('phone_number', phone_number);
//     formData.append('image', image);
//     formData.append('address', address);

//     instance.put(`${baseUrl}/api/user/user-profile/`, formData)
//       .then((response) => {
//         console.log('User profile updated:', response.data);
//         navigate('/user-profile');
//       })
//       .catch((error) => {
//         if (error.response && error.response.status === 401) {
//           navigate('/login');
//         } else {
//           console.error('Error updating user profile:', error);
//         }
//       });
//   };

//   const handleAddProfile = () => {
//     // Similar to your existing handleAddProfile logic
//     // ...
//   };

//   return (
//     <>
//     <ProfileSideBar/>
//     <Box p="20" bg="gray.100" minH="100vh" textAlign="center">
//       <Heading as="h1" fontSize="4xl" fontWeight="bold">
//         User Profile
//       </Heading>
     
//       <Divider w="16" h="1" bg="blue.500" mx="auto" mt="2" />
//       {image && <Image src={image} alt="Profile" w="40" h="40" mx="auto" rounded="full" />}
//       <Input type="file" onChange={(e) => setImage(e.target.files[0])} mt="4" p="2" border="1px" borderColor="gray.300" rounded="md" />
//       <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" mt="4" p="2" border="1px" borderColor="gray.900" rounded="md" />
//       <Input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" mt="4" p="2" border="1px" borderColor="gray.900" rounded="md" />
//       <Input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" mt="4" p="2" border="1px" borderColor="gray.900" rounded="md" />

//       <Button onClick={handleUpdateProfile} mt="4" bg="blue.500" color="white" px="4" py="2" rounded="md" _hover={{ bg: 'blue.600' }}>
//         Edit Profile
//       </Button>
//       <br />
//       <Button onClick={handleAddProfile} mt="4" bg="green.500" color="white" px="4" py="2" rounded="md" _hover={{ bg: 'green.600' }}>
//         Add Profile
//       </Button>
//     </Box>
//     </>
//   );
// }

// export default UserProfile;























// import React, { useEffect, useState } from "react";
// import style from "./Profile.module.css";
// import { useDispatch, useSelector } from "react-redux";
// import userImg from "./profile-img.jpg";
// import ProfileView from "../../../components/ProfileView/ProfileView";
// import EditProfile from "../../../components/EditProfile/EditProfile";
// import ChangePassword from "../../../components/ChangePassword/ChangePassword";
// import { useMediaQuery } from "@mui/material";
// import Navbar from "../../../components/Navbar/Navbar";

// export default function Profile() {
//   const {dispatch} = useDispatch();
//   const { mode } = useSelector((state) => state.mode);
//   const [profile, viewProfile] = useState(true);
//   const [editProfile, viewEditProfile] = useState(false);
//   const [changePassword, viewChangePassword] = useState(false);
//   const isMobile = useMediaQuery("(max-width: 450px)");
//   const isXtraSmall = useMediaQuery("(max-width: 300px)");
//   const IsMedium = useMediaQuery("(max-width:1000px)");

//   const { loggedinUser } = useSelector((state) => state.getLoggedInUser);
//   const { user } = loggedinUser;
//   const IsLargee = useMediaQuery("(max-width:1400px)");
//   const IsMediumm = useMediaQuery("(max-width:1000px)");
//   const IsSmalll = useMediaQuery("(max-width:768px)");
//   const IsMobilee = useMediaQuery("(max-width:450px)");

//   return (
//     <>
//       <div>
//         <Navbar />
//       </div>
//       <div className="d-flex">
//         <div className="container-fluid mt-5" style={{ marginTop: "50px" }}>
//           <div
//             className={`rounded ${mode === "dark" ? "bg-dark" :style.bg}`}
//           ></div>
//           <div className="row">
//             <div
//               className="col-md-12 p-3 d-flex "
//               // style={{ marginLeft: "10px" }}
//             >
//               <h1 className={`fs-1 fw-bold ${style.heading} mx-auto `}>
//                 User Profile
//               </h1>
//             </div>

//             <div className="col-md-4 col-sm-12">
//               <div
//                 className={`${
//                   mode === "light" ? "bg-white" : "bg-dark"
//                 } d-flex flex-column align-items-center text-center w-75 mx-auto mt-3 pb-5 rounded-3`}
//               >
//                 <img
//                   style={{ width: "35%" }}
//                   className="mt-5 rounded-circle"
//                   src={user && user.photo ? user.photo : userImg}
//                   alt=""
//                 />
//                 <h2
//                   className={`fw-semibold my-2 text-${
//                     mode === "light" ? "dark" : "light"
//                   }`}
//                 >
//                   {user && user.first_name ? `${user.first_name} ${user.last_name}` : "User Name Not Available"}
//                 </h2>
//                 <span
//                   className={`text-${
//                     mode === "light" ? "black-50" : "white-50"
//                   }`}
//                 >
//                   {user && user.account_type ? user.account_type : "Account Type Not Available"}
//                 </span>
//               </div>
//             </div>

//             <div className="col-md-8 mb-5">
//               <div
//                 className={`pt-2 mt-3 ${
//                   mode === "light" ? "bg-white" : "bg-dark"
//                 } rounded-3 me-2`}
//               >
//                 <div className="row text-center m-1 mt-4">
//                   <div className="col-md-3 col-lg-3 col-4">
//                     <p
//                       className={`${style.portion} ${
//                         isXtraSmall ? "fw-bold small" : "fs-5"
//                       }`}
//                       // style={isXtraSmall && { fontSize: "14px" }}
//                       onClick={() => {
//                         viewProfile(true);
//                         viewEditProfile(false);
//                         viewChangePassword(false);
//                       }}
//                     >
//                       Overview {isMobile && "Profile"}
//                     </p>
//                     {profile && (
//                       <hr className={`${style.hr} mt-2 mb-0 text-primary`} />
//                     )}
//                   </div>
//                   <div className="col-md-4 col-lg-3 col-4">
//                     <p
//                       className={`${style.portion} ${
//                         isXtraSmall ? "fw-bold small" : "fs-5"
//                       } `}
//                       // style={isXtraSmall && { fontSize: "14px" }}
//                       onClick={() => {
//                         viewProfile(false);
//                         viewEditProfile(true);
//                         viewChangePassword(false);
//                       }}
//                     >
//                       Edit Profile
//                     </p>
//                     {editProfile && (
//                       <hr className={`${style.hr} mt-2 mb-0 text-primary`} />
//                     )}
//                   </div>
//                   <div className="col-md-5 col-lg-3 col-4">
//                     <p
//                       className={`${style.portion} ${
//                         isXtraSmall ? "fw-bold small" : "fs-5"
//                       }`}
//                       // style={isXtraSmall && { fontSize: "14px" }}
//                       onClick={() => {
//                         viewProfile(false);
//                         viewEditProfile(false);
//                         viewChangePassword(true);
//                       }}
//                     >
//                       Change Password
//                     </p>
//                     {changePassword && (
//                       <hr className={`${style.hr} mt-2 mb-0 text-primary`} />
//                     )}
//                   </div>

//                   <div className="col-md-12">
//                     <hr className="mt-0" />
//                   </div>
//                 </div>
//                 {profile ? (
//                   <ProfileView profile={loggedinUser} />
//                 ) : editProfile ? (
//                   <EditProfile profile={loggedinUser} />
//                 ) : changePassword ? (
//                   <ChangePassword profile={loggedinUser} />
//                 ) : null}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
































































































































// import {
//   MDBCol,
//   MDBContainer,
//   MDBRow,
//   MDBCard,
//   MDBCardText,
//   MDBCardBody,
//   MDBCardImage,
//   MDBBtn,
//   MDBBreadcrumb,
//   MDBBreadcrumbItem,
//   MDBProgress,
//   MDBProgressBar,
//   MDBIcon,
//   MDBListGroup,
//   MDBListGroupItem,
// } from "mdb-react-ui-kit";

// import axios from "axios";
// import react,{useState,useEffect} from 'react';
// import {BiSolidEdit} from 'react-icons/bi';


// function UserProfile() {

//   const [userProfile, setUserProfile] = useState({});
//   const [image, setImage] = useState(null);
//   const [address, setAddress] = useState('');
  
//       useEffect(() => {
//           axios.get('/api/user-profile/')
//               .then((response) => {
//                   setUserProfile(response.data);
//               })
//               .catch((error) => {
//                   console.error('Error fetching user profile:', error);
//               });
//       }, []);
  
//       const handleUpdateProfile = () => {
//           const formData = new FormData();
//           formData.append('image', image);
//           formData.append('address', address);
  
//           axios.put('/api/user-profile/', formData)
//               .then((response) => {
//                   console.log('User profile updated:', response.data);
//               })
//               .catch((error) => {
//                   console.error('Error updating user profile:', error);
//               });
//       };
//   return (
//     <>
//     <section className="bg-gray-200">
//       <MDBContainer className="py-5">
//         <MDBRow>
//           <MDBCol>
//             <MDBBreadcrumb className="bg-light rounded-3 p-3 mb-4 w-100">
//               <MDBBreadcrumbItem>
//                 <a href="/">Home</a>
//               </MDBBreadcrumbItem>
//               <MDBBreadcrumbItem>
//                 <a href="/userprofile">User Profile</a>
//               </MDBBreadcrumbItem>
//             <MDBBreadcrumbItem className="ms-auto" >
//                 <BiSolidEdit />
//               </MDBBreadcrumbItem>
//             </MDBBreadcrumb>
//           </MDBCol>
//         </MDBRow>

//         <MDBRow>
//           <MDBCol lg="4">
//             <MDBCard className="mb-4">
//               <MDBCardBody className="text-center">
//                 <MDBCardImage
//                   src={userProfile.image}
//                   alt="avatar"
//                   className="rounded-circle"
//                   style={{ width: "150px" }}
//                   fluid
//                 />
//                  <p className="text-muted mb-1">Full Stack Developer</p>
//                <p className="text-muted mb-4">Bay Area, San Francisco, CA</p>
//                <MDBCard className="mb-4 mb-lg-0">
//               <MDBCardBody className="p-0">
//               <div className="d-flex justify-content-center mb-2">
//                  <MDBBtn>Save</MDBBtn>
//                    <MDBBtn outline className="ms-1">
//                    Edit
//                    </MDBBtn>
//                 </div>
//               </MDBCardBody>
//             </MDBCard>

      
            
//            </MDBCol>
//         </MDBRow>
//     </MDBContainer>
 
          
//               <input
//               type="file"
//               onChange={(e) => setImage(e.target.files[0])}
//               className="mt-4 p-2 border border-gray-300 rounded"
//           />
//           <input
//               type="text"
//               value={address}
//               onChange={(e) => setAddress(e.target.value)}
//               placeholder="Address"
//               className="mt-4 p-2 border border-gray-300 rounded w-full"
//           />
//           <button
//               onClick={handleUpdateProfile}
//               className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//           >
//               Update Profile
//           </button>
          
//           </section>
//     </>
//   )
//  };

//  export default UserProfile;