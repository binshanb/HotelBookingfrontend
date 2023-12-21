import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import instance from '../../../utils/Axios';
import { toast } from 'react-toastify';
import { baseUrl } from '../../../utils/constants';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  button: {
    margin: theme.spacing(1),
  },
}));

function AddProfile() {
  const classes = useStyles();
  const [formData, setFormData] = useState({
    first_name: '',
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
      await instance.post(`${baseUrl}/api/user/add-profile/`, formData);
      showToast('Profile details added', 'success');
    } catch (error) {
      showToast('Error adding user details', 'error');
      console.error('Error adding profile details', error);
    }
  };

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
    <form className={classes.root}>
      <div>
      <Typography variant="h5" gutterBottom>
        User Information
      </Typography>
        <TextField
          id="first_name"
          label="Full Name"
          variant="outlined"
          value={formData.first_name}
          onChange={handleChange}
        />
        <TextField
          id="address"
          label="Address"
          variant="outlined"
          value={formData.address}
          onChange={handleChange}
        />
      </div>
      <div>
        <TextField
          id="city"
          label="City"
          variant="outlined"
          value={formData.city}
          onChange={handleChange}
        />
        <TextField
          id="state"
          label="State"
          variant="outlined"
          value={formData.state}
          onChange={handleChange}
        />
        <TextField
          id="country"
          label="Country"
          variant="outlined"
          value={formData.country}
          onChange={handleChange}
        />
      </div>
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        onClick={handleSubmit}
      >
        Add Profile
      </Button>
    </form>
  );
}

export default AddProfile;
