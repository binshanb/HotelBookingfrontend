import  "./Login.css";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLoginMutation } from "../../../redux/slices/userslices/userApiSlice";
import { setCredentials } from "../../../redux/slices/userslices/authSlice";
import { ToastContainer,toast  } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Box, Button, FormControl, FormHelperText, Input, Typography } from '@mui/material';


function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth || {});
    const showToast = (message, type = 'error') => {
    toast[type](message, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000, // 3 seconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  useEffect(() => {
    if (Object.keys(formErrors).length === 0) {
      console.log();
    }
  }, [formErrors]);
  const submitHandler = async (e) => {
    e.preventDefault();
    setFormErrors(validate(email, password));

    try {
      const res = await login({ email, password }).unwrap();
      console.log("res", res);
      dispatch(setCredentials({ ...res }));
      showToast("Login successful","success");
      navigate("/");
    } catch (err) {
      toast.error(err?.data || err?.error);
    }
  };


  const validate = (email, password) => {
    const errors = {};
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!email) {
      errors.email = "Email is required";
    } else if (!regex.test(email)) {
      errors.email = "This is an invalid email";
    }
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) { 
      errors.password = "Invalid Password";
    } else if (password.length > 10) {
      errors.password = "Invalid Password";
    }
    return errors;
  };
  return (
    <Box className="login template d-flex justify-content-center align-items-center vh-100 bg-blue-200" p={4}>
    <Box className="form_container p-5 rounded bg-white">
      <form onSubmit={submitHandler}>
        <Typography variant="h5" align="center" gutterBottom>
          Sign In
        </Typography>
        <FormControl fullWidth sx={{ mt: 2 }} error={!!formErrors.email}>
          <Input
            type="email"
            value={email}
            placeholder="Enter Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormHelperText>{formErrors.email}</FormHelperText>
        </FormControl>
        <FormControl fullWidth sx={{ mt: 2 }} error={!!formErrors.password}>
          <Input
            type="password"
            value={password}
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormHelperText>{formErrors.password}</FormHelperText>
        </FormControl>

        <Button variant="contained" type="submit" color="primary" fullWidth sx={{ mt: 2 }}>
          Sign In
        </Button>
        <Box textAlign="end" mt={2}>
          <Typography>
            {/* <RouterLink to="/forgot-password">Forgot Password ?</RouterLink> |
            <RouterLink to="/change-password">Change Password ?</RouterLink> | */}
            <RouterLink to="/signup" className="ms-2">
              Sign up
            </RouterLink>
          </Typography>
        </Box>
      </form>
      {/* ToastContainer (assuming it's from a library like react-toastify) doesn't have a direct equivalent in Material-UI */}
      <Box className="links-container text-end mt-2">
        <Typography>

        <RouterLink to="/otp-sent"> OTP Login </RouterLink> 
           
           
          <RouterLink to="/forgot-password/"> Forgot Password ? </RouterLink> 
           
        </Typography>
      </Box>
    </Box>
  </Box>
);
};



export default UserLogin;


































































































// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { UserLogin } from "../../redux/features/reducer/UserAuthSlice";
// import { Link, useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";
// import './Login.css'

// export const Login = () => {
//   const loading = useSelector((s) => s.user?.loading);
//   const error = useSelector((s) => s.user?.error);
//   const data = useSelector((s) => s.user?.data);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [credentials, setCredentials] = useState({
//     email: "",
//     password: "",
//   });

//   const handleOnSubmit = async () => {
//     try {
//       const response = await dispatch(UserLogin(credentials));
//       console.log(response);
//       if (response.error) {
//         throw new Error("Invalid credentials");
//       }

   

//       // Display success message
//       Swal.fire({
//         icon: "success",
//         title: "Successfully logged in",
//         showConfirmButton: false,
//         timer: 1500,
//       });

//       // Navigate to another page
//       navigate("/");
//     } catch (error) {
//       console.error(error);

//       // Display error message
//       Swal.fire({
//         icon: "error",
//         title: "Login failed",
//         text: "Please check your credentials and try again.",
//       });
//     }
//   };

//   if (loading) {
//     return <h1>Loading</h1>;
//   }


//   return (
//       <div className="container mt-5 ml-5">
//           <h1>Sign In</h1><br/>
//           <p>Sign into your Account</p><br/>
//               <input
                
//                 id="email"
//                 onChange={(e) =>
//                   setCredentials((s) => ({ ...s, email: e.target.value }))
//                 }
//                 value={credentials.email}
//                 name="email"
//                 type="email"
//                 placeholder="Email"
//                 required
                
//                 className="block px-3 py-2 placeholder-gray-47wQbNPTDJp9hMYdvogK2hAUiHsGeiybwaWe36bwtRQ3UTpYV7YuZ8FV5j9nauFCWwcjM6dTzpL5s2N79Rp5unwdMvc8ZKUborder-indigo-500 sm:text-sm"
//               /><br/>
//               <input
                
//                 id="password"
//                 onChange={(e) =>
//                   setCredentials((s) => ({ ...s, password: e.target.value }))
//                 }
//                 value={credentials.password}
//                 name="password"
//                 type="password"
//                 placeholder="Password"
//                 required
                
//                 className="block  px-3 py-2 placeholder-gray-47wQbNPTDJp9hMYdvogK2hAUiHsGeiybwaWe36bwtRQ3UTpYV7YuZ8FV5j9nauFCWwcjM6dTzpL5s2N79Rp5unwdMvc8ZKUborder-indigo-500 sm:text-sm"
//               /><br/>
//             <button
//               onClick={handleOnSubmit}
//               className="block px-4 py-2  font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500 sm:text-sm"
//             >
//               Login
//             </button><br/>
//            <Link to="/" className="mr-3">
//               Cancel
//               </Link>
           
//             <br/>

//       <Link to="/signup" className="mt-3">
//       <p> You are a new user ?</p> SignUp
//           </Link>
//         </div>
//   );
// };