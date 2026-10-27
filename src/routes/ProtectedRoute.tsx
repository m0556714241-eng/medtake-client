import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth"
import type { UserRole } from "../types"

interface ProtectedRouteProp{
    role? :UserRole
}
const ProtectedRoute=({role}:ProtectedRouteProp)=>{
    const {user,token,isLoading}=useAuth();
    if(isLoading)
    {
        return<p>טוען...</p>
    }
    if(!token){
        return <Navigate to="/login" replace/>
    }
    if(role&&user&&user.role!=role){
        if(user.role=='patient')
        {
            return <Navigate to="/my-medicines" replace/>
        }
        return <Navigate to="/manager" replace/>
    }
      return <Outlet />
}
export default ProtectedRoute
