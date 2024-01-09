import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import {selectUserInfo,logout} from "../../redux/slices/userslices/authSlice"; 
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, ListItemIcon,Divider  } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";


import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import LockIcon from "@mui/icons-material/Lock";
import img from "../../assets/booking1-logo.png";
import "./Navbar.css";


function Navbar() {

  const userInfo = useSelector(selectUserInfo);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentActive, setCurrentActive] = useState(null);
  const dispatch = useDispatch();
  const handleMobileMenuClick = () => {
    setMobileMenuOpen((prevState) => !prevState);
  };

  // const { userInfo } = useSelector((state) => state.auth);

  const handleClick = (index) => {
    setCurrentActive(index);
  };

  const navLinks = [
    { id: 1, text: "Home", path: "/" },
    { id: 2, text: "Rooms", path: "/categorylist" },
    { id: 3, text: "Services", path: "/services" },
    { id: 4, text: "Inbox", path: "/chat-messages" },
    { id: 5, text: "About", path: "/about" },
    { id: 6, text: "Contact", path: "/contact" },
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
      }}
    >
      {/* <ListItemIcon>
        {link.id === 1 && <HomeIcon />}
        {link.id === 2 && <RoomIcon />}
        {link.id === 4 && <MessageIcon />}
        {link.id === 3 && <RoomServiceIcon />}
        {link.id === 5 && <InfoIcon />}
        {link.id === 6 && <ContactPhoneIcon />}
      </ListItemIcon> */}
      <ListItemText primary={link.text} />
    </ListItem>
  ));

  return (
    <>
     <AppBar position="static" sx={{ backgroundColor: '#fff', color: '#333',height: '64px' }}>
        <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 400,fontSize: '1.5rem' }}>
            {/* Logo */}
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
            <List>{menuItems}</List>
          </Drawer>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} />
          <List component="nav" aria-labelledby="main navigation" sx={{ display: { xs: 'none', md: 'flex' } }}>
            {menuItems}
            <ListItem
              component={Link}
              to={userInfo ? '/user-profile' : '/login'}
              selected={userInfo ? false : currentActive === null}
              button
              onClick={() => setCurrentActive(null)}
            >
              <ListItemIcon>
                <PersonIcon primary={userInfo ? 'Profile' : 'Login'}/>
              </ListItemIcon>
              {/* <ListItemText primary={userInfo ? 'Profile' : 'Login'} /> */}
            </ListItem>
            {userInfo ? (
              <>
                <Divider orientation="vertical" flexItem />
                <ListItem sx={{ display: 'flex', alignItems: 'center' }}>
                  <ListItem button onClick={() => dispatch(logout())}>
                    <ListItemIcon>
                      <LogoutIcon />
                    </ListItemIcon>
                    {/* <ListItemText primary="Logout" /> */}
                  </ListItem>
                  <Divider orientation="vertical" flexItem />
                  <ListItem button component={Link} to="/change-password">
                    <ListItemIcon>
                      <LockIcon />
                    </ListItemIcon>
                    {/* <ListItemText primary="Change Password" /> */}
                  </ListItem>
                </ListItem>
              </>
            ) : (
              <ListItem component={Link} to="/login">
                <ListItemIcon>
                  <LoginIcon />
                </ListItemIcon>
              </ListItem>
            )}
          </List>
        </Toolbar>
      </AppBar>
    </>
  );
}


export default Navbar;



// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import "./Navbar.css";
// import img from "../../assets/booking1-logo.png";
// import { MdOutlineLogout } from "react-icons/md";
// import {selectUserInfo,logout} from "../../redux/slices/userslices/authSlice"; 
// import { toast } from "react-toastify";
// import instance from "../../utils/Axios";

// const Navbar = () => {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [currentActive, setCurrentActive] = useState(null);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const showToast = (message, type = "error") => {
//     toast[type](message, {
//       position: toast.POSITION.TOP_RIGHT,
//       autoClose: 3000, // 3 seconds
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//     });
//   };

//   const handleMobileMenuClick = () => {
//     setMobileMenuOpen((prevState) => !prevState);
//   };

//   const { userInfo } = useSelector((state) => state.auth);

//   const handleClick = (index) => {
//     setCurrentActive(index);
//   };

//   const handleLogout = () => {
//     dispatch(logout());
//     showToast("Logout successfully", "success");
//   };
//   useEffect(() => {
//     if (userInfo) {
//       const token = localStorage.getItem("userInfo")
//         ? JSON.parse(localStorage.getItem("userInfo")).access
//         : null;
//       const checkAndUpdateSubscription = async () => {
//         try {
//           const response = await instance.get(
//             "/api/user/subscription-detail/",
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             }
//           );

//           const user = response.data;
//           if (userInfo.type === "Premium") {
//             console.log("prermium");
//           } else if (user && user.expire_date) {
//             console.log("poda /.........");
//             const expireDate = new Date(user.expire_date);

//             if (expireDate <= new Date()) {
//               const updateResponse = await instance.patch(
//                 "/api/user/update-subscription-plan/",
//                 {
//                   subscription_plan: null,
//                 },
//                 {
//                   headers: {
//                     Authorization: `Bearer ${token}`,
//                   },
//                 }
//               );

//               if (updateResponse.status === 200) {
//                 const subscriptionType=null
//                 dispatch(selectUserInfo(subscriptionType)); 
//               } else {
//                 showToast("Failed to update subscription plan", "error");
//               }
//             }
//           }
//         } catch (error) {
//           console.error("Error checking and updating subscription:", error);
//           showToast("Error checking and updating subscription", "error");
//         }
//       };

//       checkAndUpdateSubscription();
//     }
//   }, [dispatch, userInfo?.type, setCurrentActive]);

//   const navLinks = [
//     { id: 1, text: "Home", path: "/" },
//     { id: 4, text: "Lives", path: "/lives" },
//     { id: 3, text: "Courses", path: "/courses" },
//     { id: 2, text: "Plans", path: "/plans" },
//   ];

//   return (
//     <>
//       <nav>
//         <Link to="/">
//           <img src={img} alt="Logo" />
//         </Link>
//         <div>
//           <ul id="navbar" className={mobileMenuOpen ? "active" : ""}>
//             {navLinks.map((link) => (
//               <li key={link.id}>
//                 <Link
//                   to={link.path}
//                   className={link.path === window.location.pathname ? "active-link" : ""}
//                   onClick={() => {
//                     handleClick(link.id);
//                     if (window.innerWidth <= 769) {
//                       handleMobileMenuClick();
//                     }
//                   }}
//                 >
//                   {link.text}
//                 </Link>
//               </li>
//             ))}
//             <li>
//               <Link to="/profile" className="profile-icon">
//                 <i className="fas fa-user"></i>
//               </Link>
//             </li>
//             {userInfo ? (
//               <li>
//                 <button
//                   className="logout-buttons rounded-lg"
//                   onClick={handleLogout}
//                 >
//                   <MdOutlineLogout className="ml-2" />
//                 </button>
//               </li>
//             ) : (
//               <li>
//                 <Link to="/login">Login</Link>
//               </li>
//             )}
//           </ul>
//         </div>
//         <div id="mobile" onClick={handleMobileMenuClick}>
//           <i
//             id="bar"
//             className={mobileMenuOpen ? "fas fa-times" : "fas fa-bars"}
//           ></i>
//         </div>
//       </nav>
//     </>
//   );
// };

// export default Navbar;