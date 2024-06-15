import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import img from '../../assets/booking1-logo.png';
import instance from '../../utils/Axios';
import jwtDecode from 'jwt-decode';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { selectUserInfo, logout } from "../../redux/slices/userslices/authSlice";

function Navbar() {
  const userInfo = useSelector(selectUserInfo);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.userInfo);
  const [decodedUserInfo, setDecodedUserInfo] = useState({});
  const admin = useSelector((state) => state.adminAuth.adminInfo);
  const [decodedAdminInfo, setDecodedAdminInfo] = useState({});

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentActive, setCurrentActive] = useState(null);

  useEffect(() => {
    if (user) {
      const decodedInfo = jwtDecode(user.access);
      setDecodedUserInfo(decodedInfo);
    }
  }, [user]);

  useEffect(() => {
    if (admin) {
      const decodedInfoAdmin = jwtDecode(admin.access);
      setDecodedAdminInfo(decodedInfoAdmin);
    }
  }, [admin]);

  const handleMobileMenuClick = () => {
    setMobileMenuOpen((prevState) => !prevState);
  };

  const handleClick = (index) => {
    setCurrentActive(index);
  };

  const handleNavigation = (path) => {
    setMobileMenuOpen(false);
    setCurrentActive(null);
    navigate(path);
  };

  const handleInboxClick = async () => {
    try {
      const response = await instance.post('/api/chat/chat-rooms/', {
        'user_id': decodedUserInfo.user_id,
        'provider_id': decodedAdminInfo.user_id,
        'first_name': decodedUserInfo.first_name
      });
      console.log('Inbox view response:', response.data);
    } catch (error) {
      console.error('Error calling inbox view:', error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Successfully logged out!');
  };

  const navLinks = [
    { id: 1, text: 'Home', path: '/' },
    { id: 2, text: 'Rooms', path: '/categorylist' },
    { id: 3, text: 'Services', path: '/services' },
    { id: 4, text: 'Inbox', path: '/provider-chatrooms' },
    { id: 5, text: 'About', path: '/about' },
    { id: 6, text: 'Contact', path: '/contact' },
  ];

  const menuItems = navLinks.map((link) => (
    <ListItem
      key={link.id}
      button
      component={Link}
      to={link.path}
      selected={link.id === currentActive}
      onClick={() => {
        handleClick(link.id);
        if (window.innerWidth <= 769) {
          handleMobileMenuClick();
        }
        if (link.id === 4) {
          handleInboxClick();
        }
      }}
    >
      <ListItemText primary={link.text} />
    </ListItem>
  ));

  useEffect(() => {
    setMobileMenuOpen(false);
    setCurrentActive(null);
  }, [location.pathname]);

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: '#fff', color: '#333', height: '65px' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 400, fontSize: '1.5rem' }}>
            <Link to="/">
              <img src={img} alt="Logo" className="w-12" />
            </Link>
          </Typography>
          <IconButton
            id="mobile"
            onClick={handleMobileMenuClick}
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ display: { sm: 'block', md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Drawer anchor="right" open={mobileMenuOpen} onClose={handleMobileMenuClick}>
            <List>
              {menuItems}
              {userInfo ? (
                <ListItem button component={Link} to='/user-profile' onClick={handleLogout}>
                  <ListItemText primary="Logout" />
                  <LogoutIcon />
                </ListItem>
              ) : (
                <ListItem button component={Link} to='/login'>
                  <ListItemText primary="Login" />
                  <LoginIcon />
                </ListItem>
              )}
            </List>
          </Drawer>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} />
          <List
            component="nav"
            aria-labelledby="main navigation"
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
            }}
          >
            {menuItems}
            {userInfo ? (
              <ListItem button component={Link} to='/user-profile' onClick={handleLogout}>
                <ListItemText primary="Logout" />
                <LogoutIcon />
              </ListItem>
            ) : (
              <ListItem button component={Link} to='/login'>
                <ListItemText primary="Login" />
                <LoginIcon />
              </ListItem>
            )}
          </List>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default Navbar;












// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, Typography, Button } from '@mui/material';
// import MenuIcon from '@mui/icons-material/Menu';
// import PersonIcon from '@mui/icons-material/Person';
// import LogoutIcon from '@mui/icons-material/Logout';
// import LoginIcon from '@mui/icons-material/Login';
// import img from '../../assets/booking1-logo.png';
// import instance from '../../utils/Axios';
// import jwtDecode from 'jwt-decode';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// import { selectUserInfo, logout } from "../../redux/slices/userslices/authSlice"

// import { useLocation } from 'react-router-dom';

// import { useNavigate } from 'react-router-dom';

// function Navbar() {
//   const userInfo = useSelector(selectUserInfo);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const user = useSelector((state) => state.auth.userInfo);
//   const [decodedUserInfo, setDecodedUserInfo] = useState({})
//   console.log(decodedUserInfo, "username");
//   const userId = decodedUserInfo.user_id;
//   const admin = useSelector((state) => state.adminAuth.adminInfo);
//   const [decodedAdminInfo, setDecodedAdminInfo] = useState({})
//   const providerId = decodedAdminInfo.user_id;

