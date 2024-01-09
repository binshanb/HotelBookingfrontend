import React, { useState,useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import jwtDecode from 'jwt-decode';
import { useSelector } from 'react-redux';
import instance from '../../../utils/Axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  formContainer: {
    padding: theme.spacing(2),
  },
  textField: {
    marginBottom: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
  },
}));

const AddProfile = () => {
  const classes = useStyles();
  const userInfos = useSelector((state) => state.auth.userInfo);
  const [decodedUserInfo, setDecodedUserInfo] = useState({});
  const [formData, setFormData] = useState({
    user:decodedUserInfo.user_id,
    name: '',
    address: '',
    city: '',
    state: '',
    country: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async () => {
    try {
      await instance.post('/api/user/add-profile/', formData);
      showToast('Profile details added', 'success');
    } catch (error) {
      showToast('Error adding user details', 'error');
      console.error('Error adding profile details', error);
    }
  };
  useEffect(() => {
    console.log('decodedUserInfo:', decodedUserInfo); // Log decodedUserInfo
    if (decodedUserInfo && decodedUserInfo.user_id) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        user: decodedUserInfo.user_id,
      }));
    }
  }, [decodedUserInfo]);
  useEffect(() => {
    if (userInfos) {
      // Decode the token and set the user info state
      const decodedInfo = jwtDecode(userInfos.access); // Assuming 'access' contains user details
      setDecodedUserInfo(decodedInfo);
    }},[]);
    const showToast = (message, type = 'error') => {
      toast[type](message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    };
  

  return (
    <div className={classes.root}>
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={8} md={6}>
          <div className={classes.formContainer}>
          <Typography variant="h5" gutterBottom>
              Add Profile Information
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                id="name"
                label="Full Name"
                variant="outlined"
                fullWidth
                value={formData.name}
                onChange={handleChange}
                margin="normal"
                className={classes.textField}
              />
              <TextField
                id="address"
                label="Address"
                variant="outlined"
                fullWidth
                value={formData.address}
                onChange={handleChange}
                margin="normal"
                className={classes.textField}
              />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id="city"
                    label="City"
                    variant="outlined"
                    fullWidth
                    value={formData.city}
                    onChange={handleChange}
                    margin="normal"
                    className={classes.textField}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id="state"
                    label="State"
                    variant="outlined"
                    fullWidth
                    value={formData.state}
                    onChange={handleChange}
                    margin="normal"
                    className={classes.textField}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id="country"
                    label="Country"
                    variant="outlined"
                    fullWidth
                    value={formData.country}
                    onChange={handleChange}
                    margin="normal"
                    className={classes.textField}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.button}
              >
                Submit
              </Button>
            </form>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default AddProfile;
