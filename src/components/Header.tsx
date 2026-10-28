import { Link, NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../context/useAuth"
import Button from "@mui/material/Button"
import LowStockAlerts from "./LowStockAlerts"
import SendMessage from "./SendMessage"
import MessagesInbox from "./MessagesInbox"

const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
        ? "px-4 py-2 rounded-full bg-primary-soft text-primary-dark font-bold no-underline"
        : "px-4 py-2 rounded-full text-muted hover:text-primary no-underline"

const Header = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate("/login", { replace: true })
    }

    return (
        <header className="px-4 pt-4 sm:px-8">
            <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-3 rounded-[22px] border border-white/90 bg-white/80 px-4 py-2 shadow-[0_12px_30px_-18px_rgba(33,78,72,.35)] backdrop-blur">
            <Link to="/" className="flex items-center gap-2 text-[21px] font-extrabold text-ink no-underline">
                <span className="grid h-[38px] w-[38px] place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-dark">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><rect x="3" y="8" width="18" height="8" rx="4" transform="rotate(-35 12 12)"></rect><line x1="9.2" y1="8" x2="14.8" y2="16"></line></svg>
                </span>
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

                    {user.role === "patient" ? <SendMessage /> : <MessagesInbox />} {/* שונה: למטופל "הודעה למטפל", למטפלת תיבת ההודעות */}
                    <LowStockAlerts /> {/* תוקן: הפעמון נוסף ל-Header */}
                    <span className="flex items-center gap-2">
                        <span className="grid h-[38px] w-[38px] place-items-center rounded-full bg-gradient-to-br from-primary-soft to-[#B9D6C8] font-extrabold text-primary-dark">
                            {user.fullName.charAt(0)}
                        </span>
                        <span className="hidden font-medium sm:inline">{user.fullName}</span>
                    </span>
                    <Button variant="text" onClick={handleLogout} sx={{ color: 'text.secondary' }}>יציאה</Button>
                </>
            )}
            </div>
        </header>
    )
}
export default Header
