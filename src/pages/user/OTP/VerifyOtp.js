// import { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import {toast} from 'react-toastify'
// import { useVerifyOtpMutation } from "../../slices/usersApiSlice.js";


// function VerifyOtp(){
//     const [otp,setOtp]=useState('')
//     const navigate=useNavigate()
//     const {state}=useLocation()

//     const [Otpverify]=useVerifyOtpMutation()

//     const verifyOtpHandler=async(e)=>{
//         e.preventDefault()
//         try{
//             const res=await Otpverify({state,otp}).unwrap()
//             navigate('/resetPassword',{state:state})
// toast.success('success')
//         }catch(error){
//             toast.error(error?.data||error.error)
//         }
//     }

//     return(
//         <div className='login template d-flex justify-content-center align-items-center vh-100' style={{ backgroundColor: 'rgb(255 204 0)' }}>
//         <div className='form_container p-5 rounded bg-white'>
//           <form onSubmit={verifyOtpHandler}>
//             <h3 className='text-center'>Verify Otp</h3>
//             <div className='mb-3'>
//               <input type="text" name="otp" placeholder='Enter Otp' className='form-control'  onChange={(e) => setOtp(e.target.value)} />
//             </div>
           
//             <div className='d-grid'>
//               <button type="submit" className='btn btn-primary mb-3' >
//               Verify OTP
//               </button>
//             </div>
          
//           </form>
//         </div>
       
//       </div>
//     )
// }

// export default VerifyOtp