import { apiSlice } from "./apiSlice";
const USERS_URL ='/api'
const baseURL = "https://backend.extremebookings.online";
// const baseURL = "http://127.0.0.1:8000";

export const userApiSlice =apiSlice.injectEndpoints({
  endpoints:(builder)  =>({
    login:builder.mutation({
        query:(data)=>({
            url:`${baseURL}${USERS_URL}/token/`,
            method:'POST',
            body:data
        })
    }),
    signUp:builder.mutation({
      query:(data)=>({
        url:`${USERS_URL}/user/register/`,
        method:'POST',
        body:data
    })
    }),

    verifyOtp:builder.mutation({
      query:(data)=>({
        url:`${USERS_URL}/verifyOtp`,
        method:'POST',
        body:data
      })
    }),
 

 
  })

   
  
})

export  const {useLoginMutation,useSignUpMutation,useVerifyOtpMutation}=userApiSlice;