//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [currentActive, setCurrentActive] = useState(null);

//   useEffect(() => {
//     if (user) {
//       // Decode the token and set the user info state
//       const decodedInfo = jwtDecode(user.access); // Assuming 'access' contains user details
//       setDecodedUserInfo(decodedInfo);
//     }
//   }, [user]);


//   useEffect(() => {
//     if (admin) {
//       // Decode the token and set the user info state
//       const decodedInfoAdmin = jwtDecode(admin.access); // Assuming 'access' contains user details
//       setDecodedAdminInfo(decodedInfoAdmin);
//     }
//   }, [admin]);

//   const handleMobileMenuClick = () => {
//     setMobileMenuOpen((prevState) => !prevState);
//   };

//   const handleClick = (index) => {
//     setCurrentActive(index);
//   };

//   const handleNavigation = (path) => {
//     setMobileMenuOpen(false); // Close the mobile menu on navigation
//     setCurrentActive(null); // Reset the active link
//     navigate(path);
//   };

//   const handleInboxClick = async () => {
//     try {

//       const response = await instance.post('/api/chat/chat-rooms/',
//         { 'user_id': userId, 'provider_id': providerId, 'first_name': decodedUserInfo.first_name }); // Replace '/api/inbox' with your actual endpoint

//       console.log('Inbox view response:', response.data);

//     } catch (error) {
//       console.error('Error calling inbox view:', error);

//     }
//   };

//   const handleLogout = () => {
//     dispatch(logout());
//     toast.success('Successfully logged out!');
//   };

//   const navLinks = [
//     { id: 1, text: 'Home', path: '/' },
//     { id: 2, text: 'Rooms', path: '/categorylist' },
//     { id: 3, text: 'Services', path: '/services' },
//     { id: 4, text: 'Inbox', path: '/provider-chatrooms' },
//     { id: 5, text: 'About', path: '/about' },
//     { id: 6, text: 'Contact', path: '/contact' },
//   ];

//   const menuItems = navLinks.map((link) => (
//     <ListItem
//       key={link.id}
//       button
//       component={Link}
//       to={link.path}
//       selected={link.id === currentActive}
//       onClick={() => {
//         handleClick(link.id);
//         if (window.innerWidth <= 769) {
//           handleMobileMenuClick();
//         }
//         if (link.id === 4) {
//           handleInboxClick();
//         }

//       }}
//     >
//       <ListItemText primary={link.text} />
//     </ListItem>
//   ));

//   useEffect(() => {
//     setMobileMenuOpen(false);
//     setCurrentActive(null);
//   }, [location.pathname]);

//   return (
//     <>
//       <AppBar position="fixed" sx={{ backgroundColor: '#fff', color: '#333', height: '65px' }}>
//         <Toolbar>
//           <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 400, fontSize: '1.5rem' }}>
//             <Link to="/">
//               <img src={img} alt="Logo" className="w-12" />
//             </Link>
//           </Typography>
//           <IconButton
//             id="mobile"
//             onClick={handleMobileMenuClick}
//             edge="start"
//             color="inherit"
//             aria-label="menu"
//             sx={{ display: { sm: 'block', md: 'none' } }}
//           >
//             <MenuIcon />
//           </IconButton>
//           <Drawer anchor="right" open={mobileMenuOpen} onClose={handleMobileMenuClick}>
//             <List>
//               {menuItems}
//               {userInfo ? (
//                 <ListItem
//                   button
//                   component={Link}
//                   to='/user-profile'
//                   onClick={handleLogout}
//                 >
//                   <ListItemText primary="Logout" />
//                   <LogoutIcon />
//                 </ListItem>
//               ) : (
//                 <ListItem
//                   button
//                   component={Link}
//                   to='/login'
//                 >
//                   <ListItemText primary="Login" />
//                   <LoginIcon />
//                 </ListItem>
//               )}
//             </List>
//           </Drawer>
//           <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} />
//           <List
//             component="nav"
//             aria-labelledby="main navigation"
//             sx={{
//               display: { xs: 'none', md: 'flex' },
//               alignItems: 'center',
//             }}
//           >
//             {menuItems}
//             {userInfo ? (
//               <ListItem
//                 button
//                 component={Link}
//                 to='/user-profile'
//                 onClick={handleLogout}
//               >
//                 <ListItemText primary="Logout" />
//                 <LogoutIcon />
//               </ListItem>
//             ) : (
//               <ListItem
//                 button
//                 component={Link}
//                 to='/login'
//               >
//                 <ListItemText primary="Login" />
//                 <LoginIcon />
//               </ListItem>
//             )}
//           </List>
//         </Toolbar>
//       </AppBar>
//     </>
//   );
// }

// export default Navbar;

