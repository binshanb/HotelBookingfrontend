import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Routers from "../../routes/Routers";
import { useLocation } from "react-router-dom"; // Its mainly used for finding preferd location
import AdminSidebar from "../SideBar/AdminSidebar";

import Footer from "../../components/Footer/Footer";


function Layout() {
  let location = useLocation();
  
  let adminHeader = location.pathname.startsWith("/admin");
  return (
    <>
      {
        adminHeader ? (
          <AdminSidebar />
        ) : (
          <Navbar />
          
        ) // Its mainly used for checking its navbar user or admin
      }

      <Routers />

      <Footer/>


    </>
  );
}

export default Layout;