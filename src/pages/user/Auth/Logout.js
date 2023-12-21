// Import the necessary actions
import React from "react";
import {MdOutlineLogout} from 'react-icons/md';
import { useDispatch } from "react-redux";
import {logout } from "../../../redux/slices/userslices/authSlice";
import { useNavigate } from "react-router-dom";

function Logout () {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {

    // Dispatch the action to clear user credentials
    dispatch(logout());

    navigate("/login");
  };


  return (
  
    <button onClick={handleLogout} className="logout-button"><MdOutlineLogout /></button>
  
  
  );

};

export default Logout;