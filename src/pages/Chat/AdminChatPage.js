// import React, { useState, useEffect, useRef } from 'react';
// import instance from '../../utils/Axios';
// import { useSelector } from 'react-redux';
// import jwtDecode from 'jwt-decode';
// import { w3cwebsocket } from 'websocket';
// import Avatar from '@mui/material/Avatar';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEye,faCheck } from '@fortawesome/free-solid-svg-icons';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// function AdminChatPage() {
//   const [chats, setChats] = useState([]);
//   const [messageInput, setMessageInput] = useState('');
//   const chatContainerRef = useRef(null);
//   const adminInfos = useSelector((state) => state.adminAuth.adminInfo);
//   const adminToken = useSelector((state) => state.adminAuth.adminInfo?.access);

//   const [decodedAdminInfo, setDecodedAdminInfo] = useState({});
//   const userInfos = useSelector((state) => state.auth.userInfo);
//   const [decodedUserInfo, setDecodedUserInfo] = useState({});
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     if (adminInfos) {
//       const decodedInfoAdmin = jwtDecode(adminInfos.access);
//       setDecodedAdminInfo(decodedInfoAdmin);
//     }
//   }, [adminInfos]);

//   useEffect(() => {
//     if (userInfos) {
//       // Decode the token and set the user info state
//       const decodedInfo = jwtDecode(userInfos.access); // Assuming 'access' contains user details
//       setDecodedUserInfo(decodedInfo);
//     }},[userInfos]);

//   useEffect(() => {
//     const roomId = `admin_${decodedAdminInfo.user_id}_user_${decodedUserInfo.user_id}`;
//     fetchChats(roomId);
//     setupWebSocket(roomId);
//   }, [decodedAdminInfo]);

//   useEffect(() => {
//     fetchChats();
//     setupWebSocket();
//   }, []);

//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//     }
//   }, [chats]);


  

//   const setupWebSocket = (roomId) => {
//     const newSocket = new w3cwebsocket(`ws://127.0.0.1:8003/ws/chat/chat-messages/${roomId}`);

//     newSocket.onopen = function (event) {
//       console.log('WebSocket connection established.');
//     };

//     newSocket.onmessage = function (event) {
//       const data = JSON.parse(event.data);
//       console.log('Received a message:', data);
//       if (data.is_admin_message) {
//         // Handle admin message
//         console.log('Received an admin message:', data);
//     } else {
//         // Handle regular user message
//         setChats((prevChats) => [...prevChats, data]);
//         if (data.receiver_id === decodedAdminInfo.user_id) {
//           // Notify the user
//           showNotification('New Message', data.message);
//     }
// };

//     newSocket.onclose = function (event) {
//       console.log('WebSocket connection closed:', event);
//     };

//     newSocket.onerror = function (error) {
//       console.error('WebSocket error:', error);
//     };

//     setSocket(newSocket);

//     return () => {
//       if (newSocket) {
//         newSocket.close();
//       }
//     };
//   };
//   }
//   const fetchChats = (roomId) => {
//     instance
//       .get(`/api/chat/chat-messages/?room_id=${roomId}`)
//       .then((response) => {
//         setChats(response.data);
    
//       })
//       .catch((error) => {
//         console.error('Error fetching chats:', error);
//       });
    
//     }

//     useEffect(() => {
//       fetchUnseenMessageCount();
//     }, []);

//     const markMessageAsSeen = async (messageId) => {
//       try {
//         if (!adminToken) {
//           // Handle the case where authToken is missing or invalid
//           return;
//       }
//         await instance.post('/api/chat/mark-message-seen/', { message_id: messageId }, {
//           headers: {
//               Authorization: `Bearer ${adminToken}`,
//           },
//       });
        
//           fetchChats();
//           fetchUnseenMessageCount(); 
//       } catch (error) {
//           console.error('Error marking message as seen:', error);
//       }
//   };
  
//   useEffect(() => {
//     fetchChats();
//     fetchUnseenMessageCount();
//   },[]);
   
//   const fetchUnseenMessageCount = () => {
//     if (adminToken) {
//       instance
//         .get('/api/chat/unseen-message-count/', {
//           headers: {
//             Authorization: `Bearer ${adminToken}`,
//           },

//         })
//         .then((response) => {
//           const unseenCount = response.data.unseen_count;

//           if (unseenCount > 0) {
//             showNotification(`You have ${unseenCount} new unseen messages!`);
//           }
//         })
//         .catch((error) => {
//           console.error('Error fetching unseen message count:', error);
//         });
//     }
//   };  

  

//   const sendMessage = () => {
//     if (messageInput.trim() !== '') {
//       const senderId = decodedAdminInfo.user_id;
//       const receiverId = decodedUserInfo.user_id;
  
//       const roomId = `admin_${decodedAdminInfo.user_id}_user_${decodedUserInfo.user_id}`;
  
//       const messageData = {
//         sender_id: senderId,
//         receiver_id: receiverId,
//         message: messageInput,
//         room_id: roomId,
//         is_admin_message: true,
//       };
  
//       instance
//         .post(`/api/chat/chat-messages/${senderId}/`, messageData)
//         .then((response) => {
//           if (response.status >= 200 && response.status < 300) {
//             setChats((prevChats) => [...prevChats, response.data]);
//             setMessageInput('');
//           } else {
//             console.error('Unexpected response:', response);
//           }
//         })
//         .catch((error) => {
//           console.error('Error sending message:', error);
//           if (error.response && error.response.status === 400) {
//             console.error('Bad Request:', error.response.data);
//           } else if (error.response && error.response.status === 404) {
//             console.error('Not Found:', error.response.data);
//           } else {
//             console.error('Unexpected error:', error);
//           }
//         });
//     }
    
//     }
//     useEffect(() => {
//       // This effect runs on mount and shows the notification using showNotification
//       showNotification('Admin', 'You have a new message');
//     }, []);
//     const showNotification = (title, message) => {
//       if (!('Notification' in window)) {
//         console.error('This browser does not support system notifications');
//         return;
//       }
  
//       if (Notification.permission === 'granted') {
//         // Create and show the notification
//         // new Notification(title, { body: message });
//       } else if (Notification.permission !== 'denied') {
//         // Request permission if not denied
//         Notification.requestPermission().then((permission) => {
//           if (permission === 'granted') {
//             // Create and show the notification
//             new Notification(title, { body: message });
//           }
//         });
//       }
//     };
//   return (
//     <div className="flex flex-col h-screen">
//       <div className="flex-none bg-gray-200 p-4">
//         <h1 className="text-2xl font-semibold"> Admin Chat Page </h1>
//       </div>
//       <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={chatContainerRef}>
//         {chats.map((msg, index) => (
//           <div key={index} className={`flex ${msg.sender === 3 ? 'justify-end' : 'justify-center'} items-center space-x-2`}>
//           {msg.is_admin_message && (

//             <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: '20px', height: '20px' }}>
//               {/* Avatar content */}
//             </Avatar>
//           )}
//             <div className={`p-2 max-w-xs rounded-lg ${msg.sender === 3 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>  
//                         <p className="m-0">{msg.message}</p>

                       
//         {!msg.is_read && msg.sender != 3 && (
//     <button
//         className="bg-gray-500 hover:bg-gray-200 text-white font-bold py-0 px-1 rounded mt-1"
//         onClick={() => markMessageAsSeen(msg.id)}
//     >
//         {msg.sender != 3 && (
//             <FontAwesomeIcon icon={faCheck} className="mr-0" />
//         )}
      
//     </button>
// )}
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="flex-none bg-gray-200 p-4">
//         <div className="flex items-center">
//           <input
//             type="text"
//             value={messageInput}
//             onChange={(e) => setMessageInput(e.target.value)}
//             className="flex-1 border p-2 rounded-lg mr-2"
//             placeholder="Type your message..."
//           />
//           <button onClick={sendMessage} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AdminChatPage;







































