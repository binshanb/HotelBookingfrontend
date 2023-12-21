import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { AiOutlineAppstoreAdd,AiOutlineCheckCircle } from "react-icons/ai";
import { BiSolidEdit } from "react-icons/bi";
import { FaBan, FaCheck } from "react-icons/fa";
import {GoCheckCircleFill} from "react-icons/go";
import {HiExclamationCircle} from "react-icons/hi"
import { adminInstance } from "../../../utils/Axios";
import '../UserManagement.css';
import AddRoomModal from "../Modal/AddRoomModal";
import EditRoomModal from "../Modal/EditRoomModal"; // Import the new modal
import { toast } from "react-toastify";

const showToast = (message, type = "error") => {
  toast[type](message, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};


const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState(null);
  const [description,setDescription] = useState("");
  const [categories, setCategories] = useState([]);

  const [features, setFeatures] = useState([]);


  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.category_name : "";
  };
  
  const getFeaturesList = (featureIds) => {
    return featureIds.map((featureId) => {
      const feature = features.find((feat) => feat.id === featureId);
      return feature ? feature.name : "";
    });
  };
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "title", headerName: "Room Name", width: 150 },
    { field: "category", headerName: "Category", width: 130, valueGetter: (params) => params.row.category.category_name || "", },
    { field: "price_per_night", headerName: "Price Per Night", width: 150 },
    { field: "room_slug", headerName: "Room Slug", width: 130 },
  
    { field: "capacity", headerName: "Capacity", width: 120 },
    { field: "room_size", headerName: "Room Size", width: 120 },
    { field: "description", headerName: "Description", width: 120 },
    {
      field: "cover_image",
      headerName: "Cover Image",
      width: 200,
      renderCell: (params) => (
        <img
          src={params.value}
          alt="Room"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ),
    },
    {
      field: "features",
      headerName: "Features",
      width: 200,
      renderCell: (params) => (
        <ul>
          {params.row.features && Array.isArray(params.row.features) ? (
            params.row.features.map((feature) => {
              
              // const foundFeature = features.find((feature) => feature.id === featureId);
              return (
                <li key={feature.id}>
                  {feature ? feature.name : "Unknown Feature"}
                </li>
              );
            })
          ) : (
            <li>No features</li>
          )}
        </ul>
      ),
    },
    
    {
      field: "is_active",
      headerName: "Active",
      width: 100,
      renderCell: (params) => (
        params.value ? (
          <GoCheckCircleFill color="green" style={{fontSize: "24px"}} />
        ) : (
          <HiExclamationCircle color="red" style={{fontSize: "24px"}}/>
        )
      ),
    },
    ];
  const fetchRooms = async () => {
    try {
      const response = await adminInstance.get("booking/admin/room-list/");
      console.log(response.data,"jkkjjjkk")
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };
  
  useEffect(() => {
    fetchRooms();
    fetchCategories();
    fetchFeatures();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await adminInstance.get("booking/admin/room-category/");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const fetchFeatures = async () => {
    try {
      const response = await adminInstance.get("booking/admin/room-feature/");
      setFeatures(response.data);
    } catch (error) {
      console.error("Error fetching features", error);
    }
  };


  // const handleRoomSelect = (room) => {
  //   setSelectedRooms(room);
  // };
  const handleAddRoom = async (roomData) => {
    try {
      await adminInstance.post("booking/admin/add-room/", roomData);
      fetchRooms();
      showToast("Room added", "success");
      setIsAddModalOpen(false);
    } catch (error) {
      showToast("Error adding room", "error");
      console.error("Error adding room", error);
    }
  };

  const handleEditRoom = (room) => {
    console.log('edit')
    setSelectedRooms(room);
    setIsEditModalOpen(true);
    console.log('value',isEditModalOpen)
  };

  const handleUpdateRoom = async (updatedRoomData, roomId) => {
    try {
      await adminInstance.put(`booking/admin/edit-room/${roomId}/`, updatedRoomData);
      fetchRooms();
      showToast("Room updated", "success");
      setIsEditModalOpen(false);
    } catch (error) {
      showToast("Error updating room", "error");
      console.error("Error updating room", error);
    }
  };

  const handleBlockUnblockRoom = async (roomId, isBlocked) => {
    try {
      await adminInstance.patch(`booking/admin/room-list/block-unblock/${roomId}/`, {
        is_active: !isBlocked,
      });
      fetchRooms();
      showToast(`Room ${isBlocked ? 'Unblocked' : 'Blocked'}`, "success");
    } catch (error) {
      showToast("Error updating room", "error");
      console.error("Error updating room", error);
    }
  };

  const columnsWithActions = [
    ...columns,
    {
      field: "blockUnblock",
      headerName: "Block/Unblock",
      width: 150,
      renderCell: (params) => (
        <div>
          <button
            onClick={() => handleBlockUnblockRoom(params.row.id, params.row.is_active)}
            style={{ border: "none", background: "none", cursor: "pointer" }}
          >
        {params.row.is_active ? <FaBan color="red" style={{ fontSize: "24px"}}/> : <AiOutlineCheckCircle color="green" style={{ fontSize: "24px"}} />}
          </button>{" "}
        </div>
      ),
    },
    {
      field: "edit",
      headerName: "Edit",
      width: 130,
      renderCell: (params) => (
        <div>
          <button
            onClick={() => {
              console.log("Edit button clicked"); 
              handleEditRoom(params.row)}}
            style={{ border: "none", background: "none", cursor: "pointer" }}
          >
            <BiSolidEdit style={{ fontSize: "24px", color: "blue" }} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ backgroundColor: "white", height: "100vh" }}>
      <div className="data-grid-container">
        <div className="header d-flex justify-content-between align-items-center mb-4">
          <div style={{ fontWeight: "bold", fontSize: 32 }}>Room List</div>
          <div
            className="d-flex align-items-center"
            onClick={() => setIsAddModalOpen(true)}
          >
            <AiOutlineAppstoreAdd style={{ fontSize: "30px" }} /> Add
          </div>
        </div>
        <div className="h-500 w-full overflow-hidden border border-gray-300">
          <DataGrid
            rows={rooms}
            columns={columnsWithActions}
            pageSize={5}
            checkboxSelection
            sx={{ backgroundColor: "white" }}
            isCellEditable={(params) => params.field !== "id"}
            onCellEditCommit={(params) => {
              const updatedData = [...rooms];
              updatedData[params.id - 1][params.field] = params.props.value;
              handleUpdateRoom(updatedData[params.id - 1]);
            }}
          />
        </div>
        
        <AddRoomModal
          isOpen={isAddModalOpen}
          onRequestClose={() => setIsAddModalOpen(false)}
          onAddRoom={handleAddRoom}
          roomData={selectedRooms}
          categories={categories} 
          features={features}
        />
       
  {selectedRooms && (
   <EditRoomModal
   isOpen={isEditModalOpen}
   onRequestClose={() => setIsEditModalOpen(false)}
   onEditRoom={handleUpdateRoom}
   roomData={selectedRooms}
   features={features}
   categories={categories}

 />
        )}
      </div>
    </div>
  );
};

export default RoomList;















































































// import React, { useState, useEffect } from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import { AiOutlineAppstoreAdd, AiOutlineCheckCircle } from "react-icons/ai";
// import { BiSolidEdit } from "react-icons/bi";
// import { FaBan, FaCheck } from "react-icons/fa";
// import { GoCheckCircleFill } from "react-icons/go";
// import { HiExclamationCircle } from "react-icons/hi";
// import { adminInstance } from "../../../utils/Axios";
// import '../UserManagement.css'; // Import your CSS file
// import { toast } from "react-toastify";

// const columns = [
//   { field: "id", headerName: "ID", width: 70 },
//   { field: "title", headerName: "Room Title", width: 130 },
//   { field: "category", headerName: "Category", width: 130 },
//   { field: "price_per_night", headerName: "Price per Night", width: 130 },
//   { field: "capacity", headerName: "Capacity", width: 130 },
//   { field: "room_size", headerName: "Room Size", width: 130 },
//   {
//     field: "cover_image",
//     headerName: "Image",
//     width: 200,
//     renderCell: (params) => (
//       <img
//         src={`${params.value}`}
//         alt="Room"
//         style={{ width: "100%", height: "100%", objectFit: "cover" }}
//       />
//     ),
//   },
//   {
//     field: "is_booked",
//     headerName: "Booked",
//     width: 130,
//     renderCell: (params) => (
//       params.value ? (
//         <GoCheckCircleFill color="green" style={{fontSize: "24px"}} />
//       ) : (
//         <HiExclamationCircle color="red" style={{fontSize: "24px"}}/>
//       )
//     ),
//   },
// ];

// const showToast = (message, type = "error") => {
//   toast[type](message, {
//     position: toast.POSITION.TOP_RIGHT,
//     autoClose: 3000,
//     hideProgressBar: false,
//     closeOnClick: true,
//     pauseOnHover: true,
//     draggable: true,
//     progress: undefined,
//   });
// };

// const RoomList = () => {
//   const [rooms, setRooms] = useState([]);

//   const fetchRooms = async () => {
//     try {
//       const response = await adminInstance.get("/room-list/");
//       setRooms(response.data);
//     } catch (error) {
//       console.error("Error fetching rooms", error);
//     }
//   };

//   useEffect(() => {
//     fetchRooms();
//   }, []);

//   return (
//     <div className="room-list-container">
//       <div className="header d-flex justify-content-between align-items-center mb-4">
//         <div style={{ fontWeight: "bold" }}>Room List</div>
//       </div>
//       <div className="room-list">
//         <DataGrid
//           rows={rooms}
//           columns={columns}
//           pageSize={5}
//           checkboxSelection
//           sx={{ backgroundColor: "white" }}
//           isCellEditable={(params) => params.field !== "id"}
//         />
//       </div>
//     </div>
//   );
// };

// export default RoomList;






















































// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import { adminInstance } from '../../../utils/Axios';

// function RoomList() {
//   const [roomList, setRoomList] = useState([]);
//   const [roomName, setRoomName] = useState('');
//   const [existingRoomName, setExistingRoomName] = useState('');
//   const [roomImage, setRoomImage] = useState(null);
//   const [existingRoomImage, setExistingRoomImage] = useState(null);

//   useEffect(() => {
//     adminInstance.get('/roomlist')
//       .then((response) => {
//         console.log(response.data);
//         setRoomList(response.data);
//       })
//       .catch((error) => {
//         console.error('Error fetching rooms:', error);
//       });
//   }, []);

//   const handleRoomEdit = async (e, roomId) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append('room_name', existingRoomName);
//     formData.append('image', existingRoomImage);

//     if (roomName !== existingRoomName) {
//       formData.append('new_room_name', roomName);
//     }

//     if (roomImage !== existingRoomImage) {
//       formData.append('new_image', roomImage);
//     }

//     // Make an API request to edit the room
//     try {
//       const response = await adminInstance.put(`/editroom/${roomId}`, formData);

//       if (response.status === 200) {
//         // Room edited successfully, update your state or perform any necessary actions
//         console.log('Room edited:', response.data);
//         // You might want to update your room list state or perform any other actions
//       } else {
//         // Handle errors and show an error message
//         console.error('Error editing room');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   const handleRoomDelete = (roomId) => {
//     // Make an API request to delete the room
//     adminInstance
//       .delete(`/deleteroom/${roomId}`)
//       .then((response) => {
//         // Room deleted successfully, update your state or perform any necessary actions
//         console.log('Room deleted:', response.data);
//         // You might want to update your room list state or perform any other actions
//       })
//       .catch((error) => {
//         // Handle the error in case the room deletion fails
//         console.error('Error deleting room:', error);
//       });
//   };

//   return (
//     <div className="mt-4 mb-4">
//       <h2 className="text-2xl font-semibold mb-4">Rooms</h2>

//       <Link to="/admin/addroom">
//         <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded-md mb-4">
//           Add Room
//         </button>
//       </Link>

//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="py-2 px-4 border-r border-t border-gray-300">Room Name</th>
//               <th className="py-2 px-4 border-r border-t border-gray-300">Images</th>
//               <th className="py-2 px-4 border-r border-t border-gray-300">Price Per Day</th>
//               <th className="py-2 px-4 border-r border-t border-gray-300">Category</th>
//               <th className="py-2 px-4 border-r border-t border-gray-300">Capacity</th>
//               <th className="py-2 px-4 border-r border-t border-gray-300">Room Size</th>

//               <th className="py-2 px-4">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {roomList && roomList.length > 0 ? (
//               roomList.map((room, index) => (
//                 <tr key={room.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
//                   <td className="py-2 px-4 border-r border-t border-gray-300">
//                     {room.title}
//                   </td>
//                   <td className="py-2 px-4 border-r border-t border-gray-300">
//                     <img
//                       src={room.cover_image}
//                       alt={room.title}
//                       className="h-12 w-12 rounded-full object-cover"
//                     />
//                   </td>
//                   <td className="py-2 px-4 border-r border-t border-gray-300">
//                     {room.price_per_night}
//                   </td>
//                   <td className="py-2 px-4 border-r border-t border-gray-300">
//                     {room.category}
//                   </td>
//                   <td className="py-2 px-4 border-r border-t border-gray-300">
//                     {room.capacity}
//                   </td>
//                   <td className="py-2 px-4 border-r border-t border-gray-300">
//                     {room.room_size}
//                   </td>
//                   <td className="py-2 px-4 border-t">
//                     <Link to="/admin/editroom">
//                       <button
//                         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-md mr-2 transition duration-300 ease-in-out transform hover:scale-105"
//                       >
//                         Edit
//                       </button>
//                     </Link>

//                       <button
//                       onClick={() => handleRoomDelete(room.id)}
//                       className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="3">No rooms found</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default RoomList;


