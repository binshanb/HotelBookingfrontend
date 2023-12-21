// import React, { useEffect, useState } from 'react';
// import instance from '../../utils/Axios';
// import { TextField, Button, Paper } from '@mui/material'; // Import Material UI components

// const AdminChat = () => {
//     const [messages, setMessages] = useState([]);
//     const [responseMessage, setResponseMessage] = useState('');

//     useEffect(() => {
//         // Fetch messages sent by users from the backend
//         const fetchMessages = async () => {
//             try {
//                 const response = await instance.get('/api/chat/admin/messages/');
//                 setMessages(response.data);
//             } catch (error) {
//                 console.error('Error fetching messages:', error);
//             }
//         };
//         fetchMessages();
//     }, []);

//     const sendResponse = async (messageId, responseMessage) => {
//         try {
//             await instance.post(`/api/chat/admin/messages/${messageId}/response`, {
//                 message: responseMessage,
//             });
//             const response = await instance.get('/api/chat/admin/messages/');
//             setMessages(response.data);
//         } catch (error) {
//             console.error('Error sending response:', error);
//         }
//     };

//     return (
//         <div>
//             {/* Render UI for Admin Chat Component */}
//             {/* Display user messages and provide input to send responses */}
//             {messages.map((message) => (
//                 <Paper key={message.id} style={{ margin: '10px', padding: '10px' }}>
//                     <p>{message.message}</p>
//                     {/* Implement UI to send a response */}
//                     <TextField
//                         variant="outlined"
//                         placeholder="Type response..."
//                         value={responseMessage}
//                         onChange={(e) => setResponseMessage(e.target.value)}
//                         style={{ marginBottom: '10px' }}
//                     />
//                     <Button
//                         variant="contained"
//                         color="primary"
//                         onClick={() => sendResponse(message.id, responseMessage)}
//                     >
//                         Send Response
//                     </Button>
//                 </Paper>
//             ))}
//         </div>
//     );
// };

// export default AdminChat;





// import React, { useState, useEffect } from "react";
// import { w3cwebsocket as W3CWebSocket } from "websocket";
// import { Container, Typography, TextField, Button } from "@mui/material";

// function AdminChat() {
//   const [socket, setSocket] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState(""); // New state to hold the current message

//   useEffect(() => {
//     // Establish WebSocket connection for the admin
//     const newSocket = new W3CWebSocket("ws://localhost:8000/ws/admin-chat/");
//     setSocket(newSocket);

//     newSocket.onopen = () => console.log("WebSocket connected");
//     newSocket.onclose = () => console.log("WebSocket disconnected");

//     // Clean up the WebSocket connection when the component unmounts
//     return () => {
//       newSocket.close();
//     };
//   }, []);

