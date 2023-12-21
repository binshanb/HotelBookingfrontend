import { createSlice } from "@reduxjs/toolkit";

const initialState= {
    userInfo:localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem('userInfo')):null,
    messages: [],
};

const authSlice =createSlice({
    name:'auth',
    initialState,
    reducers:{
        setCredentials:(state,action)=>{
            state.userInfo=action.payload
            localStorage.setItem('userInfo',JSON.stringify(action.payload))
        },
        logout:(state)=>{
            state.userInfo=null;
            localStorage.removeItem('userInfo')
        },
        setMessages: (state, action) => { // New reducer to set messages
            state.messages = action.payload;
          },
          clearMessages: (state) => { // New reducer to clear messages
            state.messages = [];
          },
    }
})

export const selectUserInfo = (state) => state.auth.userInfo; 
export const {setCredentials,logout,setMessages,clearMessages}=authSlice.actions;

export default authSlice.reducer;