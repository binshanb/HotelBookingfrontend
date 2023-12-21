import { createSlice } from "@reduxjs/toolkit";




const initialState = {
  bookingInfo : localStorage.getItem('bookingInfo')? JSON.parse(localStorage.getItem('bookingInfo')): null
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    activateBookingInfo: (state, action) => {
      state.bookingInfo = action.payload;
      localStorage.setItem('bookingInfo', JSON.stringify(action.payload));
    },
    deactivateBookingInfo: (state) => {
      state.bookingInfo = null;
      localStorage.removeItem('bookingInfo');
    },
  },
});

export const { activateBookingInfo, deactivateBookingInfo } =bookingSlice.actions;

export default bookingSlice.reducer;





























// import { createSlice } from "@reduxjs/toolkit";

// // Retrieve booking data from local storage if available, or set initial state
// const storedBookingData = localStorage.getItem('bookingData')
//   ? JSON.parse(localStorage.getItem('bookingData'))
//   : null ;

// const initialState = {
//   bookingData: storedBookingData,
// };

// const bookingSlice = createSlice({
//   name: 'booking',
//   initialState,
//   reducers: {
//     setBookingInfo: (state, action) => {
//         state.bookingData = action.payload;
//         localStorage.setItem('bookingData', JSON.stringify(action.payload));
    

      
//     },
//     clearBookingInfo: (state) => {
//         state.bookingData = null;
//         localStorage.removeItem('bookingData')
     
//     },
//   },
// });

// export const { setBookingInfo, clearBookingInfo } = bookingSlice.actions;

// export default bookingSlice.reducer;
