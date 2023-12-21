import React, { useState } from 'react';
import { Button, Grid,Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { adminInstance } from '../../../utils/Axios';
import { createTheme} from '@mui/material/styles';

const theme = createTheme();
const useStyles = makeStyles((theme) => ({
    input: {
      display: 'none',
    },
    button: {
      marginTop: theme.spacing,
    },
  }));

const RoomImages = ({ roomId }) => {
  const classes = useStyles();
  const [selectedImages, setSelectedImages] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
  };

  const handleImageUpload = async () => {
    const formData = new FormData();
    selectedImages.forEach((image) => {
      formData.append('images', image);
    });

    try {
      await adminInstance.post(`/api/booking/admin/room-images/?room=${roomId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Handle success or any additional logic
    } catch (error) {
      // Handle error scenario
    }
  };

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <Typography variant="h6">Upload Images for the Room</Typography>
      </Grid>
      <Grid item>
  <input
    accept="image/*"
    id="contained-button-file"
    multiple
    type="file"
    onChange={handleImageChange}
    style={{ display: 'none' }} // Add this inline style
  />
  <label htmlFor="contained-button-file">
    <Button variant="contained" component="span">
      Choose Images
    </Button>
  </label>
</Grid>


      <Grid item>
        <Button
          variant="contained"
          color="primary"
          onClick={handleImageUpload}
          disabled={selectedImages.length === 0}
          className={classes.button}
        >
          Upload Images
        </Button>
      </Grid>
    </Grid>
  );
};

export default RoomImages;