//   useEffect(() => {
//     if (socket) {
//       socket.onmessage = (event) => {
//         const data = JSON.parse(event.data);
//         setMessages((prevMessages) => [...prevMessages, data]);
//       };
//     }
//   }, [socket]);

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     if (message.trim() !== "" && socket) {
//       const data = {
//         message: message,
//         username: "Admin", // Set admin's username here
//       };
//       socket.send(JSON.stringify(data));
//       setMessage(""); // Clear the input field after sending the message
//     }
//   };

//   return (
//     <Container maxWidth="md">
//     <Typography variant="h4" gutterBottom>
//       Admin Chat
//     </Typography>
//     <div>
//       {messages.map((message, index) => (
//         <div key={index}>
//           <Typography variant="subtitle1">
//             <strong>{message.username}:</strong> {message.message}
//           </Typography>
//           <Typography variant="caption" color="textSecondary">
//             {message.timestamp}
//           </Typography>
//         </div>
//       ))}
//     </div>
//     <form onSubmit={handleSubmit}>
//       <TextField
//         variant="outlined"
//         fullWidth
//         placeholder="Type a message..."
//         value={message}
//         onChange={(event) => setMessage(event.target.value)}
//       />
//       <br/><br/>
//       <Button variant="contained" color="primary" type="submit">
//         Send
//       </Button>
//     </form>
//   </Container>
//   );
// }
// export default AdminChat;


  
//         <div className="flex h-screen  p-2">
//         <div className="flex flex-col flex-grow w-3/5 mt-20 p-1 m-2 bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.27),0_10px_20px_-2px_rgba(0,0,0,0.04)] rounded-lg overflow-hidden">
//           {bg ? (
//             <div ref={ref} className="flex flex-col flex-grow h-0 p-4 overflow-auto">
//               {messages?.map((message, index) =>
//                 message?.sender_email === user.email ? (
//                   <div
//                     key={index}
//                     className="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end"
//                   >
//                     <div>
//                       <div className="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
//                         <p className="text-sm">
//                           {message.message ? message.message : message.text}
//                         </p>
//                       </div>
//                       <span className="text-xs text-gray-500 leading-none">
//                         {message.created} ago
//                       </span>
//                     </div>
//                     <img
//                       className="flex-shrink-0 h-10 w-10 rounded-full"
//                       src={`${baseUrl}${user?.display_pic}`}
//                       alt="user"
//                     />
//                   </div>
//                 ) : (
//                   <div key={index} className="flex w-full mt-2 space-x-3 max-w-xs">
//                     <img
//                       className="flex-shrink-0 h-10 w-10 rounded-full"
//                       src={`${baseUrl}`+dpChat}
//                       alt="user"
//                     />
//                     <div>
//                       <div className="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
//                         <p className="text-sm">
//                           {message.message ? message.message : message.text}
//                         </p>
//                       </div>
//                       <span className="text-xs text-gray-500 leading-none">
//                         {message.created} ago
//                       </span>
//                     </div>
//                   </div>
//                 )
//               )}
//               <div className="flex-grow"></div>
//               <div className="bg-[#c2c2c2] p-4 rounded-xl">
//                 <div className="relative flex w-full flex-wrap items-stretch">
//                   <input
//                     type="text"
//                     value={inputMessage}
//                     onChange={(e) => setInputMessage(e.target.value)}
//                     className="relative m-0 -mr-0.5 block w-[1px] min-w-0 flex-auto rounded-l border border-solid border-[#4b2848] bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
//                     aria-describedby="button-addon1"
//                   />
//                   <button
//                     className="relative z-[2] flex items-center rounded-r bg-primary px-6 py-2.5 text-xs font-medium uppercase leading-tight text-[#4b2848] shadow-md transition duration-150 ease-in-out hover:bg-primary-700 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg"
//                     type="button"
//                     onClick={handleSendMessage}
//                     id="button-addon1"
//                     data-te-ripple-init
//                     data-te-ripple-color="light"
//                   >
//                     <span className="material-symbols-outlined">Send</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="flex flex-col flex-grow p-4 overflow-auto">
//               <p className="mx-auto my-auto ">Select person to start messaging</p>
//             </div>
//           )}
//         </div>
//         <div className="w-2/5 mt-20 p-1 m-2 overflow-y-auto bg-white rounded-lg shadow-[0_2px_15px_-3px_rgba(0,0,0,0.27),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
//           {profiles ? (
//             profiles.map((profile) => (
//               <div
//                 key={profile.id}
//                 onClick={() => joinChatroom(profile.id, profile.members[0].id, profile.members[0].display_pic)}
//                 className="relative flex items-center rounded-lg m-1 cursor-pointer bg-gray-300 p-2 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]"
//               >
//                 {profile.unseen_message_count > 0 && (
//                   <div className="absolute top-0 left-0 bg-red-500 text-white px-2 py-1 rounded-full">
//                     {profile.unseen_message_count}
//                   </div>
//                 )}

//                 <img
//                   className="w-14 rounded-full h-14  mr-2"
//                   src={baseUrl + profile.members[0].display_pic}
//                   alt="profile"
//                 />
//                 <div className="flex-grow">
//                   <h5 className="mb-1 text-sm font-medium leading-tight text-neutral-800 text-start">
//                     {profile.members[0].username}
//                   </h5>
//                 </div>
//               </div>
//             ))
//           ) : null}
//         </div>
//       </div>

//   )
// }

