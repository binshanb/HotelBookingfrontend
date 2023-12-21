// AdminSidebar.js
import React, { useState } from 'react';
import './AdminSidebar.css';
import AdminHeader from '../Header/AdminHeader';
import { FaHome, FaUser, FaHotel, FaBook, FaMoneyBillAlt, FaChartBar, FaEnvelope,FaSignOutAlt } from 'react-icons/fa';
import { NavLink,useNavigate } from 'react-router-dom';
import { HiOutlineCurrencyRupee } from 'react-icons/hi';
import { adminLogout } from '../../redux/slices/adminslices/adminAuthSlice'
import { useDispatch, useSelector } from 'react-redux';
import { toast} from 'react-toastify';

function AdminSidebar() {
  const [isIconsOnly, setIsIconsOnly] = useState(false);

  const toggleIconsOnly = () => {
    setIsIconsOnly(!isIconsOnly);
  };
  const { adminInfo } = useSelector((state) => state.adminAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      // const authToken = adminInfo.refresh;
      // const response = await adminInstance.post('/logout/');
      dispatch(adminLogout());
      
      showToast('Logout successfully','success')
      navigate('/admin')
    } catch (error) {
      console.error('Logout failed', error);
      showToast("Logout failed", 'error');

    }
  };
  const showToast = (message, type = 'error') => {
    toast[type](message, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000, // 3 seconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      
    });
  };
  return (
    <>
      <AdminHeader />
      
      <aside className={`admin-sidebar ${isIconsOnly ? 'icons-only' : ''} w-24 sm:w-36 lg:w-44`}>
        <div className="toggle-button" onClick={toggleIconsOnly}>
          {isIconsOnly ? '☰' : '✖'}
        </div>
        <ul>
          <NavLink to='/admin/dashboard' className="active-link" style={{ textDecoration: 'none', color: 'black' }}>
            <li>
              <FaHome className="sidebar-icon" />
              <span className={`menu-text ${isIconsOnly ? 'hidden' : ''}`}>Dashboard</span>
            </li>
          </NavLink>
          <NavLink to='/admin/usermanagement' className="active-link" style={{ textDecoration: 'none', color: 'black' }}>
            <li>
              <FaUser className={`sidebar-icon ${isIconsOnly ? 'hidden' : ''}`} />
              <span className={`menu-text ${isIconsOnly ? 'hidden' : ''}`}>User Management</span>
            </li>
          </NavLink>
          <NavLink to='/admin/room-category' className="active-link" style={{ textDecoration: 'none', color: 'black' }}>
            <li>
              <FaHotel className={`sidebar-icon ${isIconsOnly ? 'hidden' : ''}`} />
              <span className={`menu-text ${isIconsOnly ? 'hidden' : ''}`}>Room Types</span>
            </li>
          </NavLink>
          <NavLink to='/admin/room-list' className="active-link" style={{ textDecoration: 'none', color: 'black' }}>
          <li>
            <HiOutlineCurrencyRupee className={`sidebar-icon ${isIconsOnly ? 'hidden' : ''}`} />
            <span className={`menu-text ${isIconsOnly ? 'hidden' : ''}`}>Room List</span>
          </li>
          </NavLink>
          <NavLink to='/admin/room-feature' className="active-link" style={{ textDecoration: 'none', color: 'black' }}>
          <li>
            <FaBook className={`sidebar-icon ${isIconsOnly ? 'hidden' : ''}`} />
            <span className={`menu-text ${isIconsOnly ? 'hidden' : ''}`}>Features</span>
          </li>
          </NavLink>
      
          <NavLink to='/admin/booking-list/' className="active-link" style={{ textDecoration: 'none', color: 'black' }}>
          <li>
            <FaMoneyBillAlt className={`sidebar-icon ${isIconsOnly ? 'hidden' : ''}`} />
            <span className={`menu-text ${isIconsOnly ? 'hidden' : ''}`}>Booking List</span>
          </li>
          </NavLink>
          {/* New li tags with corresponding icons */}
          <NavLink to='/admin/booking-report' className="active-link" style={{ textDecoration: 'none', color: 'black' }}>
          <li>
            <FaChartBar className={`sidebar-icon ${isIconsOnly ? 'hidden' : ''}`} />
            <span className={`menu-text ${isIconsOnly ? 'hidden' : ''}`}>Booking Report</span>
          </li>
          </NavLink>
          <NavLink to='/adminchat-messages' className="active-link" style={{ textDecoration: 'none', color: 'black' }}>
          <li>
              <FaEnvelope className={`sidebar-icon ${isIconsOnly ? "" : ""}`} />
              <span className={`menu-text ${isIconsOnly ? "hidden" : ""}`}>
                Messages
              </span>
            </li> 
            </NavLink>
          {/* <NavLink to='/admin/booking-payment' className="active-link" style={{ textDecoration: 'none', color: 'black' }}>
          <li>
            <FaEnvelope className={`sidebar-icon ${isIconsOnly ? 'hidden' : ''}`} />
            <span className={`menu-text ${isIconsOnly ? 'hidden' : ''}`}>Messages</span>
          </li>
          </NavLink> */}
          <li className="logout-button" onClick={handleLogout}>
              <FaSignOutAlt className="sidebar-icon" />
              <span className={`menu-text ${isIconsOnly ? 'hidden' : ''}`}>Logout</span>
            </li>
         
         
          
        </ul>
      </aside>
    </>
  );
}

export default AdminSidebar;
