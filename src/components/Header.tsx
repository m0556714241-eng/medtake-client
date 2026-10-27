import { Link, NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../context/useAuth"
import Button from "@mui/material/Button"

const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
        ? "px-4 py-2 rounded-full bg-primary/10 text-primary font-bold"
        : "px-4 py-2 rounded-full text-gray-600 hover:text-primary"

const Header = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate("/login", { replace: true })
    }

    return (
        <header className="flex items-center gap-4 px-6 py-3 bg-white shadow-sm">
            <Link to="/" className="text-xl font-extrabold text-primary">
                MedTake
            </Link>

            {user && (
                <>
                    <nav className="flex gap-1">
                        {user.role === "caregiver" ? (
                            <NavLink to="/manager" className={linkClass}>ניהול</NavLink>
                        ) : (
                            <NavLink to="/my-medicines" className={linkClass}>התרופות שלי</NavLink>
                        )}
                    </nav>

                    <div className="flex-1" />

                    <span>{user.fullName}</span>
                    <Button variant="text" onClick={handleLogout}>יציאה</Button>
                </>
            )}
        </header>
    )
}
export default Header
