// slices/chatSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  unseenCount: 0,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    incrementUnseenCount: (state) => {
      state.unseenCount += 1;
    },
    clearUnseenCount: (state) => {
      state.unseenCount = 0;
    },
  },
});

export const { incrementUnseenCount, clearUnseenCount } = chatSlice.actions;
export const selectUnseenCount = (state) => state.chat.unseenCount;
export default chatSlice.reducer;
