import { usePatients } from "../hooks/usePatients" // עיצוב: hook משותף במקום useQuery כאן
import PatientCard from "../components/PatientCard"
import type { PatientFilters } from "../types"
import { useEffect } from "react"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"

interface PatientListProps {
    filters: PatientFilters
    onEdit: (id: string) => void
    onAdd: () => void
    onEmpty: () => void
}


const PatientList = ({ filters, onEdit, onAdd, onEmpty }: PatientListProps) => {
    const { data, isPending, isError, isPlaceholderData } = usePatients(filters)
    const hasFilters = !!filters.search || !!filters.lowStock || !!filters.missedToday
    const noPatientsAtAll = !!data && data.length === 0 && !hasFilters && !isPlaceholderData
    useEffect(() => {
        if (noPatientsAtAll) {
            onEmpty()
        }
    }, [noPatientsAtAll, onEmpty])

    if (isPending) {
        return <p>טוען...</p>
    }
    if (isError) {
        return <p>משהו השתבש</p>
    }
   if (data.length === 0) {
    if (hasFilters) {
        return <p>לא נמצאו מטופלים</p>
    }
    return (
        <div className="flex flex-col items-start gap-3">
            <Typography>עדיין אין מטופלים</Typography>
            <Button variant="outlined" onClick={onAdd}>הוספת המטופל הראשון</Button>
        </div>
    )
}
    return (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5"> {/* עיצוב: כרטיסים רחבים יותר, כמו בהדמיה */}
            {data.map(patient => (
                <PatientCard key={patient.id} patient={patient} onEdit={onEdit} />
            ))}
        </div>
    )
}
export default PatientList
