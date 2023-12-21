import React,{ useState } from "react";
import { useDispatch } from "react-redux";
import  {adminLogout}  from "../../redux/slices/adminslices/adminAuthSlice"; // Import the admin logout action
import { useNavigate } from "react-router-dom";
import {FaSignOutAlt } from 'react-icons/fa';


function AdminLogout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isIconsOnly, setIsIconsOnly] = useState(false);

  const toggleIconsOnly = () => {
    setIsIconsOnly(!isIconsOnly);
  };
  const handleAdminLogout = () => {
    // Dispatch the action to clear admin credentials
    dispatch(adminLogout());
    navigate("/admin"); // Navigate to the admin login page after admin logout
  };

  return (
    <li className=" logout-button" onClick={handleAdminLogout}>
      <FaSignOutAlt className="my-1 sidebar-icon" />
      <span className={`menu-text ${isIconsOnly ? "hidden" : ""}`}>Logout</span>
    </li>
  );
}

export default AdminLogout;
