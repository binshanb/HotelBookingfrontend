import React, { useState, useEffect } from "react";
import useWebSocket from "react-use-websocket";
import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import jwtDecode from "jwt-decode";
import { useSelector } from "react-redux";
import instance from "../../utils/Axios";


const ChatApp = () => {
  const user = useSelector((state) => state.auth.userInfo);
  const [decodedUserInfo,setDecodedUserInfo] = useState({});
  const userId = decodedUserInfo.user_id;
  const admin = useSelector((state) => state.adminAuth.adminInfo);
  const [decodedAdminInfo,setDecodedAdminInfo] = useState({});
  const providerId = decodedAdminInfo.user_id;
  console.log(providerId,"provider");

  

  const [chatRooms, setChatRooms] = useState([]);
  const [unseenCounts, setUnseenCounts] = useState({});
  const [selectedChatRoom, setSelectedChatRoom] = useState(null);
  console.log(selectedChatRoom,"selchatroom");
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const { lastMessage, sendMessage } = useWebSocket(
    selectedChatRoom ? `wss://backend.extremehotelbooking.online/ws/chat/${selectedChatRoom}/?userId=${providerId}` : null
    // selectedChatRoom  ? `wss://127.0.0.1:8000/ws/chat/${selectedChatRoom}/?userId=${providerId}` : null

  );



  
  useEffect(() => {
    if (user) {
      // Decode the token and set the user info state
      const decodedInfo = jwtDecode(user.access); // Assuming 'access' contains user details
      setDecodedUserInfo(decodedInfo);
    }},[user]);
    useEffect(() => {
      if (admin) {
        // Decode the token and set the user info state
        const decodedInfo = jwtDecode(admin.access); // Assuming 'access' contains user details
        setDecodedAdminInfo(decodedInfo);
      }},[admin]);
  useEffect(() => {
    // Fetch rooms
    instance
      .get(`/api/chat/provider-chat-rooms/${providerId}/`)
      .then((response) => {
        setChatRooms(response.data);
      })
      .catch((error) => {
        console.error("Error fetching rooms:", error);
      });
  }, [providerId]);

  const fetchMessages = (roomName) => {
    // Fetch messages for the selected room
    instance
      .get(`/api/chat/last-50-messages/${roomName}/`)
      .then((response) => {
        setMessages(response.data);
        console.log('50 msg:',response.data)
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  };

  useEffect(() => {
    if (lastMessage && lastMessage.data) {
      try {
        const data = JSON.parse(lastMessage.data);

        if (data.type === "chat.message") {
          const message = data.message;

          if (message.content && message.user) {
            setMessages((prevMessages) => [...prevMessages, message]);
          } else {
            console.error("Invalid message format:", message);
          }
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    }
  }, [lastMessage]);

  const handleRoomClick = async (roomName,roomId) => {
    try {
     
      // Fetch messages for the selected room
      setSelectedChatRoom(roomName);
      fetchMessages(roomName);
       // Mark messages as seen
       await instance.patch(`/api/chat/mark-messages-as-seen/${roomId}/`);
       fetchUnseenMessageCounts();
       
       
    } catch (error) {
      console.error("Error marking messages as seen:", error);
    }
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage = {
        message: messageInput,
        sender: providerId, // Assuming the sender is the user for simplicity
      };
      sendMessage(JSON.stringify(newMessage));
      setMessageInput("");
    }
  };
   
  const fetchUnseenMessageCounts = async () => {
    const counts = {};
    for (const room of chatRooms) {
      try {
        const response = await instance.get(`/api/chat/unseen-messages-count/${room.id}/`);
        counts[room.id] = response.data.unseen_count;
      } catch (error) {
        console.error(`Error fetching unseen count for room ${room.id}:`, error);
      }
    }
    setUnseenCounts(counts);
  };



  useEffect(() => {
    // Fetch unseen message counts for each room
   
    fetchUnseenMessageCounts();
  }, [chatRooms]);

  const handleCloseModal = () => {
    setSelectedChatRoom(null);
  };


  return (
    <>
    <Box p={2}style={{ backgroundColor: '#f0f0f0' }}>
      <Grid container spacing={2}>
        {/* Room List (Right Side) */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6"  align="center"
             sx={{backgroundColor:'#E24871'}}
          >Your Chat Rooms</Typography>
           <List>
            {chatRooms.map((room, index) => (
              <ListItem
                key={index}
                button
                onClick={() => handleRoomClick(room.name,room.id)}
                selected={selectedChatRoom === room.name}
                style={{backgroundColor:'#F1F620'}}
              >
                <ListItemText 
                  primary={room.username} 
                  secondary={`Unseen Messages: ${unseenCounts[room.id] || 0}`}
                  style={{ backgroundColor: selectedChatRoom === room.name ? '#E24871' : 'transparent',
                  borderRadius: '10px',
                  padding:'5px',
                  }}
                
                />
                
              </ListItem>
            ))}
          </List>
        </Grid> 

        {/* Chat Box (Left Side) */}
        <Grid item xs={12} md={8}>
          {selectedChatRoom ? (
            <Box>
              <Typography variant="h6" align='center'>Chat With User</Typography>
              <List style={{ maxHeight: "400px", overflowY: "scroll", backgroundColor: '#95C5F6' }}>
                {messages.map((msg, index) => (
                  <ListItem key={index}
                    style={{
                        textAlign: msg.user === providerId ? 'left' : 'right',
                    }}
                  >
                    <ListItemText
                      primary={msg.user === providerId ? "You" : "User"}
                      secondary={msg.content}
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
              <Button
                onClick={handleSendMessage}
                variant="contained"
                color="primary"
              >
                Send
              </Button>
            </Box>
        ) : ( 
            <Typography variant="h6">
              Select a User to start chatting
            </Typography>
          )} 
        </Grid>
      </Grid>
    </Box>
 

  </>
  );
};

export default ChatApp;