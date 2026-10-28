import Button from "@mui/material/Button"
import DayCard from "./DayCard"
import { dayFullNames } from "../utils/labels"
import type { ReactNode } from "react"
import { formatDate, formatDayMonth } from "../utils/dates"
import { useWeekSummary } from "../hooks/useWeekSummary" // עיצוב: hook משותף במקום useQuery כאן

interface WeeklyMedicineProps {
    date: string
    onSelectDay:(day:string)=>void
    toggle?: ReactNode // עיצוב: המתג יומי/שבועי – מוצג בשורת הכותרת, משמאל, כמו בהדמיה
}

// עיצוב: מקרא הצבעים שמתחת לכרטיסי הימים – כמו בהדמיה
const legend = [
    { label: 'הכול נלקח', box: 'bg-primary' },
    { label: 'יש מנה שפוספסה', box: 'bg-[#FFEDD5] border-2 border-[#C2410C]' },
    { label: 'היום', box: 'bg-white border-2 border-[#16242A]' },
    { label: 'עוד לא הגיע', box: 'bg-white border border-[#DCE5E2]' },
]

const WeeklyMedicine = ({ date,onSelectDay, toggle }: WeeklyMedicineProps) => {
    const { data, isPending, isError, refetch, from, to, takenSoFar, totalSoFar } = useWeekSummary(date)
    if (isPending) {
        return <p>טוען שבוע...</p>
    }
    if (isError) {
        return (
            <div className="flex flex-col items-start gap-3">
                <p>לא הצלחנו לטעון את השבוע</p>
                <Button variant="outlined" onClick={() => refetch()}>נסו שנית</Button>
            </div>
        )
    }
    return (
        // עיצוב: פריסה כמו בהדמיה – כותרת מימין ומתג משמאל, מתחת שבעת הימים ומקרא
        <section className="flex flex-col gap-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h2 className="m-0 text-[36px] font-extrabold text-ink">השבוע</h2>
                    <p className="m-0 mt-1 text-lg text-muted">
                        {formatDayMonth(from)} – {formatDate(to)} · נלקחו {takenSoFar} מתוך {totalSoFar} עד היום
                    </p>
                </div>
                {toggle}
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
                {data.map((sammary,index)=>
                    <DayCard summary={sammary} key={sammary.date} dayName={dayFullNames[index]} onSelect={onSelectDay} ></DayCard>
                )}
            </div>
            <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-2 p-0 text-muted">
                {legend.map(item => (
                    <li key={item.label} className="flex items-center gap-2">
                        <span className={`inline-block h-5 w-5 rounded-md ${item.box}`} />
                        {item.label}
                    </li>
                ))}
            </ul>
        </section>
    )
}
export default WeeklyMedicine
