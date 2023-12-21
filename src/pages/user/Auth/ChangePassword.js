import React, { useState } from 'react';
import instance from '../../../utils/Axios';
import { Typography, TextField, Button, Grid } from '@mui/material';
import {baseUrl} from "../../../utils/constants";

import { Link } from "react-router-dom";

import changePasswordApi from "../../../api/changePasswordApi"
import { ToastContainer, toast } from "react-toastify";


const ChangePassword = () => {
  const [errors, setErrors] = useState({});
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validation to exclude spaces in all fields
    if (
      oldPassword.trim() === "" ||
      password.trim() === "" ||
      confirmPassword.trim() === ""
    ) {
      setErrors({ general: "Please fill in all fields." });
      return;
    }

    if (password !== confirmPassword) {
      setErrors({
        confirm_password: "Password and Confirm Password do not match.",
      });
      return;
    }

    // Check for spaces in any of the fields
    if (
      oldPassword.includes(" ") ||
      password.includes(" ") ||
      confirmPassword.includes(" ")
    ) {
      setErrors({
        spaces: "Spaces are not allowed in any of the fields.",
      });
      return;
    }
    if (password.length < 8) {
        setErrors({
          password: "Password must be at least 8 characters long.",
        });
        return;
    }

    try {
      // Call the changePasswordApi function here
      await changePasswordApi(oldPassword, password);

      // Handle the response, e.g., show a success message
      toast.success("Password changed successfully!");

      // Optionally, you can reset the form fields here
      setOldPassword("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(error);

      // Handle errors, e.g., show an error message
      toast.error("An error occurred while changing the password.");
    }
  };

  // const [oldPassword, setOldPassword] = useState('');
  // const [password, setPassword] = useState('');
  // console.log(password,"newwwww");
  // const [confirmPassword, setConfirmPassword] = useState('');
  // console.log(confirmPassword,"confirmmmm");
  // const [errors, setError] = useState(null);
  // const [successMessage, setSuccessMessage] = useState('');

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError(null);
  //   setSuccessMessage('');

  //   if (password !== confirmPassword) {
  //     setError('Passwords do not match.');
  //     return;
  //   }

  //   try {
  //     const response = await instance.post(`${baseUrl}/api/change-password/`, {
  //       old_password: oldPassword,
  //       password: password,
  //     });

  //     setSuccessMessage(response.data.message);
  //     setOldPassword('');
  //     setPassword('');
  //     setConfirmPassword('');
  //   } catch (error) {
  //     if (error.response && error.response.data) {
  //       setError(error.response.data.detail || error.response.data.error || 'Something went wrong.');
  //     } else {
  //       setError('Something went wrong.');
  //     }
  //   }
  // };

  return (
    <>
    <main className="flex-1">
    <div className="relative mx-auto px-8 mt-16">
      <div className="pt-10 pb-16">

        
      <div className="mt-10 divide-y divide-gray-200">
                  <div className="space-y-1">
                    <h3 className="text-lg leading-6 font-medium text-[#4b2848]">
                      Change Password
                    </h3>
                    <p className="max-w-2xl text-sm text-gray-500">
                      Change your password.
                    </p>
                  </div>
                  <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6 public" onSubmit={onSubmit}>
                      <div>
                        <label
                          htmlFor="old_password"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Old Password
                        </label>
                        <div className="mt-2">
                          <input
                            id="old_password"
                            name="old_password"
                            onChange={(e) => setOldPassword(e.target.value)}
                            value={oldPassword}
                            type="password"
                            required
                            className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#92638f] sm:text-sm sm:leading-6"
                          />
                        </div>
                        {errors.confirm_password && (
                          <div className="text-red-600 text-sm">
                            {errors.confirm_password}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <label
                            htmlFor="password"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            New Password
                          </label>
                          <div className="text-sm"></div>
                        </div>
                        <div className="mt-2">
                          <input
                            id="password"
                            name="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            type="password"
                            required
                            className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#92638f] sm:text-sm sm:leading-6"
                          />
                        </div>
                        {errors.password && (
                          <div className="text-red-600 text-sm">
                            {errors.password}
                          </div>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="confirm_password"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Confirm New Password
                        </label>
                        <div className="mt-2">
                          <input
                            id="confirm_password"
                            name="confirm_password"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            value={confirmPassword}
                            type="password"
                            required
                            className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#92638f] sm:text-sm sm:leading-6"
                          />
                        </div>
                        {errors.confirm_password && (
                          <div className="text-red-600 text-sm">
                            {errors.confirm_password}
                          </div>
                        )}
                        {errors.spaces && (
                          <div className="text-red-600 text-sm">
                            {errors.spaces}
                          </div>
                        )}
                      </div>
                      <div>
                        <button
                          type="submit"
                          className="flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm bg-[#4d2c4d] hover:bg-[#92638f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4d2c4d]"
                        >
                          Change
                        </button>
                      </div>
                    </form>
                  </div>
                  </div>

      </div>
      </div>
      </main>
        </>
);
};
  export default ChangePassword;



{/* //     <Grid container spacing={2} justifyContent="center" >
//       <Grid item xs={12} sm={6} md={4}>
//         <Typography variant="h5" gutterBottom>Change Password</Typography>
//         <form onSubmit={handleSubmit}>
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={6} md={4}>
//               <TextField */}
{/* //                 label="Old Password"
//                 type="password"
//                 fullWidth
//                 value={oldPassword}
//                 onChange={(e) => setOldPassword(e.target.value)}
//                 required
//               />
//             </Grid>
//             <Grid item xs={12} sm={6} md={4}>
//               <TextField */}
//                 label="New Password"
//                 type="password"
//                 fullWidth
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//                 required
//               />
//             </Grid>
//             <Grid item xs={12} sm={6} md={4}>
//               <TextField
//                 label="Confirm New Password"
//                 type="password"
//                 fullWidth
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 required
//               />
//             </Grid>
//             <Grid item xs={12} sm={6} md={4}>
//               {error && <Typography variant="body1" color="error">{error}</Typography>}
//               {successMessage && 
//               <Typography variant="body1" color="green">
//                 {successMessage}
//                 </Typography>}
//             </Grid>
//             <Grid item xs={12} sm={6} md={4}>
//               <Button variant="contained" color="primary" type="submit">Change Password</Button>
//               <br/><br/>
//             </Grid>
//           </Grid>
//         </form>
//       </Grid>
//     </Grid>
//   );
// };






















// import { Box, TextField, Button, Alert, Typography } from '@mui/material';
// import { useState } from 'react';
// import { useSelector } from 'react-redux';
// import { useChangePasswordMutation } from '../../../redux/slices/userslices/userApiSlice';
// import { getToken } from '../../../redux/slices/userslices/LocalStorage';


// const ChangePassword = () => {
//   const [server_error, setServerError] = useState({})
//   const [server_msg, setServerMsg] = useState({})
//   const [changeUserPassword] = useChangePasswordMutation()
//   const { access_token } = getToken()

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const data = new FormData(event.currentTarget);
//     const actualData = {
//       password: data.get('password'),
//       password2: data.get('password2'),
//     }
//     const res = await changeUserPassword({ actualData, access_token })
//     if (res.error) {
//       setServerMsg({})
//       setServerError(res.error.data.errors)
//     }
//     if (res.data) {
//       console.log(res.data)
//       setServerError({})
//       setServerMsg(res.data)
//       document.getElementById("password-change-form").reset();
//     }

//   };
//   // Getting User Data from Redux Store
//   const myData = useSelector(state => state.auth)
//   // console.log("Change Password", myData)

//   return (
//   <>
//     {/* {server_error.non_field_errors ? console.log(server_error.non_field_errors[0]) : ""}
//     {server_error.password ? console.log(server_error.password[0]) : ""}
//     {server_error.password2 ? console.log(server_error.password2[0]) : ""} */}
//     <Box sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', maxWidth: 600, mx: 4 }}>
//       <h1>Change Password</h1>
//       <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }} id="password-change-form">
//         <TextField margin="normal" required fullWidth name="password" label="New Password" type="password" id="password" />
//         {server_error.password ? <Typography style={{ fontSize: 12, color: 'red', paddingLeft: 10 }}>{server_error.password[0]}</Typography> : ""}
//         <TextField margin="normal" required fullWidth name="password2" label="Confirm New Password" type="password" id="password2" />
//         {server_error.password2 ? <Typography style={{ fontSize: 12, color: 'red', paddingLeft: 10 }}>{server_error.password2[0]}</Typography> : ""}
//         <Box textAlign='center'>
//           <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2, px: 5 }}> Update </Button>
//         </Box>
//         {server_error.non_field_errors ? <Alert severity='error'>{server_error.non_field_errors[0]}</Alert> : ''}
//         {server_msg.msg ? <Alert severity='success'>{server_msg.msg}</Alert> : ''}
//       </Box>
//     </Box>
//   </>
//   )
// };

// export default ChangePassword;