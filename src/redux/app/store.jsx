import {configureStore} from '@reduxjs/toolkit'
import authReducer from '../slices/userslices/authSlice'
import  {apiSlice}  from '../slices/userslices/apiSlice'
import adminAuthReducer from '../slices/adminslices/adminAuthSlice'
import roomReducer from '../slices/roomslices/roomSlice'
import bookingReducer from '../slices/bookingslices/bookingslice'

const store =configureStore({
    reducer:{
        auth:authReducer,
        adminAuth:adminAuthReducer,
        room:roomReducer,
        booking:bookingReducer,
        [apiSlice.reducerPath]:apiSlice.reducer,
        
    },
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware().concat(apiSlice.middleware),
    devTools:true
})


export default store






























// import { configureStore } from "@reduxjs/toolkit";
// import UserAuthSlice from "../features/reducer/UserAuthSlice";
// import AdminAuthSlice from "../features/reducer/AdminAuthSlice";
// import UserUpdateSlice from "../features/reducer/UsersUpdateSlice";

// const loadState = () => {
//   try {
//     const serializedState = localStorage.getItem("reduxState");
//     if (serializedState === null) {
//       return undefined;
//     }
//     return JSON.parse(serializedState);
//   } catch (err) {
//     return undefined;
//   }
// };


// // Save state to localStorage
// const saveState = (state) => {
//   try {
//     const serializedState = JSON.stringify(state);
//     localStorage.setItem("reduxState", serializedState);
//   } catch (err) {
//     // Handle potential errors while saving
//   }
// };

// const persistedState = loadState();



// export const store = configureStore({
//   reducer: {
//     user:UserAuthSlice,
//     admin:AdminAuthSlice,
//     updateUser: UserUpdateSlice
//   },
//   preloadedState: persistedState,
// });
// store.subscribe(() => {
//   saveState(store.getState());
// });