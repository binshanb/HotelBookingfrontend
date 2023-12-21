// AdminBookingStatusChange.js

import React, { useState } from 'react';
import instance from '../../../utils/Axios';
import { baseUrl } from '../../../utils/constants';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const AdminBookingStatusChange = ({ bookingId, initialStatus, onUpdateStatus }) => {
  const [bookingStatus, setBookingStatus] = useState(initialStatus);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setBookingStatus(newStatus);

    try {
      // Update the booking status via API call immediately
      await instance.patch(`${baseUrl}/api/booking/admin/change-booking-status/${bookingId}/`, {
        booking_status: newStatus,
      });

      // After successful update, inform the parent component
      onUpdateStatus(bookingId, newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
      // Handle error scenario
    }
  };

  return (
    <Select
      value={bookingStatus}
      onChange={handleStatusChange}
      sx={{
        margin: 1,
        minWidth: 120,
        // add any other CSS properties here
      }}
    >
      <MenuItem value="pending">Pending</MenuItem>
      <MenuItem value="confirmed">Confirmed</MenuItem>
      <MenuItem value="cancelled">Cancelled</MenuItem>
      <MenuItem value="completed">Completed</MenuItem>
    </Select>
  );
};

export default AdminBookingStatusChange;















































// import React, { useContext } from "react";
// // import { useDispatch, useSelector } from 'react-redux';
// // import  {searchBy,checkout } from '../../../redux/slices/roomslices/RoomStorage'; // Import your Redux actions
// import {filteredCheckedInRooms} from '../../../redux/slices/roomslices/roomFilterSlice';
// import Table from "../../user/Tables/Table";
// import { useDispatch,useSelector } from "react-redux";

// export default function RoomStorage() {
//     const dispatch = useDispatch();
//     const context = useSelector(state => state.room); // Assuming your room-related state is stored in Redux
  
//     let rooms = context.filteredCheckedInRooms;
//     const columns = ["Room", "Booked By", "Phone Number", "Action"];
  
//     const handleSearch = (event) => {
//     //   dispatch(searchBy(event.target.value)); // Dispatch search action
//     };
  
//     const handleCheckout = (roomId) => {
//     //   dispatch(checkout(roomId)); // Dispatch checkout action with roomId parameter
//      };
  
//     if (context.isAdmin) {
//       return (
//         <div className="container pt-5">
//           <form>
//             <div className="title my-2 text-center">
//               <h4>List of Booked Rooms</h4>
//             </div>
//             <div className="row my-4">
//               <div className="col-md-12 my-2">
//                 <input
//                   className="dashboard-input"
//                   name="searchKey"
//                   value={context.searchKey}
//                   type="text"
//                   placeholder="Enter room slug to search"
//                   onChange={handleSearch} // Use the new function for handling search
//                 ></input>
//               </div>
//             </div>
//           </form>
//           {rooms.length < 1 ? (
//             <div>No Checkings</div>
//           ) : (
//             <Table columns={columns} data={rooms} checkout={handleCheckout} /> // Use the new function for handling checkout
//           )}
//         </div>
//       );
//     } else {
//       return <h1>Not Authorized to View This Page</h1>;
//     }
//   }