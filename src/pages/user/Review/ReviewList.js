// ReviewList.js
import React, { useState, useEffect } from 'react';
import instance from '../../../utils/Axios';
import { makeStyles } from '@material-ui/core/styles';
import {
    List,
    ListItem,
    ListItemText,
    Typography,
    Paper,
    Divider
} from '@material-ui/core';
import Avatar from '@mui/material/Avatar';

import { baseUrl } from '../../../utils/constants';
import jwtDecode from 'jwt-decode';

import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
    reviewContainer: {
        padding: theme.spacing(2),
        margin: theme.spacing(2),
        borderRadius: theme.spacing(1),
        boxShadow: `0 4px 8px ${theme.palette.primary.light}`,
    },
    reviewItem: {
        marginBottom: theme.spacing(2),
    },
}));

const ReviewList = () => {
  
    const user = useSelector((state) => state.auth.userInfo);
    const [decodedUserInfo, setDecodedUserInfo] = useState({});
    const rooms = useSelector((state)=> state.room.roomInfo);
    const roomId = rooms.id
    const classes = useStyles();
    const [reviews, setReviews] = useState([]);
    console.log(reviews,"reviews");

    const fetchRoomReviews = async () => {
        try {
            const response = await instance.get(`${baseUrl}/api/booking/room-reviews/${roomId}/`);
            setReviews(response.data); // Update reviews state with fetched data
            console.log(response.data,"dataaaaaaaaaaa");
        } catch (error) {
            console.error('Error fetching room reviews:', error);
        }
    };
    useEffect(() => {
      if (user) {
        // Decode the token and set the user info state
        const decodedInfo = jwtDecode(user.access); // Assuming 'access' contains user details
        setDecodedUserInfo(decodedInfo);
      }},[user]);

    useEffect(() => {
        if (roomId) {
            fetchRoomReviews();
        }
    }, [roomId]);
    const userName =decodedUserInfo.email
    return (
        <div>
            <Typography variant="h6" gutterBottom>
                Room Reviews
            </Typography>
            <Paper className={classes.reviewContainer}>
                <List>
                    {reviews.map((review, index) => (
                        <React.Fragment key={index}>
                            <ListItem alignItems="flex-start" className={classes.reviewItem}>
                            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          </Avatar> <ListItemText
                                    primary={`${userName}`} // Replace with your user field
                                    secondary={
                                        <React.Fragment>
                                            <Typography component="span" variant="body2" color="textPrimary">
                                                Rating: {review.rating}
                                            </Typography>
                                            <br />
                                            Comment: {review.comment}
                                        </React.Fragment>
                                    }
                                />
                            </ListItem>
                            {index !== reviews.length - 1 && <Divider />}
                        </React.Fragment>
                    ))}
                </List>
            </Paper>
        </div>
    );
};

export default ReviewList;

