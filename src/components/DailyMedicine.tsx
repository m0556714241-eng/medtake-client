import { useDayDoses } from "../hooks/useDayDoses" // עיצוב: hook משותף במקום useQuery כאן
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import DoseItem from "./DoseItem"
import ProgressRing from "./ProgressRing"

interface DailyMedicineProps {
    patientId?: string,
    date: string
    canMark: boolean
    title?: string // עיצוב: כותרת מעל המנות (בעמוד המטופל של המטפלת), ולידה "נלקחו X מתוך Y"
}
const DailyMedicine = ({ patientId, date, canMark, title }: DailyMedicineProps) => {
    const { data, isPending, isError, refetch } = useDayDoses(date, patientId)

    // עיצוב: שורת הכותרת – מוצגת גם בזמן טעינה וגם כשאין מנות, כדי שהכותרת לא "תקפוץ"
    const titleRow = (badge?: string) => title && (
        <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="m-0 text-[21px] font-extrabold">{title}</h2>
            {badge && <span className="rounded-full bg-primary-soft px-4 py-1 text-sm font-bold text-primary-dark">{badge}</span>}
        </div>
    )

    if (isPending) {
        return <div className="flex flex-col gap-4">{titleRow()}<p className="m-0">טוען מנות...</p></div>
    }
    if (isError) {
        return (
            <div className="flex flex-col items-start gap-3">
                <p>לא הצלחנו לטעון את המנות</p>
                <Button variant="outlined" onClick={() => refetch()}>נסו שנית</Button>
            </div>
        )
    }
    if (data.length === 0) {
        return <div className="flex flex-col gap-4">{titleRow()}<Typography>אין מנות ביום הזה</Typography></div>
    }
    const total = data.length
    const taken = data.filter(dose => dose.status == 'taken').length
    // עיצוב: המנה הבאה בתור – הראשונה שעוד ממתינה; מקבלת מסגרת ירוקה
    const nextDose = data.find(dose => dose.status === 'pending')
    return (
        <div className="flex flex-col gap-4">
            {titleRow(`נלקחו ${taken} מתוך ${total}`)}
            {/* עיצוב: אצל המטופל העיגול נמצא בכרטיס הירוק למעלה, לכן כאן הוא מוצג רק למטפלת */}
            {!canMark && !title && <div className="flex items-center gap-4">
                <ProgressRing taken={taken} total={total} size={72} />
                <div>
                    <Typography sx={{ fontWeight: 800, fontSize: 20 }}>נלקחו {taken} מתוך {total}</Typography>
                    <Typography color="text.secondary">
                        {taken === total ? 'כל המנות של היום נלקחו' : `נשארו עוד ${total - taken}`}
                    </Typography>
                </div>
            </div>}

            {/* עיצוב: אצל המטופל – רשימה לרוחב; אצל המטפלת – כרטיסים קטנים זה ליד זה */}
            <ul className={`m-0 list-none p-0 ${canMark ? 'flex flex-col gap-4' : 'grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-3'}`}>
                {data.map(dose => (
                    <DoseItem key={`${dose.prescriptionId}-${dose.scheduledAt}`} dose={dose} canMark={canMark} isNext={dose === nextDose} />
                ))}
            </ul>
        </div>
    )

}
export default DailyMedicine