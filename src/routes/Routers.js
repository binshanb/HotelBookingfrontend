import React from 'react'
import {Routes,Route} from 'react-router-dom'
import AdminDashboard from '../pages/admin/AdminDashBoard'
import HomePage from '../pages/user/Home/HomePage'
import RouteUser from '../utils/RouteUser'
import RouteAdmin from  '../utils/RouteAdmin'
import Login from '../pages/user/Auth/Login'
import Register from '../pages/user/Auth/Register'
import AdminLogin from '../pages/admin/AdminLogin'
import UserManagement from '../pages/admin/UserManagement'
import Logout from '../pages/user/Auth/Logout'
import AdminLogout from '../pages/admin/AdminLogout'
import UserProfile from '../pages/user/Profile/UserProfile'
import EditProfile from '../pages/user/Profile/EditProfile'
import CategoryList from '../pages/user/Rooms/CategoryList'
import Services from '../pages/user/Services/Services'
import About from '../pages/user/About/About'
import Contact from '../pages/user/Contact/Contact'
import RoomCategory from '../pages/admin/RoomCategories/RoomCategory'
import RoomList from '../pages/admin/RoomCategories/RoomList'
import RoomListUser from '../pages/user/Rooms/RoomListUser'
import RoomDetail from '../pages/user/Rooms/RoomDetail'
import BookingForm from '../components/Bookings/BookingForm'
import BookingPage from '../pages/user/Bookings/BookingPage'
import BookingList from '../pages/admin/Booking/BookingList'
import RoomFeatureList from '../pages/admin/Features/RoomFeatureList'
import RoomFilter from '../pages/user/Rooms/RoomFilter';
import BookingSuccessPage from '../pages/user/Bookings/BookingSuccessPage'
import MyBookings from '../pages/user/Profile/MyBookings'
import CancelMyBooking from '../pages/user/Profile/CancelMyBooking'
import AvailableRoomsPage from '../pages/user/Bookings/AvailableRoomsPage'
import Reviews from '../pages/user/Review/Reviews'
import ReviewList from '../pages/user/Review/ReviewList'
import ResetPasswordWrapper from '../pages/user/Auth/ResetPassword'
import ForgotPassword from '../pages/user/Auth/ForgotPassword'
import ChatPage from '../pages/Chat/ChatPage'
import AdminChat from '../pages/Chat/AdminChat'

import BookingReport from '../pages/admin/Booking/BookingReport'
import ChangePassword from '../pages/user/Auth/ChangePassword'
import WalletDetails from '../pages/user/Wallet/WalletDetails'
import OtpLogin from '../pages/user/OTP/OtpLogin'
import OtpVerify from '../pages/user/OTP/OtpVerify'









const Routers = () => {
  return (

    
  
    <Routes>

         {/* <------- User Routes -------> */} 
        
         
      <Route path='/signup' element={<Register />} />
      <Route path='/login' element={<Login/>} />
      
      <Route path='/forgot-password' element={<ForgotPassword/>} />
      <Route path='/change-password' element={<ChangePassword />} />
      <Route path="/otp-sent" element={<OtpLogin/>}/>
      <Route path="/otp-verify" element={<OtpVerify/>}/>
      <Route path="/" element={<HomePage/>}/>
      <Route path='' element={<RouteUser/>} >
        
         
        <Route path='/user/user-profile' element={<UserProfile/>} />
       
        <Route path='/user/update-profile/:user_id' element={<EditProfile/>} />
        
        <Route path='/logout' element={<Logout/>} />

     
        <Route path='/reset-password-confirm/:uid/:token' element={< ResetPasswordWrapper/>} />
        
        <Route path='/chat-messages' element={<ChatPage/>} ></Route>
 
    



         {/* <-----------Rooms------------> */}

        <Route path='/categorylist' element={<CategoryList/>} />
        <Route path='/roomlistuser' element={<RoomListUser/>} />
        <Route path='/services' element={<Services/>} /> 
        <Route path='/about' element={<About/>} />
        <Route path='/contact' element={<Contact/>} />
        <Route path='/room-detail/:id' element={<RoomDetail/>} />
        <Route path='/room-filter' element={<RoomFilter/>} />
  

        
        


        {/* <-----------Booking------------> */}


        <Route path='/get-available-rooms' element={<AvailableRoomsPage/>} />
        <Route path='/add-roombooking' element={<BookingForm/>} />
        <Route path='/roombooking-page' element={<BookingPage/>} />
        <Route path='/booking-success' element={<BookingSuccessPage/>} />
        <Route path='/my-bookings/:user_id' element={<MyBookings/>} />
        <Route path='/booking-report' element={<BookingReport/>} />

        <Route path='/add-review/:roomId' element={<Reviews/>} />
        <Route path='/reviews' element={<ReviewList/>} />
        <Route path='/wallet/:userId' element={<WalletDetails/>} />

        
        <Route path='/roombooking-page/cancel-booking/:bookingId' element={<CancelMyBooking/>} />
        
    </Route>
      



       

        {/* <------- Admin Routes -------> */}
        
        
    
      
      
      
    
      <Route path="/admin" element={<AdminLogin/>} />
      <Route path="" element={<RouteAdmin />} >
      <Route path="/admin/ad-logout" element={<AdminLogout />} /> 
      
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path='/admin/usermanagement' element={<UserManagement />} />
        <Route path='/admin/room-category' element={<RoomCategory/>} />
        <Route path='/admin/room-list' element={<RoomList/>} />
        <Route path='/admin/room-feature' element={<RoomFeatureList/>} />
        <Route path='/admin/booking-list' element= {<BookingList/>} />
        
        <Route path='/admin/booking-report' element= {<BookingReport/>} />
        <Route path='/adminchat-messages' element={<AdminChat/>} />


      


      </Route>
            
    </Routes>
   
   )
 }
 
 export default Routers;
      

       
        
        
       

        
