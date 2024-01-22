import React, { useState, useEffect } from "react";
import useWebSocket from "react-use-websocket";
import instance from "../../utils/Axios";
// import jwtDecode from "jwt-decode";

import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import Modal from "react-modal";
import Paper from "@mui/material/Paper";
import CloseIcon from "@mui/icons-material/Close";
// import { useSelector } from "react-redux";



const UserChat = ({ room_name,userId,open,onClose }) => {

  // const user = useSelector((state)=>state.auth.userInfo);
  // const [decodedUserInfo,setDecodedUserInfo]=useState({});
  console.log(room_name,userId,open, onClose ,"all details");
 
  
  const [messages, setMessages] = useState([]);
  console.log(messages,"messages");
  const [messageInput, setMessageInput] = useState("");
  console.log(messageInput,"mesInput");
  const { lastMessage, sendMessage } = useWebSocket(
    // room_name ? `wss://backend.rerealise.online/ws/chat/${room_name}/?userId=${userId}` : null
    room_name ? `ws://127.0.0.1:8000/ws/chat/${room_name}/?userId=${userId}` : null
  );

  // useEffect(() => {
  //   if (user) {
  //     // Decode the token and set the user info state
  //     const decodedInfo = jwtDecode(user.access); // Assuming 'access' contains user details
  //     setDecodedUserInfo(decodedInfo);
  //   }},[user]);
  useEffect(() => {
    console.log('WebSocket connected:', lastMessage);
  }, [lastMessage]);

  useEffect(() => {
    if (room_name) {
      // Fetch last 50 messages using Axios
      instance.get(`/api/chat/last-50-messages/${room_name}/`)
        .then(response => {
          setMessages(response.data);
        })
        .catch(error => {
          console.error('Error fetching messages:', error);
        });
    }
  }, [room_name]);

  useEffect(() => {
    if (lastMessage && lastMessage.data) {
      try {
        const data = JSON.parse(lastMessage.data);

        if (data.type === 'chat.message') {
          const message = data.message;

          if (message.content && message.user) {
            setMessages((prevMessages) => [...prevMessages, message]);
          } else {
            console.error('Invalid message format:', message);
          }
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    }
  }, [lastMessage]);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage = {
        message: messageInput,
        sender: userId,
      };
      sendMessage(JSON.stringify(newMessage));
      setMessageInput("");
    }
  };

  // if (!room_name) {
  //   return <Typography variant="h5">Loading...</Typography>;
  // }

  return (
    
      
<Modal open={open} onClose={onClose} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Paper elevation={3} style={{ width: "80%", maxWidth: "600px", maxHeight: "70vh", overflowY: "auto" }}> 
        <Box>
          <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
         
          >
             <Typography variant="h5">Chat</Typography>
             <IconButton onClick={onClose} sx={{color:"red"}}>
                <CloseIcon/>
             </IconButton>

          </Box>
          <List  style={{ maxHeight: "300px", overflowY: "scroll" }}>
            {messages.map((msg, index) => (
              <ListItem key={index}
              style={{
                textAlign: msg.user === userId ? 'left' : 'right',
            }}
              >
                <ListItemText
                  primary={msg.user === userId ? "You" : "Provider"}
                  secondary={msg.content}
                  style={{
                    color: msg.user === userId ? 'blue' : 'green', // Set colors based on user
                  }}
                />
              </ListItem>
            ))}
          </List>
          <TextField
            label="Type your message"
            variant="outlined"
            fullWidth
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <Box 
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          sx={{mt:2,mb:2}}
          
          >
            <Button onClick={handleSendMessage} variant="contained" color="primary"  style={{ marginLeft: 'auto' }}>
              Send
            </Button>
          </Box>
        </Box>
         </Paper> 
     </Modal> 
     
    
  );
};

export default UserChat;