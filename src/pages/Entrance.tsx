import { useState } from "react"
import Login from "../components/Login"
import Register from "../components/Register"
import Paper from "@mui/material/Paper"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup" // שונה: מתג גלולה במקום Tabs – כמו בהדמיה
import ToggleButton from "@mui/material/ToggleButton"
type Mode = "login" | "register"

// עיצוב: התגיות הקטנות בכרטיס הירוק
const features = ['תזכורת יומית', 'פיקוח של בן המשפחה', 'התראת מלאי']

const Entrance = () => {
    
    const [show,setShow]=useState<Mode>("login")
    return (
        <div className="flex flex-col items-center">
    {/* עיצוב: רצועה ירוקה רחבה עם כותרת, תגיות וציור – כמו בהדמיה של מסך הכניסה */}
    <section className="w-full rounded-[40px] bg-gradient-to-br from-primary via-[#2C6358] to-primary-dark px-8 pb-28 pt-9 text-white">
        <div className="mx-auto flex max-w-[1000px] flex-wrap items-center justify-between gap-8">
            <div className="flex min-w-0 flex-[1_1_380px] flex-col gap-3">
                <h1 className="m-0 text-[40px] font-extrabold leading-tight">כל התרופות במקום אחד</h1>
                <p className="m-0 max-w-[460px] text-[19px] opacity-90">מה צריך לקחת היום, מה כבר נלקח, ומתי הגיע הזמן לחדש מלאי.</p>
                <div className="mt-1 flex flex-wrap gap-2">
                    {features.map(feature => (
                        <span key={feature} className="rounded-full bg-white/15 px-4 py-1.5 text-sm">{feature}</span>
                    ))}
                </div>
            </div>
            {/* ציור דקורטיבי של לוח תרופות – מוסתר מקוראי מסך */}
            <svg width="300" height="190" viewBox="0 0 300 190" aria-hidden="true" className="max-w-full flex-none">
                <rect x="40" y="20" width="220" height="150" rx="26" fill="rgba(255,255,255,.12)" />
                <rect x="62" y="44" width="176" height="20" rx="10" fill="rgba(255,255,255,.22)" />
                <g fill="rgba(255,255,255,.9)">
                    <circle cx="80" cy="96" r="13" /><circle cx="122" cy="96" r="13" /><circle cx="164" cy="96" r="13" /><circle cx="206" cy="96" r="13" />
                </g>
                <g fill="rgba(255,255,255,.28)"><circle cx="80" cy="138" r="13" /><circle cx="122" cy="138" r="13" /></g>
                <g fill="#F6C99A"><circle cx="164" cy="138" r="13" /><circle cx="206" cy="138" r="13" /></g>
                <g transform="rotate(-30 262 40)">
                    <rect x="236" y="28" width="56" height="24" rx="12" fill="#FFFFFF" />
                    <rect x="264" y="28" width="28" height="24" rx="12" fill="#DDEBE3" />
                </g>
            </svg>
        </div>
    </section>
    {/* עיצוב: הכרטיס הלבן "עולה" על הרצועה הירוקה (-mt-20), ופינות מעוגלות פחות */}
    <Paper className="relative -mt-20 w-full max-w-md p-8" sx={{ borderRadius: '28px', boxShadow: '0 1px 2px rgba(33,78,72,.06), 0 24px 48px -20px rgba(33,78,72,.28)' }}>
        <ToggleButtonGroup
            value={show}
            exclusive
            fullWidth
            onChange={(_, val: Mode | null) => { if (val) setShow(val) }}
            className="mb-4"
        >
            <ToggleButton value="login">התחברות</ToggleButton>
            <ToggleButton value="register">הרשמה כמטפל</ToggleButton>
        </ToggleButtonGroup>
        {/* עיצוב: משפט פתיחה לפי הלשונית – כמו בהדמיה */}
        <p className="m-0 mb-5 text-[15px] text-muted">
            {show === "login" ? 'ברוכים השבים' : 'אחרי ההרשמה תוסיפו את המטופלים שלכם'}
        </p>

        {show === "login" ? <Login /> : <Register />}
    </Paper>
</div>
    )
}
export default Entrance
