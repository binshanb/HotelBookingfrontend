import { createSlice } from "@reduxjs/toolkit";

// Retrieve room info from local storage if available, or set to null
const storedRoomInfo = localStorage.getItem('roomInfo')? JSON.parse(localStorage.getItem('roomInfo')): null;


const initialState = {
  roomInfo: storedRoomInfo,
};

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    activateRoomInfo: (state, action) => {
      state.roomInfo = action.payload;
      localStorage.setItem('roomInfo', JSON.stringify(action.payload));
    },
    deactivateRoomInfo: (state) => {
      state.roomInfo = null;
      localStorage.removeItem('roomInfo');
    },
  },
});

export const { activateRoomInfo, deactivateRoomInfo } = roomSlice.actions;

export default roomSlice.reducer;



// roomSlice.js
// import { createSlice } from "@reduxjs/toolkit";

// const initialState= {
//   selectedRoom: null, 
// }

// const roomSlice =createSlice({
//     name:'room',
//     initialState,
//     reducers:{
//         roomActivate:(state,action)=>{
//           state.selectedRoom = action.payload;
            
//         },
//         roomDeactivate:(state)=>{
//           state.selectedRoom = null; 
            
//         } 
//     }
// })

// export const {roomActivate,roomDeactivate}=roomSlice.actions;

// export default roomSlice.reducer;

// import { createSlice } from "@reduxjs/toolkit";

// import instance from "../../../utils/Axios";
// import { baseUrl } from "../../../utils/constants";


// const initialState = {
//   roomInfo: null,
//   loading: false,
//   error: null,
// };

// const roomSlice = createSlice({
//   name: 'room',
//   initialState,
//   reducers: {
//     fetchRoomInfoStart: (state) => {
//       state.loading = true;
//       state.error = null;
//     },
//     fetchRoomInfoSuccess: (state, action) => {
//       state.loading = false;
//       state.roomInfo = action.payload;
//       localStorage.setItem('roomInfo', JSON.stringify(action.payload));
//     },
//     fetchRoomInfoFailure: (state, action) => {
//       state.loading = false;
//       state.error = action.payload;
//     },
//   },
// });
// export const { fetchRoomInfoStart, fetchRoomInfoSuccess, fetchRoomInfoFailure } = roomSlice.actions;

// export const fetchRoomInfo = (id) => async (dispatch) => {
//   dispatch(fetchRoomInfoStart());
//   try {
//     const response = await instance.get(`${baseUrl}/api/booking/roomdetail/${id}/`); // Replace with your API endpoint
//     dispatch(fetchRoomInfoSuccess(response.data));
//   } catch (error) {
//     dispatch(fetchRoomInfoFailure(error.message));
//   }
// };
// export default roomSlice.reducer;

