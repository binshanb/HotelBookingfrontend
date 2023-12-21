import { createSlice } from "@reduxjs/toolkit";

import { createAction } from '@reduxjs/toolkit';

export const updateRooms = createAction('updateRooms');

const initialState = {
  rooms: [],
  sortedRooms: [],
  featuredRooms: [],
  checkedInRooms: [],
  filteredCheckedInRooms: [],
  loading: true,
  categoryName: "all",
  capacity: "1",
  pricePerNight: 0,
  maxPrice: 0,
  minPrice: 0,
  maxRoomSize: 0,
  minRoomSize: 0,
  reserved: false,
  searchKey: "",
  checkout:"true",
  filteredRooms:[],
};

const roomFilterSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    setRooms: (state, action) => {
      // Update state with room data
      const {
        roomData,
        featured,
        minPrice,
        maxPrice,
        maxRoomSize,
        minRoomSize,
        checkout,
        
      } = action.payload;
   

      state.rooms = roomData;
      state.sortedRooms = roomData;
      state.featuredRooms = featured;
      state.pricePerNight = maxPrice;
      state.minPrice = minPrice;
      state.maxPrice = maxPrice;
      state.maxRoomSize = maxRoomSize;
      state.minRoomSize = minRoomSize;
      state.checkout = checkout;
      
      state.loading = false;
    },
    setFilteredRooms: (state, action) => {
      state.filteredRooms = action.payload;
    },
    updateRooms: (state, action) => {
      const { category_name, price_per_night } = action.payload;
      let filteredRooms = state.rooms.slice();
      if (category_name && category_name !== 'all')  {
        filteredRooms = filteredRooms.filter(
          (room) => room.category_name === category_name
        );
      }

      // Filter by price per night
      if (price_per_night) {
        filteredRooms = filteredRooms.filter(
          (room) => room.price_per_night <= parseInt(price_per_night)
        );
      }

      state.filteredRooms = filteredRooms;
    },


    setCheckedInRooms: (state, action) => {
      state.checkedInRooms = action.payload;
    },
    setFilteredCheckedInRooms: (state, action) => {
      state.filteredCheckedInRooms = action.payload;
    },
        
    // Other reducers for manipulating state values
  },
});

export const {
  setRooms,
  setCheckedInRooms,
  setFilteredCheckedInRooms,
  // Add other actions here as needed
} = roomFilterSlice.actions;

export default roomFilterSlice.reducer;
