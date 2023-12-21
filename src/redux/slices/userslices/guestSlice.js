// authSlice.js

import { createSlice } from "@reduxjs/toolkit";

import instance from "../../../utils/Axios";

const initialState = {
  userInfo: null,
  loading: false,
  error: null,
};

const guestSlice = createSlice({
  name: 'guest',
  initialState,
  reducers: {
    fetchUserInfoStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUserInfoSuccess: (state, action) => {
      state.loading = false;
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    fetchUserInfoFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchUserInfoStart, fetchUserInfoSuccess, fetchUserInfoFailure } = guestSlice.actions;

export const fetchUserInfo = () => async (dispatch) => {
  dispatch(fetchUserInfoStart());
  try {
    const response = await instance.get('/user/user-detail'); // Replace with your API endpoint
    dispatch(fetchUserInfoSuccess(response.data));
  } catch (error) {
    dispatch(fetchUserInfoFailure(error.message));
  }
};

export default guestSlice.reducer;
