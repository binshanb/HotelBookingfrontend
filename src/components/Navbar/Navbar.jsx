import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import {selectUserInfo,logout} from "../../redux/slices/userslices/authSlice"; 
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, ListItemIcon,Divider  } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import RoomIcon from "@mui/icons-material/Room";
import RoomServiceIcon from "@mui/icons-material/RoomService";
import InfoIcon from "@mui/icons-material/Info";
import MessageIcon from "@mui/icons-material/Message";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import LockIcon from "@mui/icons-material/Lock";
import img from "../../assets/logo7.png";
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
            {/* Your Title or Logo */}
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
              to={userInfo ? '/user/user-profile' : '/login'}
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
