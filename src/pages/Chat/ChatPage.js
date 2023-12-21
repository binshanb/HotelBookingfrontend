import React, { useState, useEffect, useRef } from 'react';
import instance from '../../utils/Axios';
import { useSelector } from 'react-redux';
import jwtDecode from 'jwt-decode';
import { baseUrl } from '../../utils/constants';
import { w3cwebsocket } from 'websocket';
function ChatPage() {
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

    
        const newSocket = new w3cwebsocket('ws://127.0.0.1:8000/ws/chat/chat-messages/'); // Replace with your WebSocket URL
    
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
        instance.get(`${baseUrl}/api/chat/chat-messages/`) 
            .then(response => {
                setChats(response.data);
            })
            .catch(error => {
                console.error('Error fetching chats:', error);
            });
    };

    const sendMessage = () => {
        if (messageInput.trim() !== '') {
            const senderId = decodedUserInfo.user_id; // Assuming user_id is part of decodedUserInfo
            const receiverId = decodedAdminInfo.user_id; // Assuming admin_id is part of decodedAdminInfo
            
            const messageData = {
                sender_id: senderId,
                receiver_id: receiverId,
                message: messageInput
            };
        
    
            instance.post(`${baseUrl}/api/chat/chat-messages/`,messageData) 
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
    

    const isUserMessage = (msg) => {
        const userId = decodedUserInfo.user_id;
        const adminId = decodedAdminInfo.user_id;
    
        // Check if the sender_id matches the current user ID or the admin ID
        return msg.sender_id === userId || msg.sender_id === adminId;
    };
    

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-none bg-gray-200 p-4">
                <h1 className="text-2xl font-semibold">Chat Component</h1>
            </div>
            <div className="flex-1 overflow-y-auto p-4" ref={chatContainerRef}>
            {chats.map((msg, index) => (
            <div key={index} className={msg.sender > 1 ? 'flex justify-end' : 'flex justify-start'}>
            <div className={`p-2 max-w-xs rounded-lg ${isUserMessage(msg) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
            <p className="m-0">{msg.message}</p>
            <p>{msg.sender > 1 ?  decodedUserInfo.email : 'Admin' }</p>
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

export default ChatPage;






























// import React, { useState, useEffect } from 'react';
// import instance from "../../utils/Axios"
// import {useParams } from 'react-router-dom';
// import { baseUrl } from '../../utils/constants';

// import { Container, Paper, TextField, Button, Grid } from '@material-ui/core';
// import SendOutlinedIcon from '@material-ui/icons/SendOutlined';
// import { useSelector } from 'react-redux';
// const UserChat = () => {
//   const userId = useSelector
//   const { chatId } = useParams();
//   const [messages, setMessages] = useState([]);
//   const [messageInput, setMessageInput] = useState('');
//   // const [sockets, setSockets] = useState(null);

//   // useEffect(() => {
//   //   // Create a WebSocket connection when the component mounts
//   //   const newSocket = new WebSocket(`ws://localhost:8000/ws/chat/${chatId}/`);
//   //   setSockets(newSocket);

//   //   return () => {
//   //     // Close the WebSocket connection when the component unmounts
//   //     newSocket.close();
//   //   };
//   // }, [chatId]);

//   // useEffect(() => {
//   //   if (sockets) {
//   //     // Listen for 'message' event from the WebSocket server
//   //     sockets.on('message', (newMessage) => {
//   //       setMessages([...messages, newMessage]);
//   //     });
//   //   }
//   // }, [sockets, messages]);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const response = await instance.get(`${baseUrl}/api/chat/messages/${chatId}`);
//         setMessages(response.data);
//       } catch (error) {
//         console.error('Error fetching messages:', error);
//       }
//     };

//     if (chatId) {
//       fetchMessages();
//     }
//   }, [chatId]);

//   const handleSendMessage = async (room_id,user_id) => {
//     try {
//       const response = await instance.post(`${baseUrl}/api/chat/send-message/`, {
//         content: messageInput,
//       });
    
//       setMessages([...messages, response.data]);
//       setMessageInput('')
    
      
//       // Emit 'new message' event to WebSocket server
//     //   sockets.emit('new message', response.data);
//     } catch (error) {
//       console.error('Error sending message:', error);
//     }
    
//   }
//   return (
//     <Container maxWidth="sm">
//     <Paper elevation={3} style={{ height: '70vh', padding: '20px', marginTop: '30px' }}>
//       {/* Chat messages area */}
//       <div style={{ overflowY: 'auto', maxHeight: 'calc(70vh - 90px)' }}>
//         {messages.map((message, index) => (
//           <div key={index} style={{ marginBottom: '10px' }}>
//             {message.sender}: {message.content}
//           </div>
//         ))}
//       </div>
//       {/* Message input and send button */}
//       <Grid container spacing={2} alignItems="center" style={{ marginTop: '20px' }}>
//         <Grid item xs={9}>
//           <TextField
//             fullWidth
//             variant="outlined"
//             placeholder="Type a message..."
//             value={messageInput}
//             onChange={(e) => setMessageInput(e.target.value)}
//           />
//         </Grid>
//         <Grid item xs={3}>
//           <Button
//             variant="contained"
//             color="primary"
//             endIcon={<SendOutlinedIcon />}
//             onClick={handleSendMessage}
//             disabled={!messageInput.trim()}
//             fullWidth
//           >
//             Send
//           </Button>
//         </Grid>
//       </Grid>
//     </Paper>
//   </Container>
//   );
// };

// export default UserChat;
































// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import instance from "../../utils/Axios"
// import { toast } from "react-toastify";
// import { useParams } from "react-router-dom";
// import WebSocket from 'ws';
// // import jwt from 'jsonwebtoken';
// import { useJwt } from "react-jwt";

// // import * as jwt_decode from "jwt-decode";

// const ENDPOINT = "http://localhost:8000";

// var socket, selectedChatCompare;
// const UserChat = () => {
//   const { userInfo } = useSelector((state) => state.auth);
//   const [rooms, setRooms] = useState([]);
//   const [chatId, setChatId] = useState("");
//   const [chats, setChats] = useState([]);
//   const [hotel, setHotel] = useState("");
//   const [content, setContent] = useState("");
//   const [messageSent, setMessageSent] = useState(false);
//   const [socketConnected, setSocketConnected] = useState(false);

 

//   const { chatid } = useParams();
//   const userToken = userInfo.userToken;
//   console.log(userToken,'userToken');
//   const { decodedToken } = useJwt(userToken);
//   console.log(decodedToken,'decodedToken');

//   useEffect(() => {
//     const setupSocket = () => {
//       if(userToken) {
//         console.log(decodedToken, 'this is decoded token in useEffect');
//         const socket = new WebSocket('ws://localhost:8000');
//         socket.emit("setup", decodedToken);
//         socket.on("connection", () => setSocketConnected(true));
//       } else {
//         console.log('no token found');
//       }
//     };

//     setupSocket();
//   }, [userToken, decodedToken]);

//   const sendHandler = async () => {
//     if (content === "") {
//       toast.error("Message cannot be empty");
//       return;
//     }

//     try {
//       let res = await instance.post(`api/chat/sendchat/${chatId}/User`, {
//         content,
//       });
//       if (res) {
//         setContent("");
//         setMessageSent(true);
//         socket.emit('new message',res.data)
//       }
//     } catch (error) {
//       console.log(error.message);
//     }
//   };

//   useEffect(() => {
//     let fetchMessages = async () => {
//       let res = await instance.get(`api/chat/get-room-messages/${chatId}`);
//       if (res) {
//         setChats(res.data);
//         setMessageSent(false);
//         socket.emit('join chat',chatId)
//       }
//     };
//     if (chatId) {
//       fetchMessages();
//     }
//     selectedChatCompare = chats;
//   }, [chatId, messageSent]);


//   useEffect(()=>{
//     socket.on('message received',(newMessageReceived)=>{
//       if(!selectedChatCompare || chatId!==newMessageReceived.room._id){
// //give notification
//       }else{
//         setChats([...chats,newMessageReceived])
//       }
//     })
//   })

//   useEffect(() => {
//     if (chatid !== "allchats") {
//       setChatId(chatid);
//     }
//   }, [chatid]);




//   // console.log("userTokennnn", userToken);
//   // const { decodedToken } = useJwt(userToken);
//   // console.log(decodedToken);

  

//   useEffect(() => {
//     if (userInfo) {
//       let fetchRooms = async () => {
//         let res = await instance.get("/getrooms");
//         setRooms(res.data);
//       };
//       fetchRooms();
//     }
//   }, [userInfo]);

//   return (
//     <div className="container mx-auto">
//       <div className="min-w-full border rounded lg:grid lg:grid-cols-3">
//         <div className="border-r border-gray-300 lg:col-span-1">
//           <div className="mx-3 my-3">
//             <div className="relative text-gray-600">
//               <span className="absolute inset-y-0 left-0 flex items-center pl-2">
//                 <svg
//                   fill="none"
//                   stroke="currentColor"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   viewBox="0 0 24 24"
//                   className="w-6 h-6 text-gray-300"
//                 >
//                   <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
//                 </svg>
//               </span>
//               <input
//                 type="search"
//                 className="block w-full py-2 pl-10 bg-gray-100 rounded outline-none"
//                 name="search"
//                 placeholder="Search"
//                 required
//               />
//             </div>
//           </div>

//           <ul className="overflow-auto h-[32rem]">
//             <h2 className="my-2 mb-2 ml-2 text-lg text-gray-600">Chats</h2>
//             <li>
//               {rooms.length > 0 ? (
//                 rooms.map((chat, index) => (
//                   <a
//                     key={index}
//                     className="flex items-center px-3 py-2 text-sm transition duration-150 ease-in-out border-b border-gray-300 cursor-pointer hover:bg-gray-100 focus:outline-none"
//                     style={{ textDecoration: "none" }}
//                   >
//                     <img
//                       className="object-cover w-10 h-10 rounded-full"
//                       src="https://cdn.pixabay.com/photo/2018/09/12/12/14/man-3672010__340.jpg"
//                       alt="username"
//                     />
//                     <div
//                       className="w-full pb-2"
//                       onClick={() => {
//                         setChatId(chat._id);
//                         setHotel(chat.hotel.name);
//                       }}
//                     >
//                       <div className="flex justify-between">
//                         <span className="block ml-2 font-semibold text-gray-600">
//                           {chat.hotel.name}
//                         </span>
//                         <span className="block ml-2 text-sm text-gray-600">
//                           25 minutes
//                         </span>
//                       </div>
//                       {/* <span className="block ml-2 text-sm text-gray-600">bye</span> */}
//                     </div>
//                   </a>
//                 ))
//               ) : (
//                 <a className="flex items-center px-3 py-2 text-sm transition duration-150 ease-in-out border-b border-gray-300 cursor-pointer hover:bg-gray-100 focus:outline-none">
//                   <div className="w-full pb-2">
//                     <div className="flex justify-between">
//                       <span className="block ml-2 font-semibold text-gray-600 no-underline">
//                         No Chats found
//                       </span>
//                     </div>
//                   </div>
//                 </a>
//               )}
//             </li>
//           </ul>
//         </div>
//         <div className="hidden lg:col-span-2 lg:block sm:block xs:block">
//           {chatId ? (
//             <div className="w-full">
//               <div>
//                 <div className="relative flex items-center p-3 border-b border-gray-300">
//                   <img
//                     className="object-cover w-10 h-10 rounded-full"
//                     src="https://cdn.pixabay.com/photo/2018/01/15/07/51/woman-3083383__340.jpg"
//                     alt="username"
//                   />
//                   <span className="block ml-2 font-bold text-gray-600">
//                     Hotel
//                   </span>
//                   <span className="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3"></span>
//                 </div>

//                 <div className="relative w-full p-6 overflow-y-auto h-[40rem]">
//                   <ul className="space-y-2">
//                     {chats && chats.length > 0 ? (
//                       chats.map((chat, index) =>
//                         chat.senderType === "User" ? (
//                           <li key={index} className="flex justify-start">
//                             <div className="relative max-w-xl px-4 py-2 text-gray-700 rounded shadow">
//                               <span className="block">{chat.content}</span>
//                             </div>
//                           </li>
//                         ) : (
//                           <li key={index} className="flex justify-end">
//                             <div className="relative max-w-xl px-4 py-2 text-gray-700 bg-gray-100 rounded shadow">
//                               <span className="block">{chat.content}</span>
//                             </div>
//                           </li>
//                         )
//                       )
//                     ) : (
//                       <div>
//                         <div className="relative h-20 flex items-center p-3 border-b border-gray-300">
//                           <span className="absolute w-3 h- bg-green-600 rounded-full left-10 top-3"></span>
//                         </div>
//                         <div className="relative w-full p-6 overflow-y-auto h-[40rem]">
//                           <ul className="space-y-2">
//                             <li className="flex justify-center">
//                               <div className="relative max-w-xl px-4 py-2 text-gray-700 rounded shadow">
//                                 <span className="block">No Chats </span>
//                               </div>
//                             </li>
//                           </ul>
//                         </div>
//                       </div>
//                     )}

//                     <div className="flex items-center justify-between w-full p-3 border-t border-gray-300">
//                       <button>
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="w-6 h-6 text-gray-500"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                             d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                           />
//                         </svg>
//                       </button>
//                       <button>
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="w-5 h-5 text-gray-500"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                             d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
//                           />
//                         </svg>
//                       </button>
//                       <input
//                         type="text"
//                         placeholder="Message"
//                         value={content}
//                         onChange={(e) => setContent(e.target.value)}
//                         className="block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700"
//                         name="message"
//                         required
//                       />
//                       <button type="submit" onClick={sendHandler}>
//                         <svg
//                           className="w-5 h-5 text-gray-500 origin-center transform rotate-90"
//                           xmlns="http://www.w3.org/2000/svg"
//                           viewBox="0 0 20 20"
//                           fill="currentColor"
//                         >
//                           <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
//                         </svg>
//                       </button>
//                     </div>
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="flex items-center justify-center h-screen">
//               <div className="bg-gray-200 p-6 rounded-md">
//                 <p className="text-center text-gray-700">No chat found</p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserChat;







































































// import React, { useEffect, useState } from "react";
// import ApiConnector from "../Chat/lib/apiConnector";
// import ApiEndpoints from "../Chat/lib/apiEndpoints";
// import ServerUrl from "../Chat/lib/serverUrl";
// import Constants from "../Chat/lib/Constants";
// import SocketActions from "../Chat/lib/socketActions"
// import CommonUtil from "./Utils/commonUtil";
// import "./ChatPage.css";

// let socket = new WebSocket(
//   ServerUrl.WS_BASE_URL + `ws/users/${CommonUtil.getUserId()}/chat/`
// );
// let typingTimer = 0;
// let isTypingSignalSent = false;

// const UserChat = ({ match, currentChattingMember, setOnlineUserList }) => {
//   const [inputMessage, setInputMessage] = useState("");
//   const [messages, setMessages] = useState({});
//   const [typing, setTyping] = useState(false);

//   const fetchChatMessage = async () => {
//     const currentChatId = CommonUtil.getActiveChatId(match);
//     if (currentChatId) {
//       const url =
//         ApiEndpoints.CHAT_MESSAGE_URL.replace(
//           Constants.CHAT_ID_PLACE_HOLDER,
//           currentChatId
//         ) + "?limit=20&offset=0";
//       const chatMessages = await ApiConnector.sendGetRequest(url);
//       setMessages(chatMessages);
//     }
//   };

//   useEffect(() => {
//     fetchChatMessage();
//   }, [CommonUtil.getActiveChatId(match)]);

//   const loggedInUserId = CommonUtil.getUserId();
//   const getChatMessageClassName = (userId) => {
//     return loggedInUserId === userId
//       ? "chat-message-right pb-3"
//       : "chat-message-left pb-3";
//   };

//   socket.onmessage = (event) => {
//     const data = JSON.parse(event.data);
//     const chatId = CommonUtil.getActiveChatId(match);
//     const userId = CommonUtil.getUserId();
//     if (chatId === data.roomId) {
//       if (data.action === SocketActions.MESSAGE) {
//         data["userImage"] = ServerUrl.BASE_URL.slice(0, -1) + data.userImage;
//         setMessages((prevState) => {
//           let messagesState = JSON.parse(JSON.stringify(prevState));
//           messagesState.results.unshift(data);
//           return messagesState;
//         });
//         setTyping(false);
//       } else if (data.action === SocketActions.TYPING && data.user !== userId) {
//         setTyping(data.typing);
//       }
//     }
//     if (data.action === SocketActions.ONLINE_USER) {
//       setOnlineUserList(data.userList);
//     }
//   };

//   const messageSubmitHandler = (event) => {
//     event.preventDefault();
//     if (inputMessage) {
//       socket.send(
//         JSON.stringify({
//           action: SocketActions.MESSAGE,
//           message: inputMessage,
//           user: CommonUtil.getUserId(),
//           roomId: CommonUtil.getActiveChatId(match),
//         })
//       );
//     }
//     setInputMessage("");
//   };

//   const sendTypingSignal = (typing) => {
//     socket.send(
//       JSON.stringify({
//         action: SocketActions.TYPING,
//         typing: typing,
//         user: CommonUtil.getUserId(),
//         roomId: CommonUtil.getActiveChatId(match),
//       })
//     );
//   };

//   const chatMessageTypingHandler = (event) => {
//     if (event.keyCode !== Constants.ENTER_KEY_CODE) {
//       if (!isTypingSignalSent) {
//         sendTypingSignal(true);
//         isTypingSignalSent = true;
//       }
//       clearTimeout(typingTimer);
//       typingTimer = setTimeout(() => {
//         sendTypingSignal(false);
//         isTypingSignalSent = false;
//       }, 3000);
//     } else {
//       clearTimeout(typingTimer);
//       isTypingSignalSent = false;
//     }
//   };

//   return (
//     <div className="col-12 col-sm-8 col-md-8 col-lg-8 col-xl-10 pl-0 pr-0">
//       <div className="py-2 px-4 border-bottom d-none d-lg-block">
//         <div className="d-flex align-items-center py-1">
//           <div className="position-relative">
//             <img
//               src={currentChattingMember?.image}
//               className="rounded-circle mr-1"
//               alt="User"
//               width="40"
//               height="40"
//             />
//           </div>
//           <div className="flex-grow-1 pl-3">
//             <strong>{currentChattingMember?.name}</strong>
//           </div>
//         </div>
//       </div>
//       <div className="position-relative">
//         <div
//           id="chat-message-container"
//           className="chat-messages pl-4 pt-4 pr-4 pb-1 d-flex flex-column-reverse"
//         >
//           {typing && (
//             <div className="chat-message-left chat-bubble mb-1">
//               <div className="typing">
//                 <div className="dot"></div>
//                 <div className="dot"></div>
//                 <div className="dot"></div>
//               </div>
//             </div>
//           )}
//           {messages?.results?.map((message, index) => (
//             <div key={index} className={getChatMessageClassName(message.user)}>
//               <div>
//                 <img
//                   src={message.userImage}
//                   className="rounded-circle mr-1"
//                   alt={message.userName}
//                   width="40"
//                   height="40"
//                 />
//                 <div className="text-muted small text-nowrap mt-2">
//                   {CommonUtil.getTimeFromDate(message.timestamp)}
//                 </div>
//               </div>
//               <div className="flex-shrink-1 bg-light ml-1 rounded py-2 px-3 mr-3">
//                 <div className="font-weight-bold mb-1">{message.userName}</div>
//                 {message.message}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className="flex-grow-0 py-3 px-4 border-top">
//         <form onSubmit={messageSubmitHandler}>
//           <div className="input-group">
//             <input
//               onChange={(event) => setInputMessage(event.target.value)}
//               onKeyUp={chatMessageTypingHandler}
//               value={inputMessage}
//               id="chat-message-input"
//               type="text"
//               className="form-control"
//               placeholder="Type your message"
//               autoComplete="off"
//             />
//             <button
//               id="chat-message-submit"
//               className="btn btn-outline-warning"
//             >
//               Send
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UserChat;
































// import React, { useState, useEffect } from 'react';
// import { w3cwebsocket as W3CWebSocket } from 'websocket';
// import Button from '@material-ui/core/Button';
// import CssBaseline from '@material-ui/core/CssBaseline';
// import TextField from '@material-ui/core/TextField';
// import Container from '@material-ui/core/Container';
// import Card from '@material-ui/core/Card';
// import CardHeader from '@material-ui/core/CardHeader';
// import Paper from '@material-ui/core/Paper';
// import { makeStyles } from '@material-ui/core/styles';

// const useStyles = makeStyles((theme) => ({
//   submit: {
//     margin: theme.spacing(3, 0, 2),
//   },
//   root: {
//     marginBottom: theme.spacing(1),
//   },
//   paper: {
//     marginTop: theme.spacing(8),
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//   },
//   form: {
//     width: '100%',
//     marginTop: theme.spacing(1),
//   },
// }));

// const UserChat = () => {
//   const classes = useStyles();
//   const [filledForm, setFilledForm] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [value, setValue] = useState('');
//   const [name, setName] = useState('');
//   const [room, setRoom] = useState('test');

//   const client = new W3CWebSocket('ws://127.0.0.1:8000/ws/chat/');

//   const onButtonClicked = (e) => {
//     client.send(
//       JSON.stringify({
//         type: 'message',
//         text: value,
//         sender: name,
//       })
//     );
//     setValue('');
//     e.preventDefault();
//   };

//   useEffect(() => {
//     client.onopen = () => {
//       console.log('WebSocket Client Connected');
//     };

//     client.onmessage = (message) => {
//       const dataFromServer = JSON.parse(message.data);
//       if (dataFromServer) {
//         setMessages((prevMessages) => [
//           ...prevMessages,
//           {
//             msg: dataFromServer.text,
//             name: dataFromServer.sender,
//           },
//         ]);
//       }
//     };
//   }, [client]);

//   return (
//     <Container component="main" maxWidth="xs">
//       {filledForm ? (
//         <div style={{ marginTop: 50 }}>
//           Room Name: {room}
//           <Paper style={{ height: 500, maxHeight: 500, overflow: 'auto', boxShadow: 'none' }}>
//             {messages.map((message, index) => (
//               <Card key={index} className={classes.root}>
//                 <CardHeader title={message.name} subheader={message.msg} />
//               </Card>
//             ))}
//           </Paper>
//           <form className={classes.form} noValidate onSubmit={onButtonClicked}>
//             <TextField
//               id="outlined-helperText"
//               label="Write text"
//               defaultValue="Default Value"
//               variant="outlined"
//               value={value}
//               fullWidth
//               onChange={(e) => {
//                 setValue(e.target.value);
//               }}
//             />
//             <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
//               Send Message
//             </Button>
//           </form>
//         </div>
//       ) : (
//         <div>
//           <CssBaseline />
//           <div className={classes.paper}>
//             <form
//               className={classes.form}
//               noValidate
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 setFilledForm(true);
//               }}
//             >
//               <TextField
//                 variant="outlined"
//                 margin="normal"
//                 required
//                 fullWidth
//                 label="Room name"
//                 name="Room name"
//                 autoFocus
//                 value={room}
//                 onChange={(e) => {
//                   setRoom(e.target.value);
//                 }}
//               />
//               <TextField
//                 variant="outlined"
//                 margin="normal"
//                 required
//                 fullWidth
//                 name="sender"
//                 label="sender"
//                 type="sender"
//                 id="sender"
//                 value={name}
//                 onChange={(e) => {
//                   setName(e.target.value);
//                 }}
//               />
//               <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
//                 Submit
//               </Button>
//             </form>
//           </div>
//         </div>
//       )}
//     </Container>
//   );
// };

// export default UserChat;


























// import React, { useState, useEffect } from 'react';
// import { makeStyles } from '@material-ui/core/styles';
// import Paper from '@material-ui/core/Paper';
// import TextField from '@material-ui/core/TextField';
// import Button from '@material-ui/core/Button';
// import instance from '../../../utils/Axios';

// const useStyles = makeStyles((theme) => ({
//     root: {
//         display: 'flex',
//         flexDirection: 'column',
//         padding: theme.spacing(3),
//         margin: theme.spacing(2),
//     },
//     messageContainer: {
//         display: 'flex',
//         flexDirection: 'column',
//         marginTop: theme.spacing(2),
//     },
//     message: {
//         padding: theme.spacing(1),
//         marginBottom: theme.spacing(1),
//     },
//     inputContainer: {
//         display: 'flex',
//         alignItems: 'center',
//         marginTop: theme.spacing(2),
//     },
//     textField: {
//         flexGrow: 1,
//         marginRight: theme.spacing(2),
//     },
// }));

// const UserChat = () => {
//     const classes = useStyles();
//     const [message, setMessage] = useState('');
//     const [messages, setMessages] = useState([]);

//     useEffect(() => {
//         // Fetch user messages from the backend
//         const fetchMessages = async () => {
//             try {
//                 const response = await instance.get('/api/chat/messages');
//                 setMessages(response.data);
//             } catch (error) {
//                 console.error('Error fetching messages:', error);
//             }
//         };
//         fetchMessages();
//     }, []);

//     const sendMessage = async () => {
//         // Send user message to the backend
//         try {
//             await instance.post('/api/chat/messages', { message });
//             // Fetch updated messages after sending a message
//             const response = await instance.get('/api/chat/messages');
//             setMessages(response.data);
//             setMessage(''); // Clear input after sending message
//         } catch (error) {
//             console.error('Error sending message:', error);
//         }
//     };

//     return (
//         <Paper className={classes.root}>
//             <div className={classes.messageContainer}>
//                 {/* Display messages */}
//                 {messages.map((msg, index) => (
//                     <div key={index} className={classes.message}>
//                         {msg.text}
//                     </div>
//                 ))}
//             </div>
//             <div className={classes.inputContainer}>
//                 {/* Input field for sending messages */}
//                 <TextField
//                     className={classes.textField}
//                     variant="outlined"
//                     label="Type a message"
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                 />
//                 <Button variant="contained" color="primary" onClick={sendMessage}>
//                     Send
//                 </Button>
//             </div>
//         </Paper>
//     );
// };

// export default UserChat;






















// // UserChat.js
// import React, { useEffect, useState } from 'react';
// import API from './API'; // Import API functions for backend interaction

// const UserChat = () => {
//     const [messages, setMessages] = useState([]);

//     useEffect(() => {
//         // Fetch messages for the user from the backend
//         const fetchMessages = async () => {
//             try {
//                 const response = await API.get('/messages/');
//                 setMessages(response.data);
//             } catch (error) {
//                 console.error('Error fetching messages:', error);
//             }
//         };
//         fetchMessages();
//     }, []);

//     // Implement UI for sending and displaying messages

//     const sendMessage = async () => {
//         // Send message to the admin
//         try {
//             await API.post('/messages/', {
//                 message: 'Your message content here',
//             });
//             // Fetch updated messages after sending a new one
//             const response = await API.get('/messages/');
//             setMessages(response.data);
//         } catch (error) {
//             console.error('Error sending message:', error);
//         }
//     };

//     return (
//         // Render UI for User Chat Component including message display and input
//         // Implement a UI for sending messages, using the sendMessage function
//     );
// };

// export default UserChat;









































// import React, { useEffect, useState, useRef } from "react";
// import  {useSelector} from "react-redux";

// import CreateChatRoomApi from "../../../api/createChatRoomApi";
// import GetChatMessages from "../../../api/getChatMessages";
// import MessageSeenApi from "../../../api/messageSeenApi"
// import ChatLayout from "../../user/Chat/ChatLayout";
// import { baseUrl } from "../../../utils/constants";
// import { Navigate } from "react-router-dom";
// import { AiOutlineSend } from "react-icons/ai";
// import jwtDecode from 'jwt-decode';

// const UserChat = () => {
//   const [profiles, setProfiles] = useState([]);
//   const [ws, setWs] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [trigger, setTrigger] = useState(false);
//   const [inputMessage, setInputMessage] = useState("");
//   const [selectedProfile, setSelectedProfile] = useState(null);
//   const  user = useSelector((state) => state.auth.userInfo);
//   const [decodedUserInfo, setDecodedUserInfo] = useState({});
//   const userId = decodedUserInfo.user_id;
//   console.log(userId,"useriddddd");
//   const isAuthenticated = true;
//   const chatMessagesContainerRef = useRef(null);
//   const [hasJoinedChatroom, setHasJoinedChatroom] = useState(false);
  

  

//   useEffect(() => {
//     if (user) {
//       // Decode the token and set the user info state
//       const decodedInfo = jwtDecode(user.access); // Assuming 'access' contains user details
//       setDecodedUserInfo(decodedInfo);
//     }},[userId]);
  
//   // useEffect(() => {
//   //   const fetchData = async () => {
//   //     try {
//   //       const result = await ContactListAPI();
//   //       setProfiles(result);
//   //     } catch (error) {
//   //       console.error(error);
//   //     }
//   //   };
//   //   if (user) {
//   //     fetchData();
//   //   }
//   // }, [user, trigger]);

//   useEffect(() => {
//     let messageListener;
//     if (ws) {
//       messageListener = (event) => {
//         const message = JSON.parse(event.data);
//         setMessages((prevMessages) => [...prevMessages, message]);
//         setTrigger(true);
//         // Scroll to the last message
//         chatMessagesContainerRef.current.scrollTop =
//         chatMessagesContainerRef.current.scrollHeight;
//       };
//       ws.addEventListener("message", messageListener);
//     }
//     return () => {
//       if (ws) {
//         ws.removeEventListener("message", messageListener);
//       }
//     };
//   }, [ws, trigger]);

//   const handleSendMessage = () => {
//     try {
//       if (ws && inputMessage.trim() !== "") {
//         ws.send(JSON.stringify({ message: inputMessage }));
//         setInputMessage("");
//         setTrigger(false);
//       }
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };
  
//   const joinChatroom = async (userId) => {
//     try {
//       const data = await CreateChatRoomApi(userId);
//       const accessToken = localStorage.getItem("access_token");
//       const websocketProtocol =
//         window.location.protocol === "https:" ? "wss://" : "ws://";
//       const wsUrl = `${websocketProtocol}127.0.0.1:8000/ws/chat/${data.id}/?token=${accessToken}`;
//       // const wsUrl = `${websocketProtocol}theghostkart.shop:8001/ws/chat/${data.id}/?token=${accessToken}`;
      

//       const newChatWs = new WebSocket(wsUrl);
//       setTrigger(false);

//       newChatWs.onopen = async () => {
//         console.log("Chatroom WebSocket connection opened");
//         const previousMessages = await GetChatMessages(data.id);
//         setMessages(previousMessages);
//         await MessageSeenApi(userId);
//         setProfiles((prevProfiles) => {
//           return prevProfiles.map((profile) => {
//             if (profile.id === data.id) {
//               return { ...profile, unseen_message_count: 0 };
//             }
//             return profile;
//           });
//         });
//         // Scroll to the last message
//         chatMessagesContainerRef.current.scrollTop =
//           chatMessagesContainerRef.current.scrollHeight;
//       };

//       newChatWs.onclose = () => {
//         console.log("Chatroom WebSocket connection closed");
//       };

//       newChatWs.onmessage = (event) => {
//         const message = JSON.parse(event.data);
//         console.log(message);
//       };

//       setWs(newChatWs);
//        setHasJoinedChatroom(true); 
//     } catch (error) {
//       console.error(error);
//     }
//     setSelectedProfile(userId);
//   };

//   if (!isAuthenticated  && user === null) {
//     return <Navigate to="/" />;
//   }

//   console.log(messages,"messagessss");

//   return (
//     <ChatLayout title="Postbox | Chats" content="Messages">
//       <div className="flex h-screen bg-gray-100 pt-16">
//         <div className="w-3/5 p-4">
//           {/* Chat Messages Container */}
//           <div
//             className="bg-white p-4 rounded-lg shadow-xl h-5/6 overflow-y-auto"
//             ref={chatMessagesContainerRef}
//           >
//             {messages.map((message, index) => (
//               <div
//                 key={index}
//                 className={`flex mt-4 ${
//                   message.sender_email === user.email
//                     ? "justify-end"
//                     : "justify-start"
//                 }`}
//               >
//                 <div className="flex items-center space-x-3">
//                   {message.sender_email !== user.email && (
//                     <div className="h-10 w-10 rounded-full bg-gray-300">
//                       <img
//                         src={`${baseUrl}${message.sender_profile_pic}`}
//                         alt="Profile"
//                         className="w-full h-full rounded-full object-cover"
//                       />
//                     </div>
//                   )}
//                   <div className="max-w-xs p-3 rounded-lg shadow-xl bg-blue-200">
//                     <p className="text-sm">{message.message || message.content}</p>
//                     <span className="text-xs text-gray-500 leading-none">
//                       {message.created} ago
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//           {/* Input Field for Sending Messages */}
          
//             <div className="bg-gray-200 p-4 rounded-lg">
//               <div className="relative flex items-center w-full">
//                 <input
//                   type="text"
//                   value={inputMessage}
//                   onChange={(e) => setInputMessage(e.target.value)}
//                   className="flex-auto p-2 rounded-full border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   placeholder="Type your message..."
//                 />
//                 <button
//                   className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-500 text-white shadow-md transition duration-150 ease-in-out hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   type="button"
//                   onClick={handleSendMessage}
//                 >
//                   <AiOutlineSend />
//                 </button>
//               </div>
//             </div>
        
//         </div>
//         <div className="w-2/5 p-4">
//           {/* List of Chat Profiles */}
//           <div className="bg-white p-4 rounded-lg shadow-xl">
//             {profiles
//               ? profiles.map((profile) => (
//                   <div
//                     key={profile.id}
//                     onClick={() => {
//                       joinChatroom(profile.id);
//                       setTrigger(true);
//                     }}
//                     className={`flex items-center p-3 cursor-pointer ${
//                       selectedProfile === profile.id ? "bg-purple-100" : "bg-gray-100"
//                     } rounded-lg mb-4 shadow-md`}
//                   >
//                     <div className="h-14 w-14 rounded-full bg-gray-300">
//                       <img
//                         src={`${baseUrl}${profile.profile_pic}`}
//                         alt="Profile"
//                         className="w-full h-full rounded-full object-cover"
//                       />
//                     </div>
//                 <div className="flex-grow ml-3">
//                       <h5 className="text-sm font-medium leading-tight text-gray-800">
//                         {profile.email}
//                       </h5>
//                     </div>
//                   {profile.unseen_message_count > 0 && (
//                         <div className="bg-red-500 text-white px-2 py-1 rounded-full">
//                           {profile.unseen_message_count}
//                         </div> 
//                       )}
//                   </div> 
//                 ))
//               : null}
//           </div>
//         </div>
//       </div>
//     </ChatLayout>
//   );
// };

// export default UserChat;




























// import React, { useState, useEffect } from 'react';
// import { makeStyles } from '@material-ui/core/styles';
// import Paper from '@material-ui/core/Paper';
// import TextField from '@material-ui/core/TextField';
// import Button from '@material-ui/core/Button';
// import instance from '../../../utils/Axios';

// const useStyles = makeStyles((theme) => ({
//   root: {
//     display: 'flex',
//     flexDirection: 'column',
//     padding: theme.spacing(3),
//     margin: theme.spacing(2),
//   },
//   messageContainer: {
//     display: 'flex',
//     flexDirection: 'column',
//     marginTop: theme.spacing(2),
//   },
//   message: {
//     padding: theme.spacing(1),
//     marginBottom: theme.spacing(1),
//   },
//   inputContainer: {
//     display: 'flex',
//     alignItems: 'center',
//     marginTop: theme.spacing(2),
//   },
//   textField: {
//     flexGrow: 1,
//     marginRight: theme.spacing(2),
//   },
// }));

// const UserChat = ({ user, receiverId }) => {
//   const classes = useStyles();
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     // Fetch messages from backend API
//     fetchMessages();
//   }, []);

//   const fetchMessages = async () => {
//     try {
//       const response = await instance.get(`/api/chat/messages/${receiverId}/`);
//       setMessages(response.data);
//     } catch (error) {
//       console.error('Error fetching messages:', error);
//     }
//   };

//   const sendMessage = async () => {
//     try {
//       await instance.post(`/api/chat/messages/`, {
//         sender: user.id,
//         receiver: receiverId,
//         message: message,
//       });
//       setMessage('');
//       fetchMessages(); // Refresh messages after sending a new one
//     } catch (error) {
//       console.error('Error sending message:', error);
//     }
//   };
//   if (!receiverId) {
//     return <div>No receiver selected.</div>;
//   }
//  return (
//     <Paper className={classes.root}>
//       <div className={classes.messageContainer}>
//         {messages.map((msg, index) => (
//           <div key={index} className={classes.message}>
//             {msg.message}
//           </div>
//         ))}
//       </div>
//       <div className={classes.inputContainer}>
//         <TextField
//           className={classes.textField}
//           variant="outlined"
//           label="Type a message"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//         />
//         <Button variant="contained" color="primary" onClick={sendMessage}>
//           Send
//         </Button>
//       </div>
//     </Paper>
//   );
// };

// export default UserChat;

























// import React, { useState,useEffect } from 'react';
// import { makeStyles } from '@material-ui/core/styles';
// import instance from '../../../utils/Axios';
// import { baseUrl } from '../../../utils/constants';
// import {
//   Button,
//   Typography,
//   TextField,
//   Grid,
//   Paper,
//   List,
//   ListItem,
//   ListItemText,
// } from '@material-ui/core';

// const useStyles = makeStyles((theme) => ({
//   // Existing styles...
// }));

// const UserChat = () => {
//   const classes = useStyles();
//   const [messages, setMessages] = useState(JSON.parse(localStorage.getItem('chatMessages')) || []
//   );

//   const [inputMessage, setInputMessage] = useState('');
//   useEffect(() => {
//     localStorage.setItem('chatMessages', JSON.stringify(messages));
//   }, [messages]);

//   // Function to handle sending a message
//   const sendMessage = async () => {
//     if (inputMessage.trim() !== '') {
//       try {
//         const response = await instance.post(
//           `${baseUrl}/api/chat/create_message/`,
//           {
//             text: inputMessage, // Sending message text directly in the request body
//           },
//           {
//             headers: {
//               'Content-Type': 'application/json',
//               // Add any necessary headers for authentication or other requirements
//             },
//           }
//         );
  
//         if (response.status === 200) {
//           const newMessage = { text: inputMessage };
//           // Assuming response contains the newly created message data from the server
//           const responseData = response.data;
//           if (responseData && responseData.message) {
//             newMessage.id = responseData.message.id; // Assign an ID received from the server
//           }
//           setMessages([...messages, newMessage]);
//           setInputMessage('');
//         } else {
//           // Handle the error response from the server
//           console.error('Failed to send message:', response.statusText);
//           // Show an error message or perform other error handling
//         }
//       } catch (error) {
//         // Handle network errors or other exceptions
//         console.error('Error sending message:', error);
//         // Show an error message or perform other error handling
//       }
//     }
//   };
  

//   return (
//     <div className={classes.chatContainer}>
//       {/* Existing chat layout... */}
//       <div className={classes.chatRoom}>
//         <div id="chat_log" className={classes.chatLog}>
//           <List>
//             {/* Displaying messages */}
//             {messages.map((message, index) => (
//               <ListItem key={index}>
//                 <ListItemText primary={message.content} />
//               </ListItem>
//             ))}
//           </List>
//         </div>

//         {/* Input for sending messages */}
//         <TextField
//           id="chat_message_input"
//           variant="outlined"
//           fullWidth
//           margin="dense"
//           placeholder="Type your message..."
//           className={classes.chatBox}
//           value={inputMessage}
//           onChange={(e) => setInputMessage(e.target.value)}
//         />
//         <Button
//           id="chat_message_submit"
//           variant="contained"
//           color="primary"
//           onClick={sendMessage}
//         >
//           Send
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default UserChat;






















// import React, { useEffect, useState } from 'react';
// import instance from '../../../utils/Axios';

// const UserChat = () => {
//   const [messages, setMessages] = useState([]);
//   const [chatRooms, setChatRooms] = useState([]);

//   useEffect(() => {
//     fetchMessages();
//     fetchChatRooms();
//   }, []);

//   const fetchMessages = async () => {
//     try {
//       const response = await instance.get('/api/chat/messages/');
//       setMessages(response.data);
//     } catch (error) {
//       console.error('Error fetching messages:', error);
//     }
//   };

//   const fetchChatRooms = async () => {
//     try {
//       const response = await instance.get('/api/chat/chatrooms/');
//       setChatRooms(response.data);
//     } catch (error) {
//       console.error('Error fetching chat rooms:', error);
//     }
//   };

//   const createMessage = async () => {
//     try {
//       await instance.post('/api/chat/create_message/', {
//         // Add necessary message data in the POST request body
//       });
//       // On successful creation, update messages
//       fetchMessages();
//     } catch (error) {
//       console.error('Error creating message:', error);
//     }
//   };

//   const createChatRoom = async () => {
//     try {
//       await instance.post('/api/chat/create_chatroom/', {
//         // Add necessary chat room data in the POST request body
//       });
//       // On successful creation, update chat rooms
//       fetchChatRooms();
//     } catch (error) {
//       console.error('Error creating chat room:', error);
//     }
//   };

//   return (
//     <div>
//       <h2>Messages</h2>
//       <ul>
//         {messages.map((message) => (
//           <li key={message.id}>{message.body}</li>
//         ))}
//       </ul>
//       <button onClick={createMessage}>Send Message</button>

//       <h2>Chat Rooms</h2>
//       <ul>
//         {chatRooms.map((room) => (
//           <li key={room.id}>{room.client} - {room.uuid}</li>
//         ))}
//       </ul>
//       <button onClick={createChatRoom}>Create Chat Room</button>
//     </div>
//   );
// };

// export default UserChat;




























// import React, { useState, useEffect } from "react";
// import { w3cwebsocket as W3CWebSocket } from "websocket";
// import { Container, Typography, TextField, Button } from "@mui/material";
// function UserChat() {
//   const [socket, setSocket] = useState(null);
//   const [username, setUsername] = useState("");
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     // Get the username from local storage or prompt the user to enter it
//     const storedUsername = localStorage.getItem("username");
//     if (storedUsername) {
//       setUsername(storedUsername);
//     } else {
//       const input = prompt("Enter your username:");
//       if (input) {
//         setUsername(input);
//         localStorage.setItem("username", input);
//       }
//     }

//     // Connect to the WebSocket server with the username as a query parameter
//     const newSocket = new WebSocket(`ws://localhost:8000/ws/chat/`);
//     setSocket(newSocket);

//     newSocket.onopen = () => console.log("WebSocket connected");
//     newSocket.onclose = () => console.log("WebSocket disconnected");

//     // Clean up the WebSocket connection when the component unmounts
//     return () => {
//       newSocket.close();
//     };
//   }, [username]);

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
//     if (message && socket) {
//       const data = {
//         message: message,
//         username: username,
//       };
//       socket.send(JSON.stringify(data));
//       setMessage("");
//     }
//   };

//   return (
//     <Container maxWidth="md">
//     <Typography variant="h4" gutterBottom>
//       Chat
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
// export default UserChat;


































// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import instance from "../../../utils/Axios";
// import { toast } from "react-toastify";
// import { useParams } from "react-router-dom";
// import io from "socket.io-client";
// // import jwt from 'jsonwebtoken';
// import { useJwt } from "react-jwt";
// import { baseUrl } from "../../../utils/constants";

// // import * as jwt_decode from "jwt-decode";
// const roomID = 123; // Replace this with the actual ID of the chat room

// const ENDPOINT = `ws://127.0.0.1:8000/ws/chat/${roomID}/`;

// const socket = io(ENDPOINT);

// // Event listener when the connection is established
// socket.onopen = (event) => {
//   console.log('WebSocket connection established:', event);
// };

// // Event listener for incoming messages
// socket.onmessage = (event) => {
//   console.log('Received message:', event.data);
//   // Handle incoming messages here
// };

// // Event listener when an error occurs
// socket.onerror = (error) => {
//   console.error('WebSocket error:', error);
// };

// // Event listener when the connection is closed
// socket.onclose = (event) => {
//   console.log('WebSocket connection closed:', event);
// };

// // Sending a message through the WebSocket
// function sendMessage(message) {
//   socket.send(JSON.stringify({ type: 'message', content: message }));
// }

// const UserChat = () => {
//   const  userInfo  = useSelector((state) => state.auth);
//   console.log(userInfo,"userinfooooo");
//   const [chatRooms, setChatRooms] = useState([]);
//   const [chatId, setChatId] = useState("");
//   const [chats, setChats] = useState([]);
//   const [content, setContent] = useState("");
//   const [messageSent, setMessageSent] = useState(false);
//   const [socketConnected, setSocketConnected] = useState(false);
//   const [selectedChatCompare, setSelectedChatCompare] = useState(null);

 

//   const { chatid } = useParams();
//   const userToken = userInfo.userInfo.access;
//   console.log(userToken,'userToken');
//   const { decodedToken } = useJwt(userToken);
//   console.log(decodedToken,'decodedToken');


//   // useEffect(() => {
//   //   const setupSocket = () => {
//   //     if(userToken) {
//   //       console.log(decodedToken, 'this is decoded token in useEffect');
//   //       socket = io(ENDPOINT);
//   //       socket.emit("setup", decodedToken);
//   //       socket.on("connection", () => setSocketConnected(true));
//   //     } else {
//   //       console.log('no token found');
//   //     }
//   //   };

//   //   setupSocket();
//   // }, [userToken, decodedToken]);

//   const sendHandler = async () => {
//     if (content === "") {
//       toast.error("Message cannot be empty");
//       return;
//     }

//     try {
//       let res = await instance.post(`${baseUrl}/api/chat/sendchat/${chatId}/User`, {
//         content,
//       });
//       if (res) {
//         setContent("");
//         setMessageSent(true);
//         socket.emit('new message',res.data)
//       }
//     } catch (error) {
//       console.log(error.message);
//     }
//   };

//   useEffect(() => {
//     let fetchMessages = async () => {
//       let res = await instance.get(`${baseUrl}/api/chat/get-room-messages/${chatId}`);
//       if (res) {
//         setChats(res.data);
//         setMessageSent(false);
//         socket.emit('join chat',chatId)
//       }
//     };
//     if (chatId) {
//       fetchMessages();
//     }
//     selectedChatCompare = chats;
//   }, [chatId, messageSent]);



//     useEffect(() => {
//       if (socket) {
//         socket.on('message received', (newMessageReceived) => {
//           if (!selectedChatCompare || chatId !== newMessageReceived.room._id) {
//             // Give notification
//           } else {
//             setChats((prevChats)=>[...prevChats, newMessageReceived]);
//           }
//         });
//       }
//       return () => {
//         if (socket) {
//           socket.off('message received');
//         }
//       };
//     }, [socket, selectedChatCompare, chatId,setChats]);
    

//   useEffect(() => {
//     if (chatid !== "allchats") {
//       setChatId(chatid);
//     }
//   }, [chatid]);




//   // console.log("userTokennnn", userToken);
//   // const { decodedToken } = useJwt(userToken);
//   // console.log(decodedToken);

  

//   useEffect(() => {
//     if (userInfo) {
//       let fetchRooms = async () => {
//         let res = await instance.get(`${baseUrl}/api/chat/get-rooms/`);
//         setChatRooms(res.data);
//       };
//       fetchRooms();
//     }
//   }, [userInfo]);

//   return (
//     <div className="container mx-auto">
//       <div className="min-w-full border rounded lg:grid lg:grid-cols-3">
//         <div className="border-r border-gray-300 lg:col-span-1">
//           <div className="mx-3 my-3">
//             <div className="relative text-gray-600">
//               <span className="absolute inset-y-0 left-0 flex items-center pl-2">
//                 <svg
//                   fill="none"
//                   stroke="currentColor"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   viewBox="0 0 24 24"
//                   className="w-6 h-6 text-gray-300"
//                 >
//                   <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
//                 </svg>
//               </span>
//               <input
//                 type="search"
//                 className="block w-full py-2 pl-10 bg-gray-100 rounded outline-none"
//                 name="search"
//                 placeholder="Search"
//                 required
//               />
//             </div>
//           </div>

//           <ul className="overflow-auto h-[32rem]">
//             <h2 className="my-2 mb-2 ml-2 text-lg text-gray-600">Chats</h2>
//             <li>
//               {chatRooms.length > 0 ? (
//                 chatRooms.map((chat, index) => (
//                   <a
//                     key={index}
//                     className="flex items-center px-3 py-2 text-sm transition duration-150 ease-in-out border-b border-gray-300 cursor-pointer hover:bg-gray-100 focus:outline-none"
//                     style={{ textDecoration: "none" }}
//                   >
//                     <img
//                       className="object-cover w-10 h-10 rounded-full"
//                       src="https://cdn.pixabay.com/photo/2018/09/12/12/14/man-3672010__340.jpg"
//                       alt="username"
//                     />
//                     <div
//                       className="w-full pb-2"
//                       onClick={() => {
//                         setChatId(chat._id);

//                       }}
//                     >
//                       <div className="flex justify-between">
//                         <span className="block ml-2 font-semibold text-gray-600">
//                           {chat.hotel.name}
//                         </span>
//                         <span className="block ml-2 text-sm text-gray-600">
//                           25 minutes
//                         </span>
//                       </div>
//                       {/* <span className="block ml-2 text-sm text-gray-600">bye</span> */}
//                     </div>
//                   </a>
//                 ))
//               ) : (
//                 <a className="flex items-center px-3 py-2 text-sm transition duration-150 ease-in-out border-b border-gray-300 cursor-pointer hover:bg-gray-100 focus:outline-none">
//                   <div className="w-full pb-2">
//                     <div className="flex justify-between">
//                       <span className="block ml-2 font-semibold text-gray-600 no-underline">
//                         No Chats found
//                       </span>
//                     </div>
//                   </div>
//                 </a>
//               )}
//             </li>
//           </ul>
//         </div>
//         <div className="hidden lg:col-span-2 lg:block sm:block xs:block">
//           {chatId ? (
//             <div className="w-full">
//               <div>
//                 <div className="relative flex items-center p-3 border-b border-gray-300">
//                   <img
//                     className="object-cover w-10 h-10 rounded-full"
//                     src="https://cdn.pixabay.com/photo/2018/01/15/07/51/woman-3083383__340.jpg"
//                     alt="username"
//                   />
//                   <span className="block ml-2 font-bold text-gray-600">
//                     Hotel
//                   </span>
//                   <span className="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3"></span>
//                 </div>

//                 <div className="relative w-full p-6 overflow-y-auto h-[40rem]">
//                   <ul className="space-y-2">
//                     {chats && chats.length > 0 ? (
//                       chats.map((chat, index) =>
//                         chat.senderType === "User" ? (
//                           <li key={index} className="flex justify-start">
//                             <div className="relative max-w-xl px-4 py-2 text-gray-700 rounded shadow">
//                               <span className="block">{chat.content}</span>
//                             </div>
//                           </li>
//                         ) : (
//                           <li key={index} className="flex justify-end">
//                             <div className="relative max-w-xl px-4 py-2 text-gray-700 bg-gray-100 rounded shadow">
//                               <span className="block">{chat.content}</span>
//                             </div>
//                           </li>
//                         )
//                       )
//                     ) : (
//                       <div>
//                         <div className="relative h-20 flex items-center p-3 border-b border-gray-300">
//                           <span className="absolute w-3 h- bg-green-600 rounded-full left-10 top-3"></span>
//                         </div>
//                         <div className="relative w-full p-6 overflow-y-auto h-[40rem]">
//                           <ul className="space-y-2">
//                             <li className="flex justify-center">
//                               <div className="relative max-w-xl px-4 py-2 text-gray-700 rounded shadow">
//                                 <span className="block">No Chats </span>
//                               </div>
//                             </li>
//                           </ul>
//                         </div>
//                       </div>
//                     )}

//                     <div className="flex items-center justify-between w-full p-3 border-t border-gray-300">
//                       <button>
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="w-6 h-6 text-gray-500"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                             d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                           />
//                         </svg>
//                       </button>
//                       <button>
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="w-5 h-5 text-gray-500"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                             d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
//                           />
//                         </svg>
//                       </button>
//                       <input
//                         type="text"
//                         placeholder="Message"
//                         value={content}
//                         onChange={(e) => setContent(e.target.value)}
//                         className="block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700"
//                         name="message"
//                         required
//                       />
//                       <button type="submit" onClick={sendHandler}>
//                         <svg
//                           className="w-5 h-5 text-gray-500 origin-center transform rotate-90"
//                           xmlns="http://www.w3.org/2000/svg"
//                           viewBox="0 0 20 20"
//                           fill="currentColor"
//                         >
//                           <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.47wQbNPTDJp9hMYdvogK2hAUiHsGeiybwaWe36bwtRQ3UTpYV7YuZ8FV5j9nauFCWwcjM6dTzpL5s2N79Rp5unwdMvc8ZKU7-14z" />
//                         </svg>
//                       </button>
//                     </div>
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="flex items-center justify-center h-screen">
//               <div className="bg-gray-200 p-6 rounded-md">
//                 <p className="text-center text-gray-700">No chat found</p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserChat;






















// import React, { useEffect, useRef, useState } from 'react'
// import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';

// import { baseUrl } from '../../../utils/constants';


// import getChatMessages from "../../../api/getChatMessages"
// import messageSeen from "../../../api/messageSeen"
// import createChatRoom from '../../../api/createChatRoom';

// const UserChat = () => {

//     const { user, isAuthenticated } = useSelector(state => state.auth);
//     const [profiles, setProfiles] = useState([]);
//     const [ws, setWs] = useState(null);
//     const [messages, setMessages] = useState([]);
//     const [inputMessage, setInputMessage] = useState("");
//     const [bg, setBg] = useState(true);
//     // const [dpChat, setDpChat] = useState(null);
//     const navigate = useNavigate();

    

//     useEffect(() => {
//       if (ws) {
//         ws.onmessage = (event) => {
//             const message = JSON.parse(event.data);
//             setMessages((prevMessages) => [...prevMessages, message]);
//           };
//         }
//       }, [ws]);
      
//     const ref = useChatScroll(messages)

//     function useChatScroll(dep) {
//       const ref = useRef();
//       useEffect(() => {
//         if (ref.current) {
//           ref.current.scrollTop = ref.current.scrollHeight;
//         }
//       }, [dep]);
//       return ref;
//     }

//     const handleSendMessage = () => {
//         if (ws && inputMessage.trim() !== "") {
//           ws.send(JSON.stringify({ message: inputMessage }));
//           setInputMessage("");
//         }
//       };

//       const joinChatroom = async (chatroomId, userId) => {
//         try {
//           setBg(true);
//           // setDpChat(dp_image);
//           // await createChatRoomApi(userId);

//           const accessToken = localStorage.getItem("access_token");
//           const websocketProtocol =  window.location.protocol === "https:" ? "wss://" : "ws://";
//         //   const wsUrl = `${websocketProtocol}${window.location.host}/ws/chat/${chatroomId}/?token=${accessToken}`;
//           const wsUrl = `${websocketProtocol}127.0.0.1:8000/ws/chat/${chatroomId}/?token=${accessToken}`;
//           const newChatWs = new WebSocket(wsUrl);

//           newChatWs.onopen = async () => {
//             console.log("Chatroom WebSocket connection opened.");
//             // Fetch previous messages when the WebSocket connection is opened
//             const previousMessages = await getChatMessages(chatroomId);
//             setMessages(previousMessages);
//             await messageSeen(userId);
//             setProfiles((prevProfiles) => {
//                 return prevProfiles.map((profile) => {
//                   if (profile.id === chatroomId) {
//                     // Set unseen_message_count to zero
//                     return { ...profile, unseen_message_count: 0 };
//                   }
//                   return profile;
//                 });
//               });
//             };
//             newChatWs.onclose = () => {
//                 console.log("Chatroom WebSocket connection closed.");
//                 // You can perform any necessary cleanup here when the WebSocket connection is closed.
//               };
//             newChatWs.onmessage = (event) => {
//                 const message = JSON.parse(event.data);
//                 console.log(message);
//                 // Handle incoming messages from the chatroom WebSocket
//               };

//             setWs(newChatWs);
//     } catch (error) {
//       console.error(error);
//     }
//   };


//     // if (!isAuthenticated) {
//     //     navigate('/');
//     // };

//   return (
  
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
//                       src={`${baseUrl}`}
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

// export default UserChat;

























































// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import {
//   Avatar,
//   Button,
//   Grid,
//   TextField,
//   Typography,
//   makeStyles,
//   Paper,
// } from "@material-ui/core";
// import { useNavigate } from "react-router-dom";

// import contactList from "../../../api/contactList";
// import getChatMessages from "../../../api/getChatMessages";
// import messageSeen from "../../../api/messageSeen";
// import createChatRoom from "../../../api/createChatRoom";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     flexGrow: 1,
//     height: "100vh",
//     padding: theme.spacing(2),
//   },
//   chatContainer: {
//     height: "calc(100vh - 64px)",
//     overflow: "hidden",
//   },
//   chatBox: {
//     display: "flex",
//     flexDirection: "column",
//     flexGrow: 1,
//     padding: theme.spacing(2),
//   },
//   chatInput: {
//     display: "flex",
//     alignItems: "center",
//     marginTop: theme.spacing(2),
//   },
//   messageBubble: {
//     padding: theme.spacing(1),
//     borderRadius: theme.spacing(2),
//     marginBottom: theme.spacing(1),
//     maxWidth: "70%",
//     wordWrap: "break-word",
//   },
// }));

// const MessagesPage = () => {
//   const classes = useStyles();
//   const navigate = useNavigate();

//   const { user, isAuthenticated } = useSelector((state) => state.auth.userInfo);

//   const [profiles, setProfiles] = useState([]);
//   const [ws, setWs] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [inputMessage, setInputMessage] = useState("");
//   const [bg, setBg] = useState(false);
//   const [selectedProfile, setSelectedProfile] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const result = await contactList();
//         setProfiles(result);
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     if (user) {
//       fetchData();
//     }
//   }, [user]);

//   // useEffect(() => {
//   //   if (ws) {
//   //     ws.onmessage = (event) => {
//   //       const message = JSON.parse(event.data);
//   //       setMessages((prevMessages) => [...prevMessages, message]);
//   //     };
//   //   }
//   // }, [ws]);

//   useEffect(() => {
//     let messageListener;
//     if (ws) {
//       messageListener = (event) => {
//         const message = JSON.parse(event.data);
//         setMessages((prevMessages) => [...prevMessages, message]);
//       };
//       ws.addEventListener('message', messageListener);
//     }
//     return () => {
//       if (ws) {
//         ws.removeEventListener('message', messageListener);
//       }
//     };
//   }, [ws]);
  

//   const handleSendMessage = () => {
//     if (ws && inputMessage.trim() !== "") {
//       ws.send(JSON.stringify({ message: inputMessage }));
//       setInputMessage("");
//     }
//   };
//   const joinChatroom = async (userId) => {
//     try {
//       const data = await createChatRoom(userId);
//       const accessToken = localStorage.getItem("access_token");
//       const websocketProtocol =
//         window.location.protocol === "https:" ? "wss://" : "ws://";
//       // const wsUrl = `${websocketProtocol}${window.location.host}/ws/chat/${data.id}/?token=${accessToken}`;
//       const wsUrl = `ws://localhost:8000/ws/chat/${data.id}/?token=${accessToken}`
//       const newChatWs = new WebSocket(wsUrl);
//       setBg(true);

//       newChatWs.onopen = async () => {
//         console.log("Chatroom WebSocket connection opened.");
//         // Fetch previous messages when the WebSocket connection is opened
//         const previousMessages = await getChatMessages(data.id);
//         setMessages(previousMessages);
//         await messageSeen(userId);
//         setProfiles((prevProfiles) => {
//           return prevProfiles.map((profile) => {
//             if (profile.id === data.id) {
//               // Set unseen_message_count to zero
//               return { ...profile, unseen_message_count: 0 };
//             }
//             return profile;
//           });
//         });
//       };
//       newChatWs.onclose = () => {
//         console.log("Chatroom WebSocket connection closed.");
//         // You can perform any necessary cleanup here when the WebSocket connection is closed.
//       };
//       newChatWs.onmessage = (event) => {
//         const message = JSON.parse(event.data);
//         console.log(message);
//         // Handle incoming messages from the chatroom WebSocket
//       };

//       setWs(newChatWs);
//     } catch (error) {
//       console.error(error);
//     }
//     setSelectedProfile(userId)
//   };

//   if (!isAuthenticated) {
//     navigate("/");
//     return null;
//   }

//   return (
//     <div className={classes.root}>
//     <Grid container spacing={2}>
//       <Grid item xs={8}>
//         <Paper className={classes.chatContainer}>
//           {bg ? (
//             <div className={classes.chatBox}>
//               {messages.map((message, index) => (
//                 <div
//                   key={index}
//                   className={
//                     message.sender_email === user.email
//                       ? `${classes.messageBubble} bg-blue-600 text-white ml-auto`
//                       : classes.messageBubble
//                   }
//                 >
//                   <Typography variant="body1">
//                     {message.message ? message.message : message.content}
//                   </Typography>
//                   <Typography variant="caption" color="textSecondary">
//                     {message.created} ago
//                   </Typography>
//                 </div>
//               ))}
//               <div className={classes.chatInput}>
//                 <TextField
//                   value={inputMessage}
//                   onChange={(e) => setInputMessage(e.target.value)}
//                   variant="outlined"
//                   placeholder="Type a message"
//                   fullWidth
//                 />
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   onClick={handleSendMessage}
//                 >
//                   Send
//                 </Button>
//               </div>
//             </div>
//           ) : (
//             <div className={classes.chatBox}>
//               <img src="/next_node.png" alt="" />
//             </div>
//           )}
//         </Paper>
//       </Grid>
//       <Grid item xs={4}>
//         <Paper>
//           <div>
//             {profiles &&
//               profiles.map((profile) => (
//                 <div
//                   key={profile.id}
//                   onClick={() => joinChatroom(profile.id)}
//                   className={`${
//                     selectedProfile === profile.id
//                       ? "bg-[#4b2848]"
//                       : "bg-[#f2dfcf]"
//                   } p-2`}
//                 >
//                   <Avatar
//                     alt="Profile Image"
//                     src={profile.profile_image}
//                     className={classes.avatar}
//                   />
//                   <Typography variant="subtitle1">
//                     {profile.first_name} {profile.last_name}
//                   </Typography>
//                   {profile.unseen_message_count > 0 && (
//                     <div className="bg-red-500 text-white px-2 py-1 rounded-full">
//                       {profile.unseen_message_count}
//                     </div>
//                   )}
//                 </div>
//               ))}
//           </div>
//         </Paper>
//       </Grid>
//     </Grid>
//   </div>
// );
// };


// export default MessagesPage;












// import React, { useState, useEffect } from 'react';
// import { Paper, TextField, Button, Typography, makeStyles } from '@material-ui/core';
// import instance from "../../../utils/Axios"
// import messageSeen from '../../user/Connect/messageSeen';
// import getChatMessages from '../../user/Connect/getChatMessages';
// import contactList from '../../user/Connect/contactList';
// import MessageList from './MessageList';
// import MessageInput from './MessageInput';
// import SendMessageButton from './SendMessageButton';

// const useStyles = makeStyles((theme) => ({
//   root: {
//     maxWidth: 600,
//     margin: 'auto',
//     padding: theme.spacing(2),
//     marginBottom: theme.spacing(2),
//   },
//   message: {
//     marginBottom: theme.spacing(1),
//     padding: theme.spacing(1),
//     border: '1px solid #ccc',
//     borderRadius: '5px',
//   },
//   input: {
//     width: 'calc(100% - 80px)',
//     marginRight: theme.spacing(1),
//   },
//   button: {
//     height: '100%',
//   },
// }));

// const MessagePage = () => {
//   const classes = useStyles();
//   const [messages, setMessages] = useState([]);
//   const [inputMessage, setInputMessage] = useState('');
//   const roomId = 1; // Replace with the actual room ID
//   const [userId, setUserId] = useState(null);

//   useEffect(() => {
//     instance.get(`/api/chat-room/${roomId}/`)
//       .then(response => {
//         setMessages(response.data);
//       })
//       .catch(error => {
//         console.error('Error fetching messages:', error);
//       });
//   }, [roomId]);

//   const sendMessage = () => {
//     instance.post(`/api/create-room/${roomId}/`, { text: inputMessage })
//       .then(response => {
//         // Handle successful message send, if needed
//       })
//       .catch(error => {
//         console.error('Error sending message:', error);
//       });
//   };
  
//   useEffect(() => {
  

    
//     const fetchMessageSeen = async (userId) => {
//       const data = await messageSeen(userId);
     
//     };
//     fetchMessageSeen(userId); // Replace 'userId' with the actual user ID

   
//     const fetchChatMessages = async (roomId) => {
//       const messages = await getChatMessages(roomId);
//       // Handle 'messages' as needed
//     };
//     fetchChatMessages(roomId); // Replace 'roomId' with the actual room ID

//     // Example usage of contactList
//     const fetchContactList = async () => {
//       const contacts = await contactList();
//       // Handle 'contacts' as needed
//     };
//     fetchContactList();
//   }, []); // Run only once when the component mounts



//   return (
//     <div style={{ paddingTop: '80px', paddingBottom: '80px' }}>
//       {/* Adding space from navbar and footer */}
//       <Paper className={classes.root}>
//         {/* Chat components with added space */}
//         <div className={classes.chatContainer}>
//           <MessageList messages={messages} />
//           <MessageInput
//             inputMessage={inputMessage}
//             setInputMessage={setInputMessage}
//           />
//           <SendMessageButton sendMessage={sendMessage} />
//         </div>
//       </Paper>
//     </div>
//   );
// };


// export default MessagePage;



















// import React, { useEffect, useRef, useState } from 'react'
// import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';

// import { baseUrl } from '../../../utils/constants';

// import ChatLayout from '../../../components/Navbar/ChatLayout';
// import contactList from "../../user/Connect/contactList";
// import getChatMessages from "../../user/Connect/getChatMessages";
// import messageSeen from "../../user/Connect/messageSeen";
// // import createChatRoomApi from '../api/createChatRoomApi'

// const MessagePage = () => {

//     const { user, isAuthenticated } = useSelector(state => state.auth.userInfo);
//     const [profiles, setProfiles] = useState([]);
//     const [ws, setWs] = useState(null);
//     const [messages, setMessages] = useState([]);
//     const [inputMessage, setInputMessage] = useState("");
//     const [bg, setBg] = useState(false);
//     const [dpChat, setDpChat] = useState(null);
//     const navigate = useNavigate();

    
//     useEffect(()=>{
//       const fetchData = async () => {
//         try {
//               const result = await contactList();
//               setProfiles(result);
//             } catch (error) {
//               console.error(error);
//             }
//           };
//           if (user) {
//             fetchData();
//           }
//     },[user]);

//     useEffect(() => {
//       if (ws) {
//         ws.onmessage = (event) => {
//             const message = JSON.parse(event.data);
//             setMessages((prevMessages) => [...prevMessages, message]);
//           };
//         }
//       }, [ws]);
      
//     const ref = useChatScroll(messages)

//     function useChatScroll(dep) {
//       const ref = useRef();
//       useEffect(() => {
//         if (ref.current) {
//           ref.current.scrollTop = ref.current.scrollHeight;
//         }
//       }, [dep]);
//       return ref;
//     }

//     const handleSendMessage = () => {
//         if (ws && inputMessage.trim() !== "") {
//           ws.send(JSON.stringify({ message: inputMessage }));
//           setInputMessage("");
//         }
//       };

//       const joinChatroom = async (chatroomId, userId , dp_image) => {
//         try {
//           setBg(true);
//           setDpChat(dp_image);
//           // await createChatRoomApi(userId);

//           const accessToken = localStorage.getItem("access_token");
//           const websocketProtocol =  window.location.protocol === "https:" ? "wss://" : "ws://";
//           // const wsUrl = `${websocketProtocol}${window.location.host}/ws/chat/${chatroomId}/?token=${accessToken}`;
//           const wsUrl = `${websocketProtocol}127.0.0.1:8000/ws/chat/${chatroomId}/?token=${accessToken}`;
//           const newChatWs = new WebSocket(wsUrl);

//           newChatWs.onopen = async () => {
//             console.log("Chatroom WebSocket connection opened.");
//             // Fetch previous messages when the WebSocket connection is opened
//             const previousMessages = await getChatMessages(chatroomId);
//             setMessages(previousMessages);
//             await messageSeen(userId);
//             setProfiles((prevProfiles) => {
//                 return prevProfiles.map((profile) => {
//                   if (profile.id === chatroomId) {
//                     // Set unseen_message_count to zero
//                     return { ...profile, unseen_message_count: 0 };
//                   }
//                   return profile;
//                 });
//               });
//             };
//             newChatWs.onclose = () => {
//                 console.log("Chatroom WebSocket connection closed.");
//                 // You can perform any necessary cleanup here when the WebSocket connection is closed.
//               };
//             newChatWs.onmessage = (event) => {
//                 const message = JSON.parse(event.data);
//                 console.log(message);
//                 // Handle incoming messages from the chatroom WebSocket
//               };

//             setWs(newChatWs);
//     } catch (error) {
//       console.error(error);
//     }
//   };


//     if (!isAuthenticated) {
//         navigate('/');
//     };

//   return (

//     <div>
//       <p>ChatPage</p>
//       </div>
    // <ChatLayout title="Postbox | Chats" content="Messages">
    //     <div className="flex h-screen  p-2">
    //     <div className="flex flex-col flex-grow w-3/5 mt-20 p-1 m-2 bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.27),0_10px_20px_-2px_rgba(0,0,0,0.04)] rounded-lg overflow-hidden">
    //       {bg ? (
    //         <div ref={ref} className="flex flex-col flex-grow h-0 p-4 overflow-auto">
    //           {messages?.map((message, index) =>
    //             message?.sender_email === user.email ? (
    //               <div
    //                 key={index}
    //                 className="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end"
    //               >
    //                 <div>
    //                   <div className="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
    //                     <p className="text-sm">
    //                       {message.message ? message.message : message.text}
    //                     </p>
    //                   </div>
    //                   <span className="text-xs text-gray-500 leading-none">
    //                     {message.created} ago
    //                   </span>
    //                 </div>
    //                 <img
    //                   className="flex-shrink-0 h-10 w-10 rounded-full"
    //                   src={`${baseUrl}${user?.display_pic}`}
    //                   alt="user"
    //                 />
    //               </div>
    //             ) : (
    //               <div key={index} className="flex w-full mt-2 space-x-3 max-w-xs">
    //                 <img
    //                   className="flex-shrink-0 h-10 w-10 rounded-full"
    //                   src={`${baseUrl}`+dpChat}
    //                   alt="user"
    //                 />
    //                 <div>
    //                   <div className="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
    //                     <p className="text-sm">
    //                       {message.message ? message.message : message.text}
    //                     </p>
    //                   </div>
    //                   <span className="text-xs text-gray-500 leading-none">
    //                     {message.created} ago
    //                   </span>
    //                 </div>
    //               </div>
    //             )
    //           )}
    //           <div className="flex-grow"></div>
    //           <div className="bg-[#c2c2c2] p-4 rounded-xl">
    //             <div className="relative flex w-full flex-wrap items-stretch">
    //               <input
    //                 type="text"
    //                 value={inputMessage}
    //                 onChange={(e) => setInputMessage(e.target.value)}
    //                 className="relative m-0 -mr-0.5 block w-[1px] min-w-0 flex-auto rounded-l border border-solid border-[#4b2848] bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
    //                 aria-describedby="button-addon1"
    //               />
    //               <button
    //                 className="relative z-[2] flex items-center rounded-r bg-primary px-6 py-2.5 text-xs font-medium uppercase leading-tight text-[#4b2848] shadow-md transition duration-150 ease-in-out hover:bg-primary-700 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg"
    //                 type="button"
    //                 onClick={handleSendMessage}
    //                 id="button-addon1"
    //                 data-te-ripple-init
    //                 data-te-ripple-color="light"
    //               >
    //                 <span className="material-symbols-outlined">send</span>
    //               </button>
    //             </div>
    //           </div>
    //         </div>
    //       ) : (
    //         <div className="flex flex-col flex-grow p-4 overflow-auto">
    //           <p className="mx-auto my-auto ">Select person to start messaging</p>
    //         </div>
    //       )}
    //     </div>
    //     <div className="w-2/5 mt-20 p-1 m-2 overflow-y-auto bg-white rounded-lg shadow-[0_2px_15px_-3px_rgba(0,0,0,0.27),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
    //       {profiles ? (
    //         profiles.map((profile) => (
    //           <div
    //             key={profile.id}
    //             onClick={() => joinChatroom(profile.id, profile.members[0].id, profile.members[0].display_pic)}
    //             className="relative flex items-center rounded-lg m-1 cursor-pointer bg-gray-300 p-2 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]"
    //           >
    //             {profile.unseen_message_count > 0 && (
    //               <div className="absolute top-0 left-0 bg-red-500 text-white px-2 py-1 rounded-full">
    //                 {profile.unseen_message_count}
    //               </div>
    //             )}

    //             <img
    //               className="w-14 rounded-full h-14  mr-2"
    //               src={baseUrl + profile.members[0].display_pic}
    //               alt="profile"
    //             />
    //             <div className="flex-grow">
    //               <h5 className="mb-1 text-sm font-medium leading-tight text-neutral-800 text-start">
    //                 {profile.members[0].username}
    //               </h5>
    //             </div>
    //           </div>
    //         ))
    //       ) : null}
    //     </div>
    //   </div>
    // </ChatLayout>
//   )
// }

// export default MessagePage








































// import React from 'react'
// import './Message.css'
// import { useState, useEffect } from 'react'
// // import useAxios from '..
// import jwtDecode from 'jwt-decode'
// import { Link} from 'react-router-dom/'
// import moment from 'moment';
// import { baseUrl } from '../../../utils/constants'
// import instance from '../../../utils/Axios'
// import { useDispatch, useSelector } from 'react-redux';
// import { setMessages } from '../../../redux/slices/userslices/authSlice';
// import { useNavigate } from 'react-router-dom'


// function Message() {

//   // Create New State
//   const navigate = useNavigate()
//   const dispatch = useDispatch();
//   const messages = useSelector(state => state.auth.messages);

//   let [newSearch, setnewSearch] = useState({search: "",});

//   // Initialize the useAxios Function to post and get data from protected routes
// //   const axios = useAxios()

//   // Get and Decode Token
//   const token = localStorage.getItem('authTokens');

//   // Decode the token to access user information
//   const decoded = jwtDecode(token);

//   // Access user data from the decoded token
//   const user_id = decoded.user_id;
//   const email = decoded.email;

//   // ... rest of your component code


//   useEffect(() => {
//     try {
//       // Send a get request to the api endpoint to get the message of the logged in user
//       instance.get(`api/user/my-messages/${user_id }`).then((res) => {
//         // Dispatch action to set messages in the Redux store
//         dispatch(setMessages(res.data)); // Assuming res.data contains the messages
//         console.log(res.data);
//       });
      
//     } catch (error) {
//       console.log(error);
//     }
//   }, [dispatch,user_id])
 
//   const handleSearchChange = (event) => {
//     setnewSearch({
//       ...newSearch,
//       [event.target.name]: event.target.value,
//     });

//   };

//   const SearchUser = () => {
//     instance.get('/api/booking/search/' + newSearch.username + '/')
//         .then((res) => {
//             if (res.status === 404) {
//                 console.log(res.data.detail);
//                 alert("User does not exist");
//             } else {
//                 navigate('/search/'+newSearch.username+'/');
//             }
//         })
//         .catch((error) => {
//             alert("User Does Not Exist")
//         });
// };
//   return (
//     <div>
//       <main className="content" style={{ marginTop: "150px" }}>
//         <div className="container p-0">
//           <h1 className="h3 mb-3">Messages</h1>
//           <div className="card">
//             <div className="row g-0">
//               <div className="col-12 col-lg-5 col-xl-3 border-right">
//               <div className="px-4 ">
//                   <div className="d-flfex align-itemfs-center">
//                     <div className="flex-grow-1 d-flex align-items-center mt-2">
//                       <input
//                         type="text"
//                         className="form-control my-3"
//                         placeholder="Search..."
//                         onChange={handleSearchChange}
//                         name='email'

//                       />
//                       <button className='ml-2' onClick={SearchUser} style={{border:"none", borderRadius:"50%"}}><i className='fas fa-search'></i></button>
//                     </div>
//                   </div>
//                 </div>
//                 {messages.map((message) =>
//                   <Link 
//                     to={"/inbox/" + (message.sender.id === user_id ? message.reciever.id : message.sender.id) + "/"}
//                     href="#"
//                     className="list-group-item list-group-item-action border-0"
//                   >
//                     <small><div className="badge bg-success float-right text-white">{moment.utc(message.date).local().startOf('seconds').fromNow()}</div></small>
//                     <div className="d-flex align-items-start">
//                     {message.sender.id !== user_id && 
//                       <img src={message.sender_profile.image} className="rounded-circle mr-1" alt="1" width={40} height={40}/>
//                     }
//                     {message.sender.id === user_id && 
//                       <img src={message.reciever_profile.image} className="rounded-circle mr-1" alt="2" width={40} height={40}/>
//                     }
//                       <div className="flex-grow-1 ml-3">
//                           {message.sender.id === user_id && 
//                             (message.reciever_profile.full_name !== null ? message.reciever_profile.full_name : message.reciever.username)
//                           }

//                           {message.sender.id !== user_id && 
//                             (message.sender.username) 
//                           }
//                         <div className="small">
//                            <small>{message.message}</small>
//                         </div>
//                       </div>
//                     </div>
//                     </Link>
//                 )}
                
//                 <hr className="d-block d-lg-none mt-1 mb-0" />
//               </div>
//               <div className="col-12 col-lg-7 col-xl-9">
//                 <div className="py-2 px-4 border-bottom d-none d-lg-block">
//                   <div className="d-flex align-items-center py-1">
//                     <div className="position-relative">
//                       <img
//                         src="https://bootdey.com/img/Content/avatar/avatar3.png"
//                         className="rounded-circle mr-1"
//                         alt="Sharon Lessman"
//                         width={40}
//                         height={40}
//                       />
//                     </div>
//                     <div className="flex-grow-1 pl-3">
//                       <strong>Sharon Lessman</strong>
//                       <div className="text-muted small">
//                         <em>Online</em>
//                       </div>
//                     </div>
//                     <div>
//                       <button className="btn btn-primary btn-lg mr-1 px-3">
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           width={24}
//                           height={24}
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="currentColor"
//                           strokeWidth={2}
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           className="feather feather-phone feather-lg"
//                         >
//                           <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
//                         </svg>
//                       </button>
//                       <button className="btn btn-info btn-lg mr-1 px-3 d-none d-md-inline-block">
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           width={24}
//                           height={24}
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="currentColor"
//                           strokeWidth={2}
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           className="feather feather-video feather-lg"
//                         >
//                           <polygon points="23 7 16 12 23 17 23 7" />
//                           <rect x={1} y={5} width={15} height={14} rx={2} ry={2} />
//                         </svg>
//                       </button>
//                       <button className="btn btn-light border btn-lg px-3">
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           width={24}
//                           height={24}
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="currentColor"
//                           strokeWidth={2}
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           className="feather feather-more-horizontal feather-lg"
//                         >
//                           <circle cx={12} cy={12} r={1} />
//                           <circle cx={19} cy={12} r={1} />
//                           <circle cx={5} cy={12} r={1} />
//                         </svg>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="position-relative">
//                   <div className="chat-messages p-4">
//                     <div className="chat-message-right pb-4">
//                       <div>
//                         <img
//                           src="https://bootdey.com/img/Content/avatar/avatar1.png"
//                           className="rounded-circle mr-1"
//                           alt="Chris Wood"
//                           width={40}
//                           height={40}
//                         />
//                         <div className="text-muted small text-nowrap mt-2">
//                           2:33 am
//                         </div>
//                       </div>
//                       <div className="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
//                         <div className="font-weight-bold mb-1">You</div>
//                         Lorem ipsum dolor sit amet, vis erat denique in, dicunt
//                         prodesset te vix.
//                       </div>
//                     </div>
//                     <div className="chat-message-left pb-4">
//                       <div>
//                         <img
//                           src="https://bootdey.com/img/Content/avatar/avatar3.png"
//                           className="rounded-circle mr-1"
//                           alt="Sharon Lessman"
//                           width={40}
//                           height={40}
//                         />
//                         <div className="text-muted small text-nowrap mt-2">
//                           2:34 am
//                         </div>
//                       </div>
//                       <div className="flex-shrink-1 bg-light rounded py-2 px-3 ml-3">
//                         <div className="font-weight-bold mb-1">Sharon Lessman</div>
//                         Sit meis deleniti eu, pri vidit meliore docendi ut, an eum
//                         erat animal commodo.
//                       </div>
//                     </div>
//                     <div className="chat-message-right mb-4">
//                       <div>
//                         <img
//                           src="https://bootdey.com/img/Content/avatar/avatar1.png"
//                           className="rounded-circle mr-1"
//                           alt="Chris Wood"
//                           width={40}
//                           height={40}
//                         />
//                         <div className="text-muted small text-nowrap mt-2">
//                           2:35 am
//                         </div>
//                       </div>
//                       <div className="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
//                         <div className="font-weight-bold mb-1">You</div>
//                         Cum ea graeci tractatos.
//                       </div>
//                     </div>
//                     <div className="chat-message-left pb-4">
//                       <div>
//                         <img
//                           src="https://bootdey.com/img/Content/avatar/avatar3.png"
//                           className="rounded-circle mr-1"
//                           alt="Sharon Lessman"
//                           width={40}
//                           height={40}
//                         />
//                         <div className="text-muted small text-nowrap mt-2">
//                           2:36 am
//                         </div>
//                       </div>
//                       <div className="flex-shrink-1 bg-light rounded py-2 px-3 ml-3">
//                         <div className="font-weight-bold mb-1">Sharon Lessman</div>
//                         Sed pulvinar, massa vitae interdum pulvinar, risus lectus
//                         porttitor magna, vitae commodo lectus mauris et velit. Proin
//                         ultricies placerat imperdiet. Morbi varius quam ac venenatis
//                         tempus.
//                       </div>
//                     </div>
//                     <div className="chat-message-left pb-4">
//                       <div>
//                         <img
//                           src="https://bootdey.com/img/Content/avatar/avatar3.png"
//                           className="rounded-circle mr-1"
//                           alt="Sharon Lessman"
//                           width={40}
//                           height={40}
//                         />
//                         <div className="text-muted small text-nowrap mt-2">
//                           2:37 am
//                         </div>
//                       </div>
//                       <div className="flex-shrink-1 bg-light rounded py-2 px-3 ml-3">
//                         <div className="font-weight-bold mb-1">Sharon Lessman</div>
//                         Cras pulvinar, sapien id vehicula aliquet, diam velit
//                         elementum orci.
//                       </div>
//                     </div>
//                     <div className="chat-message-right mb-4">
//                       <div>
//                         <img
//                           src="https://bootdey.com/img/Content/avatar/avatar1.png"
//                           className="rounded-circle mr-1"
//                           alt="Chris Wood"
//                           width={40}
//                           height={40}
//                         />
//                         <div className="text-muted small text-nowrap mt-2">
//                           2:38 am
//                         </div>
//                       </div>
//                       <div className="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
//                         <div className="font-weight-bold mb-1">You</div>
//                         Lorem ipsum dolor sit amet, vis erat denique in, dicunt
//                         prodesset te vix.
//                       </div>
//                     </div>
//                     <div className="chat-message-left pb-4">
//                       <div>
//                         <img
//                           src="https://bootdey.com/img/Content/avatar/avatar3.png"
//                           className="rounded-circle mr-1"
//                           alt="Sharon Lessman"
//                           width={40}
//                           height={40}
//                         />
//                         <div className="text-muted small text-nowrap mt-2">
//                           2:39 am
//                         </div>
//                       </div>
//                       <div className="flex-shrink-1 bg-light rounded py-2 px-3 ml-3">
//                         <div className="font-weight-bold mb-1">Sharon Lessman</div>
//                         Sit meis deleniti eu, pri vidit meliore docendi ut, an eum
//                         erat animal commodo.
//                       </div>
//                     </div>
//                     <div className="chat-message-right mb-4">
//                       <div>
//                         <img
//                           src="https://bootdey.com/img/Content/avatar/avatar1.png"
//                           className="rounded-circle mr-1"
//                           alt="Chris Wood"
//                           width={40}
//                           height={40}
//                         />
//                         <div className="text-muted small text-nowrap mt-2">
//                           2:40 am
//                         </div>
//                       </div>
//                       <div className="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
//                         <div className="font-weight-bold mb-1">You</div>
//                         Cum ea graeci tractatos.
//                       </div>
//                     </div>
//                     <div className="chat-message-right mb-4">
//                       <div>
//                         <img
//                           src="https://bootdey.com/img/Content/avatar/avatar1.png"
//                           className="rounded-circle mr-1"
//                           alt="Chris Wood"
//                           width={40}
//                           height={40}
//                         />
//                         <div className="text-muted small text-nowrap mt-2">
//                           2:41 am
//                         </div>
//                       </div>
//                       <div className="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
//                         <div className="font-weight-bold mb-1">You</div>
//                         Morbi finibus, lorem id placerat ullamcorper, nunc enim
//                         ultrices massa, id dignissim metus urna eget purus.
//                       </div>
//                     </div>
//                     <div className="chat-message-left pb-4">
//                       <div>
//                         <img
//                           src="https://bootdey.com/img/Content/avatar/avatar3.png"
//                           className="rounded-circle mr-1"
//                           alt="Sharon Lessman"
//                           width={40}
//                           height={40}
//                         />
//                         <div className="text-muted small text-nowrap mt-2">
//                           2:42 am
//                         </div>
//                       </div>
//                       <div className="flex-shrink-1 bg-light rounded py-2 px-3 ml-3">
//                         <div className="font-weight-bold mb-1">Sharon Lessman</div>
//                         Sed pulvinar, massa vitae interdum pulvinar, risus lectus
//                         porttitor magna, vitae commodo lectus mauris et velit. Proin
//                         ultricies placerat imperdiet. Morbi varius quam ac venenatis
//                         tempus.
//                       </div>
//                     </div>
//                     <div className="chat-message-right mb-4">
//                       <div>
//                         <img
//                           src="https://bootdey.com/img/Content/avatar/avatar1.png"
//                           className="rounded-circle mr-1"
//                           alt="Chris Wood"
//                           width={40}
//                           height={40}
//                         />
//                         <div className="text-muted small text-nowrap mt-2">
//                           2:43 am
//                         </div>
//                       </div>
//                       <div className="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
//                         <div className="font-weight-bold mb-1">You</div>
//                         Lorem ipsum dolor sit amet, vis erat denique in, dicunt
//                         prodesset te vix.
//                       </div>
//                     </div>
//                     <div className="chat-message-left pb-4">
//                       <div>
//                         <img
//                           src="https://bootdey.com/img/Content/avatar/avatar3.png"
//                           className="rounded-circle mr-1"
//                           alt="Sharon Lessman"
//                           width={40}
//                           height={40}
//                         />
//                         <div className="text-muted small text-nowrap mt-2">
//                           2:44 am
//                         </div>
//                       </div>
//                       <div className="flex-shrink-1 bg-light rounded py-2 px-3 ml-3">
//                         <div className="font-weight-bold mb-1">Sharon Lessman</div>
//                         Sit meis deleniti eu, pri vidit meliore docendi ut, an eum
//                         erat animal commodo.
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex-grow-0 py-3 px-4 border-top">
//                   <div className="input-group">
//                     <input
//                       type="text"
//                       className="form-control"
//                       placeholder="Type your message"
//                     />
//                     <button className="btn btn-primary">Send</button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }

// export default Message