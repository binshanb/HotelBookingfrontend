// ProviderChatRooms.js
import React, { useState, useEffect } from 'react';
import instance from '../../utils/Axios';
import { useSelector } from 'react-redux';
import ChatModal from './ChatModal';
import jwtDecode from 'jwt-decode';

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
  chatRoomsContainer: {
    textAlign: 'center',
    marginBottom: theme.spacing(4),
  },
  listItem: {
    border: '1px solid #ccc',
    borderRadius: theme.shape.borderRadius,
    margin: theme.spacing(1, 0),
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
  },
}));

const ProviderChatRooms = () => {
  const classes = useStyles();
  const [chatRooms, setChatRooms] = useState([]);
  console.log(chatRooms,"chat");
  const [selectedChatRoom, setSelectedChatRoom] = useState(null);
  console.log(selectedChatRoom,"selected");
  const user = useSelector((state) => state.auth.userInfo);
  const [decodedUserInfo,setDecodedUserInfo] = useState({})
  const userId = decodedUserInfo.user_id;
  console.log(userId,"userId");
  const admin = useSelector((state) => state.adminAuth.adminInfo);
  const [decodedAdminInfo,setDecodedAdminInfo] = useState({})
  const providerId = decodedAdminInfo.user_id;
  console.log(providerId,"proidddddddd");
  

  
  useEffect(() => {
    if (user) {
      // Decode the token and set the user info state
      const decodedInfo = jwtDecode(user.access); // Assuming 'access' contains user details
      setDecodedUserInfo(decodedInfo);
    }},[user]);

    
    useEffect(() => {
      if (admin) {
          // Decode the token and set the user info state
          const decodedInfoAdmin = jwtDecode(admin.access); // Assuming 'access' contains user details
          setDecodedAdminInfo(decodedInfoAdmin);
      }},[admin]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await instance.get(`/api/chat/provider-chat-rooms/${userId}/`);
        console.log(response.data,"response");
        setChatRooms(response.data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRooms();
  }, [providerId]);


 
  const handleRoomClick = (roomName) => {
    console.log(roomName,"roomname");
    setSelectedChatRoom(roomName);
    console.log(selectedChatRoom,"selected");
  };

  const handleCloseModal = () => {
    setSelectedChatRoom(null);
  };

  return (
    <div>
      <br/><br/>
    <Box>
      <Typography variant="h5" className={classes.chatRoomsContainer}>
        Welcome to Our Hotel Booking Chatting System. We are with you!
      </Typography>
      <List>
        {chatRooms.map((room, index) => (
          <ListItem key={index} onClick={() => handleRoomClick(room.name)} className={classes.listItem}>
            <ListItemText
              primary="Need to Chat with Our Admin Team? Click Here"
              // Add secondary text if needed
            />
          </ListItem>
        ))}
      </List>
    </Box>
      <br/><br/>
      <ChatModal open={selectedChatRoom} onClose={handleCloseModal} roomName={selectedChatRoom} userId={userId} />
    </div>
  );
};

export default ProviderChatRooms;