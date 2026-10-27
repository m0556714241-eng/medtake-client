import { Navigate } from "react-router-dom"
import { useAuth } from "../context/useAuth"

const HomeRedirect = () => {
    const { user, isLoading } = useAuth()

    if (isLoading) {
        return <p>טוען...</p>
    }
    if (!user) {
        return <Navigate to="/login" replace></Navigate>
    }
    if (user.role === 'caregiver') {
        return <Navigate to="/manager" replace></Navigate>
    }
    return <Navigate to="/my-medicines" replace></Navigate>

}
export default HomeRedirect