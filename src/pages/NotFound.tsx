import Paper from "@mui/material/Paper"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import { Link } from "react-router-dom"

const NotFound = () => {
    return (
        <div className="min-h-[70vh] flex items-center justify-center p-6">
            <Paper
                className="w-full max-w-lg p-12 flex flex-col items-center gap-4 text-center"
                sx={{ borderRadius: 6 }}
            >
                <svg width="200" height="110" viewBox="0 0 220 120" role="img" aria-label="כדור שבור לשניים">
                    <g transform="rotate(-14 70 60)">
                        <rect x="20" y="38" width="90" height="44" rx="22" fill="#39796B" />
                        <path d="M110 38 L100 50 L110 60 L100 70 L110 82" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinejoin="round" />
                    </g>
                    <g transform="rotate(16 150 64)">
                        <rect x="118" y="42" width="90" height="44" rx="22" fill="#F6C99A" />
                        <path d="M118 42 L128 54 L118 64 L128 74 L118 86" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinejoin="round" />
                    </g>
                </svg>

                <Typography component="p" sx={{ fontSize: 96, fontWeight: 800, lineHeight: 1, color: "primary.main" }}>
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
                    sx={{ borderRadius: 999, px: 4, fontWeight: 700 }}
                >
                    חזרה לעמוד הראשי
                </Button>
            </Paper>
        </div>
    )
}
export default NotFound
