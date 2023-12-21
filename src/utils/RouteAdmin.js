import {Outlet,Navigate} from 'react-router-dom'
import React from 'react'

import { useSelector } from 'react-redux'

function RouteAdmin() {

  const {adminInfo}=useSelector((state)=>state.adminAuth);
  return (

    adminInfo? <Outlet/>:<Navigate to='/admin' />
  )
}


export default RouteAdmin