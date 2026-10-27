import Typography from "@mui/material/Typography"
import type { PatientSummary } from "../types"
import { formatDate } from "../utils/dates"

interface PatientProfileProps{
    patient:PatientSummary
}
const PatientProfile=({patient}:PatientProfileProps)=>{
    return (
        <div className="flex flex-col gap-1">
            <Typography variant="h5">{patient.fullName}</Typography>
            <Typography color="text.secondary">
                גיל {patient.age ?? "לא ידוע"} · הצטרף {formatDate(patient.createdAt)}
            </Typography>
            <Typography color="text.secondary">
                מרשמים פעילים: {patient.activePrescriptions}
            </Typography>
        </div>
    )

}
export default PatientProfile