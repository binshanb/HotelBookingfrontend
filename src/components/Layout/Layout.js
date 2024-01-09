import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Routers from "../../routes/Routers";
import { useLocation } from "react-router-dom"; // Its mainly used for finding preferd location
import AdminSidebar from "../SideBar/AdminSidebar";

import Footer from "../../components/Footer/Footer";
import { createTheme, ThemeProvider } from '@mui/material/styles';


function Layout() {
  let location = useLocation();
  const theme = createTheme({
    typography: {
      fontFamily:'Roboto, sans-serif',
     
    },
  });
  
  let adminHeader = location.pathname.startsWith("/admin");
  return (
    <>
    <ThemeProvider theme={theme}>
      {
            
        
        adminHeader ? (
          <AdminSidebar />
        ) : (
          <Navbar />
          
        ) // Its mainly used for checking its navbar user or admin
      }

      <Routers />

      {
        adminHeader ? (
          " "
        ) : (
          <Footer />

    
          
        ) // Its mainly used for checking its navbar user or admin
      }

     



    
       
</ThemeProvider>

    </>
  );
}

export default Layout;