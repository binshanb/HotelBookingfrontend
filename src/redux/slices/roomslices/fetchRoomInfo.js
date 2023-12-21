// import { roomActivate } from './roomSlice'; // Import the roomActivate action creator
// import instance from '../../../utils/Axios'; // Import your Axios instance or API service

// // Action creator to fetch room information
// export const fetchRoomInfo = (roomId) => {
//   return async (dispatch) => {
//     try {
//       // Fetch room information from your API endpoint using Axios
//       const response = await instance.get(`/api/booking/room-detail/${roomId}/`); // Adjust the endpoint accordingly
      
//       // Dispatch the roomActivate action to update room information in Redux store
//       dispatch(roomActivate(response.data)); // Assuming response.data contains room details
//     } catch (error) {
//       console.error('Error fetching room information:', error);
//       // Handle errors or dispatch an error action if necessary
//     }
//   };
// };
