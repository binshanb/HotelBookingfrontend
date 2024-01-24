// ReviewList.js
import React, { useState, useEffect } from 'react';
import profileImg from '../../../assets/profile-img.jpg';

import instance from '../../../utils/Axios';


import { baseUrl } from '../../../utils/constants';
import jwtDecode from 'jwt-decode';

import { useSelector } from 'react-redux';



const ReviewList = () => {
  
    const user = useSelector((state) => state.auth.userInfo);
    const [decodedUserInfo, setDecodedUserInfo] = useState({});
    const rooms = useSelector((state)=> state.room.roomInfo);
    const roomId = rooms.id
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
        <h4 className="text-2xl font-bold text-primary-main border-b-4 border-gray-500 inline-block">Room Reviews</h4>
        <div className="border border-gray-300 p-4 rounded-md">
  {reviews.map((review, index) => (
    <React.Fragment key={index}>
      <div className="flex items-start mb-4">
        <img
          src={profileImg}
          alt="Avatar"
          className="w-10 h-10 rounded-full object-cover mr-4"
        />
        <div>
          <p className="text-lg font-bold">{userName}</p>
          <div className="flex items-center">
            {/* Displaying star ratings (replace this with your actual rating component) */}
            <div className="flex text-yellow-500">
              {[...Array(Math.floor(review.rating))].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4 mr-1"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 1l2.45 6.297h6.305l-5.112 4.898L14.55 19 10 15.594 5.45 19l1.357-7.805L0 7.297h6.305L10 1z"
                    clipRule="evenodd"
                  />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-500 ml-1">({review.rating})</span>
          </div>
          <p className="text-gray-700">{review.comment}</p>
        </div>
      </div>
      {index !== reviews.length - 1 && <hr className="border-gray-500" />}
    </React.Fragment>
  ))}
</div>

      </div>
      
    );
};

export default ReviewList;

