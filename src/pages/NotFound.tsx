import Paper from "@mui/material/Paper"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import { Link } from "react-router-dom"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"

const NotFound = () => {
    return (
        <div className="min-h-[70vh] flex items-center justify-center p-6">
            <Paper
                className="w-full max-w-lg p-12 flex flex-col items-center gap-4 text-center"
                // עיצוב: כרטיס לבן-שקוף עם צל גדול ורך ופינות עגולות יותר – כמו בהדמיה
                sx={{ borderRadius: '36px', bgcolor: 'rgba(255,255,255,.85)', border: '1px solid rgba(255,255,255,.95)', boxShadow: '0 30px 60px -34px rgba(33,78,72,.55)' }}
            >
                {/* עיצוב: הילה ירקרקה מאחורי הכדור, ברק לבן על החצי הירוק ונקודות צבעוניות – כמו בהדמיה */}
                <div className="relative h-[150px] w-[240px]">
                    <div aria-hidden="true" className="absolute inset-x-[30px] inset-y-[10px] rounded-full bg-[radial-gradient(circle,#DDEBE3,rgba(221,235,227,0)_70%)]" />
                    <svg width="240" height="150" viewBox="0 0 240 150" role="img" aria-label="כדור שבור לשניים" className="relative">
                        <defs>
                            <linearGradient id="pillA" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0" stopColor="#4C8F80" />
                                <stop offset="1" stopColor="#214E48" />
                            </linearGradient>
                        </defs>
                        <g transform="rotate(-16 80 76)">
                            <rect x="30" y="54" width="96" height="46" rx="23" fill="url(#pillA)" />
                            <rect x="44" y="62" width="40" height="8" rx="4" fill="rgba(255,255,255,.35)" />
                            <path d="M126 54 L115 66 L126 77 L115 88 L126 100" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinejoin="round" />
                        </g>
                        <g transform="rotate(18 160 80)">
                            <rect x="132" y="58" width="96" height="46" rx="23" fill="#F6C99A" />
                            <path d="M132 58 L143 70 L132 81 L143 92 L132 104" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinejoin="round" />
                        </g>
                        <circle cx="128" cy="30" r="4" fill="#9CC2B4" />
                        <circle cx="112" cy="128" r="3" fill="#E9A86E" />
                        <circle cx="146" cy="134" r="5" fill="#B9D6C8" />
                    </svg>
                </div>

                <Typography component="p" sx={{ fontSize: 96, fontWeight: 800, lineHeight: 1, letterSpacing: 3, background: 'linear-gradient(135deg, #39796B, #214E48)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }} /* עיצוב: צבע בהדרגה */>
                    404
                </Typography>

                <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
                    העמוד לא נמצא
                </Typography>

                <Typography color="text.secondary" sx={{ fontSize: 18 }}>
                    ייתכן שהכתובת הוקלדה לא נכון, או שהעמוד כבר לא קיים.
                </Typography>

                <Button
                    component={Link}
                    to="/"
                    variant="contained"
                    size="large"
                    className="mt-2"
                    endIcon={<ChevronLeftIcon />} /* עיצוב: חץ בסוף הכפתור */
                    sx={{ borderRadius: 999, px: 4, minHeight: 54, fontSize: 18, fontWeight: 700 }}
                >
                    חזרה לעמוד הראשי
                </Button>
            </Paper>
        </div>
    )
}
export default NotFound
