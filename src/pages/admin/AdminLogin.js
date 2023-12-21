// import './user/Auth/Login.css';
import {Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { setAdminCredentials } from '../../redux/slices/adminslices/adminAuthSlice';
import { toast } from 'react-toastify';
import instance from '../../utils/Axios';

function AdminLogin() {

 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [formErrors,setFormErrors]=useState({})
 const [isSubmit,setIsSubmit]=useState(false)

  const navigate = useNavigate();
  const dispatch = useDispatch();

 const {adminInfo}=useSelector((state)=>state.adminAuth)


  useEffect(() => {
    if (adminInfo) {
      navigate("/admin/dashboard");
    }
  }, [navigate, adminInfo]);

  useEffect(()=>{
    if(Object.keys(formErrors).length==0&&isSubmit){
        console.log()
    }
  },[formErrors])
  const submitHandler = async (e) => {
    e.preventDefault();
        setFormErrors(validate(email,password))
       setIsSubmit(true)
       
       try {
         const res=await instance.post('/api/token/',{email,password})
         console.log(res)
           dispatch(setAdminCredentials({ ...res.data })) 
           navigate('/admin/usermanagement');
       } catch (error) {
        console.log(error)
              toast.error(error?.data|| error.error)
       }
  };

  const validate=(email,password)=>{

    const errors={}
    const regex= /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

      if(!email)  {
       errors.email='Email is required'
      }else if(!regex.test(email)){
        errors.email='This is an invalid email'
      }
      if(!password){
        errors.password='Password is required'
      }else if(password.length<3){
        errors.password='Password must be more than or equal to 3 characters'
      }else if(password.length>10){
        errors.password='Password must be less than or equal to 10 characters'
      }
      return errors
  }
  return (
    <div className='login template d-flex justify-content-center align-items-center vh-100 'style={{ backgroundColor:'#90EE90'}}>
    <div className='form_container bg-white p-5 rounded'>
      <form onSubmit={submitHandler}>
      <h1 className="text-4xl font-bold text-gray-800">Admin Login</h1>
        <div className='mb-3'>
          <input type="email" placeholder='Enter Email'  onChange={(e) => {
                setEmail(e.target.value);
              }} className='form-control' />
          <p style={{color:'red'}}>{formErrors.email}</p>
        </div>
        <div className='mb-3'>
          <input type="password" placeholder='Enter password'  onChange={(e) => {
                setPassword(e.target.value);
              }} className='form-control' />
          <p style={{color:'red'}}>{formErrors.password}</p>
        </div>
        <div className='d-grid'>
          <button className='btn mb-3 bg-info'>Sign In</button>
        </div>
      </form>
      {/* <p className='text-end mt-2'>
      <Link style={{color:"black",textDecoration:'none'}} to='/admin/forgotPassword'>Forgot Password</Link> | 
      <Link style={{color:"black",textDecoration:'none'}} to='/admin/otpLoginEmail' className="ms-2">Otp Login</Link>
      </p> */}
    </div>
  </div>
  )
}

export default AdminLogin
















































































// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { Link, useNavigate } from "react-router-dom";
// import { setAuthAdmin } from '../../redux/features/reducer/AdminAuthSlice';
// import authAxios from "../../redux/features/api/authAPI";
// import { login} from "../../utils/constants"
// import jwtDecode from "jwt-decode";
// import Swal from "sweetalert2";


// const AdminLogin = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const handleAdminLogin = (e) => {
//     e.preventDefault();
//     const body = JSON.stringify({
//       email: e.target.adminemail.value,
//       password: e.target.password.value,
//     });

//     authAxios
//       .post(login, body, {
//         headers: { "Content-Type": "application/json" },
//       })
//       .then((response) => {
//         if (response.status === 200) {
//           const decodedToken = jwtDecode(response?.data?.access);
//           console.log(decodedToken);
         
//           if (decodedToken.is_superuser) {

//             localStorage.setItem("authTokens", JSON.stringify(response?.data));
//             console.log("data stored");
//             dispatch(
//               setAuthAdmin({
//                 adminAuthToken: JSON.stringify(response?.data),
//                 admin: jwtDecode(response?.data?.access),
//               })
//             );

//             Swal.fire({
//               icon: "success",
//               title: "Successfully logged in",
//               showConfirmButton: false,
//               timer: 1500,
//             });
//           }
//         }
//         navigate("/admin")
//       })
//       .catch((err) => {
//         console.log(err);
//         Swal.fire({
//           position: "center",
//           icon: "warning",
//           title: "Invalid Credentials",
//           showConfirmButton: false,
//           timer: 1500,
//         });
//         navigate("/admin/login")
//       });
//   };

//   return (
//       <div className="container mt-5 ml-5">
//         <h2 className="">
//           Admin Login
//         </h2><br/>
//         <div className="">
//           <form onSubmit={handleAdminLogin}>
//             <div className="mb-4">
//               <input
//                 type="email"
//                 name="adminemail"
//                 className=" px-3 py-2 mt-1 text-gray-700 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                 placeholder="Email"
//               />
//             </div>
//             <div className="mb-6">
//               <input
//                 type="password"
//                 name="password"
//                 className=" px-3 py-2 mt-1 text-gray-700 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                 placeholder="Password"
//               />
//             </div>
//             <button style={{width:'200px'}}
//               type="submit"
//               className=" px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
//             >
//               Login
//             </button>
//           </form>
//         </div>
//       </div>
//   );
// };

// export default AdminLogin;