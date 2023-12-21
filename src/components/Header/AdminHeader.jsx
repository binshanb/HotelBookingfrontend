// AdminHeader.js
import React from 'react';
import '../../components/Header/AdminHeader.css';
import { FaSearch } from 'react-icons/fa';
import img from "../../assets/logo7.png";

function AdminHeader() {
  return (
    <header className="bg-gray-300 p-2 sm:p-4 flex justify-between items-center">
      {/* Decrease the padding top and bottom (p-2), or use sm:p-2 for smaller screens */}
      <div className="logo">
        <img src={img} alt="Logo" className="w-20" />
      </div>
      <div className="text-center text-white">
        <h1 className="text-2xl font-bold">ADMIN PANEL</h1>
      </div>
      <div className="profile-container">
        {/* Image added as a background to the profile-image div */}
        <div className="profile-image" style={{ backgroundImage: "url('https://imgv3.fotor.com/images/blog-cover-image/10-profile-picture-ideas-to-make-you-stand-out.jpg')" }}></div>
      </div>
     
    </header>
  );
}

export default AdminHeader;