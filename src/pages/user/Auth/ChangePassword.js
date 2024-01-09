import React, { useState } from 'react';
import instance from '../../../utils/Axios';
import { Avatar, Button, TextField, Grid, Typography, Container } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import changePasswordApi from "../../../api/changePasswordApi"
import { ToastContainer, toast } from "react-toastify";
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', 
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const ChangePassword = () => {
  const classes = useStyles();

  const [errors, setErrors] = useState({});
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

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
      navigate('/login')
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
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Change Password
        </Typography>
        <form className={classes.form} onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="old_password"
                label="Old Password"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              {errors.old_password && (
                <Typography variant="caption" color="error">
                  {errors.old_password}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="New Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <Typography variant="caption" color="error">
                  {errors.password}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="confirm_password"
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {errors.confirm_password && (
                <Typography variant="caption" color="error">
                  {errors.confirm_password}
                </Typography>
              )}
              {errors.spaces && (
                <Typography variant="caption" color="error">
                  {errors.spaces}
                </Typography>
              )}
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Change
          </Button>
        </form>
      </div>
    </Container>
  )
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