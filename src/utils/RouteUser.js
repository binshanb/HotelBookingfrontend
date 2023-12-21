import {Outlet,Navigate} from 'react-router-dom'
import { useSelector } from 'react-redux'

const RouteUser = ()=>{
    const {userInfo} = useSelector(state=>state.auth)
    console.log(userInfo,'000000000000000000000')
    return(
        userInfo? <Outlet/>:<Navigate to ='/login'/>
    )
}

export default RouteUser