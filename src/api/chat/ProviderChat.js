import React, { useState, useEffect } from "react";
import useWebSocket from "react-use-websocket";
import instance from "../../utils/Axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const ProviderChat = ({ room_name, userId }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const { lastMessage, sendMessage } = useWebSocket(
    // room_name ? `ws://127.0.0.1:8000/ws/chat/${room_name}/?userId=${userId}` : null
    room_name ? `wss://backend.extremebookings.online/ws/chat/${room_name}/?userId=${userId}` : null
  );

  useEffect(() => {
    if (room_name) {
      // Fetch last 50 messages using Axios
      instance.get(`/api/chat/last-50-messages/${room_name}/`)
        .then(response => {
          setMessages(response.data);
          console.log(response.data)
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

  if (!room_name) {
    return <Typography variant="h5">Loading...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h5">Chat Room: {room_name}</Typography>
      <List  style={{ maxHeight: "300px", overflowY: "auto" }}>
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
      <Button onClick={handleSendMessage} variant="contained" color="primary">
        Send
      </Button>
    </Box>
  );
};

export default ProviderChat;