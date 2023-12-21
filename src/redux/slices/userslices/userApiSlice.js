import { apiSlice } from "./apiSlice";
const USERS_URL ='/api'
const baseURL = "http://127.0.0.1:8000";
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
    forgotPassword:builder.mutation({
      query:(data)=>({
        url:`${USERS_URL}/forgot-password/`,
        method:'PUT',
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
    sendPasswordResetEmail: builder.mutation({
      query: (user) => {
        return {
          url: `${USERS_URL}/send-reset-password-email/`,
          method: 'POST',
          body: user,
          headers: {
            'Content-type': 'application/json',
          }
        }
      }
    }),
    resetPassword:builder.mutation({
      query:(data)=>({
        url:`${USERS_URL}/reset-password/`,
        method:'POST',
        body:data
      })
    }),
    changePassword:builder.mutation({
      query:(data)=>({
        url:`${USERS_URL}/change-password/`,
        method:'POST',
        body:data
      })
    }),
  })

   
  
})

export  const {useLoginMutation,useSignUpMutation,useForgotPasswordMutation,useVerifyOtpMutation,useChangePasswordMutation,
  useResetPasswordMutation,useSendPasswordResetEmailMutation}=userApiSlice;