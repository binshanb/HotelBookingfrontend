import React from 'react'
import ResetPassword from '../../../api/ResetPassword'
import {useSelector} from  'react-redux'


function ResetPasswordUser() {
  const accessToken = useSelector((state) => state.auth.userInfo);
  return (
    
    <div style={{display :"flex"}}>
    <ResetPassword accessToken={accessToken} />
    </div>
    
  )
}

export default ResetPasswordUser