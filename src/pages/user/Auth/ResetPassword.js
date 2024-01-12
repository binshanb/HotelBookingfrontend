import React, { useState } from 'react';
import instance from '../../../utils/Axios';
import { Avatar, Button, TextField, Grid, Typography, Container } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import resetPasswordApi from '../../../api/resetPasswordAPI';
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
    margin: theme.spacing(5, 0, 2),
  },
}));

const ResetPassword = () => {
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
      await resetPasswordApi(oldPassword, password);

      // Handle the response, e.g., show a success message
      toast.success("Password reset successfully!");

      // Optionally, you can reset the form fields here
      setOldPassword("");
      setPassword("");
      setConfirmPassword("");
      navigate('/login')
    } catch (error) {
      console.error(error);

      // Handle errors, e.g., show an error message
      toast.error("An error occurred while resetting the password.");
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
          Reset Password
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
            Submit
          </Button>
        </form>
      </div>
    </Container>
  )
              };
  export default ResetPassword;