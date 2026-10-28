import Typography from "@mui/material/Typography"
import type { PatientSummary } from "../types"
import { formatDayMonth, toDateString } from "../utils/dates"

interface PatientProfileProps{
    patient:PatientSummary
}
const PatientProfile=({patient}:PatientProfileProps)=>{
    // עיצוב: כרטיס לבן עם אות, שם, ושלוש קופסאות מידע – כמו בהדמיה
    const stats = [
        { label: 'גיל', value: patient.age ?? '–' },
        { label: 'הצטרף', value: formatDayMonth(toDateString(new Date(patient.createdAt))) }, // עיצוב: תאריך קצר
        { label: 'תרופות פעילות', // עיצוב: הנוסח מההדמיה
          value: patient.activePrescriptions },
    ]
    return (
        <section className="flex flex-wrap items-center gap-5 rounded-[30px] bg-white p-6 shadow-[0_24px_48px_-30px_rgba(33,78,72,.5)]">
            <span className="grid h-[76px] w-[76px] place-items-center rounded-[24px] bg-gradient-to-br from-primary-soft to-[#B9D6C8] text-[32px] font-extrabold text-primary-dark">
                {patient.fullName.charAt(0)}
            </span>
            <div className="min-w-0 flex-1">
                <Typography variant="h5" component="h1">{patient.fullName}</Typography>
                <Typography color="text.secondary">{patient.email}</Typography>
            </div>
            <dl className="m-0 grid grid-cols-3 gap-2">
                {stats.map(stat => (
                    <div key={stat.label} className="rounded-[18px] bg-[#F7FAF8] px-4 py-2">
                        <dt className="text-[13px] text-muted">{stat.label}</dt>
                        <dd className="m-0 text-[20px] font-extrabold">{stat.value}</dd>
                    </div>
                ))}
            </dl>
        </section>
    )

}
export default PatientProfile