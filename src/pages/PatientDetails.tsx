import { useQuery } from "@tanstack/react-query"
import { Link, useParams } from "react-router-dom"
import { getPatient } from "../api/patients"
import Button from "@mui/material/Button"
import PatientProfile from "../components/PatientProfile"
import DailyMedicine from "../components/DailyMedicine"
import { formatDayMonth, todayString } from "../utils/dates"
import AddIcon from "@mui/icons-material/Add"
import { useState } from "react"
import type { PrescriptionFilters } from "../types/prescription"
import PrescriptionList from "../components/PrescriptionList"
import FiltersPrescription from "../components/FiltersPrescription"
import AppDialog from "../components/AppDialog"
import AddMedicine from "../components/AddMedicine"

const PatientDetails = () => {
    const { id } = useParams()
    const [filters, setFilters] = useState<PrescriptionFilters>({})
    const [addPrescriptionOpen, setAddPrescriptionOpen] = useState(false)
    const { data: patient, isPending, isError, refetch } = useQuery({
        queryKey: ['patient', id],
        queryFn: () => getPatient(id!),
        enabled: !!id
    })
    if (isPending) {
        return <p> טוען...</p>
    }
    if (isError)

        return (
            <div className="flex flex-col items-start gap-3">
                <p>המטופל לא נמצא</p>
                <Button variant="outlined" onClick={() => refetch()}>נסו שנית</Button>
                <Link to="/manager">חזרה לרשימה</Link>
            </div>
        )



    return (
        <div className="flex flex-col gap-6">
            {/* עיצוב: קישור חזרה, פרופיל, "המנות של היום" בכרטיס, ומרשמים עם כותרת */}
            {/* עיצוב: כפתור חזרה בולט – גלולה לבנה עם צל, ובמעבר עכבר ירוק בהיר */}
            <Link to="/manager" className="flex items-center gap-2 self-start rounded-full bg-white px-5 py-2.5 font-bold text-primary-dark no-underline shadow-[0_10px_24px_-14px_rgba(33,78,72,.55)] transition-colors hover:bg-primary-soft">
                <span aria-hidden="true">→</span> חזרה לכל המטופלים
            </Link>
            <PatientProfile patient={patient}></PatientProfile>

            <section className="flex flex-col gap-4 rounded-[30px] border border-white/90 bg-white/80 p-6 shadow-[0_20px_40px_-30px_rgba(33,78,72,.45)]">
                {/* עיצוב: הכותרת עברה לתוך DailyMedicine, שם כבר מחושב כמה נלקחו */}
                <DailyMedicine patientId={patient.id} date={todayString()} canMark={false}
                    title={`היום, ${new Date().toLocaleDateString('he-IL', { weekday: 'long' })} ${formatDayMonth(todayString())}`}></DailyMedicine>
            </section>

            <section className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="m-0 text-[24px] font-extrabold">מרשמים</h2>
                    <Button variant="contained" startIcon={<AddIcon />} sx={{ minHeight: 48, px: 3, fontWeight: 700 }} onClick={() => { setAddPrescriptionOpen(true) }}>הוספת מרשם</Button>
                </div>
                <FiltersPrescription filters={filters} onFiltersChange={setFilters}></FiltersPrescription>
                <PrescriptionList patientId={patient.id} filters={filters} ></PrescriptionList>
            </section>

            <AppDialog open={addPrescriptionOpen} title="הוספת מרשם" subtitle={`עבור ${patient.fullName}`} onClose={()=>setAddPrescriptionOpen(false)}>
                <AddMedicine onClose={()=>setAddPrescriptionOpen(false)} patientId={patient.id}></AddMedicine>
            </AppDialog>
        </div>
    )
}
export default PatientDetails
