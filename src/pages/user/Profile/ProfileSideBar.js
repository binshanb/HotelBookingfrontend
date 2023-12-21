// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import jwtDecode from 'jwt-decode';
// import { Box, List, ListItem, Typography, Divider } from '@mui/material';
// import { useSelector } from 'react-redux';

// const ProfileSideBar = () => {
//   const { userInfo } = useSelector((state) => state.auth.userInfo);
//   const [decodedUserInfo, setDecodedUserInfo] = useState({});
//   const user = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

//   useEffect(() => {
//     if (user) {
//       const decodedInfo = jwtDecode(user.access);
//       setDecodedUserInfo(decodedInfo);
//     }
//   }, []);

//   return (
//     <div>
//     <Box display="flex" mt={50} width="250px" height="100vh" bgcolor="gray-200" padding="4">
//       <List>
//         <ListItem component={Link} to="/user-profile">
//           <Typography variant="h6" fontWeight="bold">
//             My Profile
//           </Typography>
//         </ListItem>
//         <Divider />
//         <ListItem component={Link} to="/edit-profile">
//           <Typography variant="h6" fontWeight="bold">
//             Edit Profile
//           </Typography>
//         </ListItem>
//         <Divider />
//         <ListItem component={Link} to={`/my-bookings/${decodedUserInfo.id}`}>
//           <Typography variant="h6" fontWeight="bold">
//             My Bookings
//           </Typography>
//         </ListItem>
//         <Divider />
//         <ListItem component={Link} to="/reset-password">
//           <Typography variant="h6" fontWeight="bold">
//             Reset Password
//           </Typography>
//         </ListItem>
//         <Divider />
//       </List>
//     </Box>
//     </div>
//   );
// };

// export default ProfileSideBar;


