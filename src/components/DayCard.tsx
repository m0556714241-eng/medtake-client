import Typography from "@mui/material/Typography"
import type { DaySummary } from "../types"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import { formatDayMonth, todayString } from "../utils/dates"
import { dayStateLabels, type DayState } from "../utils/labels"
import CardActionArea from "@mui/material/CardActionArea"

interface DayCardProps {
    summary: DaySummary
    dayName: string
    onSelect: (day: string) => void

}
const getDayState = (sammary: DaySummary): DayState => {
    if (sammary.missed > 0)
        return 'missed'
    if (sammary.total > 0 && sammary.total == sammary.taken)
        return 'complete'
    return 'pending'

}
// עיצוב: צבע הכרטיס לפי מצב היום – בדיוק כמו בהדמיה של התצוגה השבועית
const looks = {
    complete: { bg: '#39796B', text: '#FFFFFF', border: '#39796B', width: 1 },
    missed: { bg: '#FFEDD5', text: '#9A3412', border: '#C2410C', width: 2 },
    pending: { bg: '#FFFFFF', text: '#16242A', border: '#E3ECE7', width: 1 },
}
// עיצוב: היום הנוכחי – לבן עם מסגרת שחורה, כמו במקרא
const todayLook = { bg: '#FFFFFF', text: '#16242A', border: '#16242A', width: 2.5 }

const DayCard = ({ summary, dayName, onSelect }: DayCardProps) => {
    const state = getDayState(summary)
    const isToday = summary.date === todayString()
    const look = isToday ? todayLook : looks[state]
    return (
        <Card variant="outlined" className="lift" sx={{ // הנפשה: מתרומם בריחוף עכבר
            bgcolor: look.bg,
            color: look.text,
            borderColor: look.border,
            borderWidth: look.width,
            borderRadius: '20px',
            boxShadow: 'none',
        }}>
            {/* עיצוב: בלי עיגול – שם היום, תאריך קצר, מספר גדול ומצב, כמו בהדמיה */}
            <CardActionArea onClick={() => onSelect(summary.date)} sx={{ height: '100%' }}>
                <CardContent className="flex min-h-[180px] flex-col items-center justify-center gap-2 text-center">
                    <Typography sx={{ fontWeight: 800, fontSize: 22 }}>{dayName}</Typography>
                    <Typography sx={{ opacity: 0.85 }}>{formatDayMonth(summary.date)}</Typography>
                    <Typography sx={{ fontWeight: 800, fontSize: 36, lineHeight: 1.2, fontVariantNumeric: 'tabular-nums' }}>
                        {summary.taken}/{summary.total}
                    </Typography>
                    <Typography sx={{ fontWeight: 700 }}>
                        {isToday ? 'היום' : dayStateLabels[state]}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )

}
export default DayCard
