import React, { useState, useEffect, useRef } from 'react';
import instance from '../../utils/Axios';
import { useSelector } from 'react-redux';
import jwtDecode from 'jwt-decode';
import { baseUrl } from '../../utils/constants';
import { w3cwebsocket } from 'websocket';
import Avatar from '@mui/material/Avatar';





function AdminChat() {
    const [chats, setChats] = useState([]);
    console.log(chats,"chat");
    const [messageInput, setMessageInput] = useState('');
    console.log(messageInput,"message");
    const chatContainerRef = useRef(null);
    const userInfos = useSelector((state) => state.auth.userInfo);
    const [decodedUserInfo, setDecodedUserInfo] = useState({});
    console.log(decodedUserInfo,"userInfo");
    const adminInfos = useSelector((state) => state.adminAuth.adminInfo);
    const [decodedAdminInfo, setDecodedAdminInfo] = useState({});
    console.log(decodedAdminInfo,"adminInfo");
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (userInfos) {
          // Decode the token and set the user info state
          const decodedInfo = jwtDecode(userInfos.access); // Assuming 'access' contains user details
          setDecodedUserInfo(decodedInfo);
        }},[userInfos]);
    useEffect(() => {
        if (adminInfos) {
            // Decode the token and set the user info state
            const decodedInfoAdmin = jwtDecode(adminInfos.access); // Assuming 'access' contains user details
            setDecodedAdminInfo(decodedInfoAdmin);
        }},[adminInfos]);

    useEffect(() => {
        fetchChats();
        setupWebSocket();
    }, []);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chats]);

    const setupWebSocket = () => {

      const newSocket = new w3cwebsocket('wss://backend.extremehotelbooking.online/ws/chat/chat-messages/');
      // const newSocket = new w3cwebsocket('ws://127.0.0.1:8003/ws/chat/chat-messages/'); 
    
        newSocket.onopen = function(event) {
          console.log('WebSocket connection established.');
          // Handle any initialization or sending of data here if needed
        };
    
        newSocket.onmessage = function(event) {
          const data = JSON.parse(event.data);
          console.log('Received a message:', data);
    
          // Handle the received message data in your React component
          // For example, update messages state
          setChats(prevChats => [...prevChats, data]);
        };
    
        newSocket.onclose = function(event) {
          console.log('WebSocket connection closed:', event);
          // Handle WebSocket closure
        };
    
        newSocket.onerror = function(error) {
          console.error('WebSocket error:', error);
          // Handle WebSocket errors
        };
    
        setSocket(newSocket);
    
        // Clean up the WebSocket connection on unmount
        return () => {
          if (newSocket) {
            newSocket.close();
          }
        };
      };

    const fetchChats = () => {
        instance.get('/api/chat/chat-messages/') 
            .then(response => {
                setChats(response.data);
            })
            .catch(error => {
                console.error('Error fetching chats:', error);
            });
    };

    const sendMessage = () => {
        if (messageInput.trim() !== '') {
            const senderId = decodedAdminInfo.user_id; // Assuming user_id is part of decodedUserInfo
            const receiverId = decodedUserInfo.user_id; // Assuming admin_id is part of decodedAdminInfo
            
            const messageData = {
                sender_id: senderId,
                receiver_id: receiverId,
                message: messageInput
            };
        
    
            instance.post('/api/chat/chat-messages/',messageData) 
              .then(response => {
                // After successfully sending the message, fetch updated chats
                  setChats(prevChats => [...prevChats, messageData]);
                  setMessageInput(''); // Clear the message input field
              })
              .catch(error => {
                console.error('Error sending message:', error);
              });
        }
    };
    

    const isAdminMessage = (msg) => {
        const userId = decodedUserInfo.user_id;
        const adminId = decodedAdminInfo.user_id;
    
        // Check if the sender_id matches the current user ID or the admin ID
        return msg.sender_id === userId || msg.sender_id === adminId;
    };
    

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-none bg-gray-200 p-4">
                <h1 className="text-2xl font-semibold">Admin Chat</h1>
            </div>
            <div className="flex-1 overflow-y-auto p-4" ref={chatContainerRef}>
            {chats.map((msg, index) => (
            
            <div key={index} className={msg.sender === 8 ?  'flex justify-start':'flex justify-end'}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          </Avatar>
            <div className={`p-2 max-w-xs rounded-lg ${isAdminMessage(msg) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
            <p className="m-0">{msg.message}</p>
            <p>{msg.sender != 8 ?  decodedUserInfo.email : 'Admin' }</p>
            <p>{new Date(msg.timestamp).toLocaleString()}</p>
      </div>
    </div>
  ))}
</div>

            <div className="flex-none bg-gray-200 p-4">
                <div className="flex items-center">
                  <input
                       type="text"
                       value={messageInput}
                       onChange={(e) => setMessageInput(e.target.value)} // Update messageInput state on change
                       className="flex-1 border p-2 rounded-lg mr-2"
                       placeholder="Type your message..."
                       />

                    <button onClick={sendMessage} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Send</button>
                </div>
            </div>
        </div>
    );
}

export default AdminChat;
