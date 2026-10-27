import { useQuery } from "@tanstack/react-query"
import { Link, useParams } from "react-router-dom"
import { getPatient } from "../api/patients"
import Button from "@mui/material/Button"
import PatientProfile from "../components/PatientProfile"
import DailyMedicine from "../components/DailyMedicine"
import { todayString } from "../utils/dates"
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
        <div className="flex flex-col gap-4">
            <PatientProfile patient={patient}></PatientProfile>
            <DailyMedicine patientId={patient.id} date={todayString()} canMark={false}></DailyMedicine>
            <Button variant="contained" onClick={() => { setAddPrescriptionOpen(true) }} className="self-start">הוספת מרשם</Button>
            <FiltersPrescription filters={filters} onFiltersChange={setFilters}></FiltersPrescription>
            <PrescriptionList patientId={patient.id} filters={filters} ></PrescriptionList>
            <AppDialog open={addPrescriptionOpen} title="הוספת מרשם" onClose={()=>setAddPrescriptionOpen(false)}>
                <AddMedicine onClose={()=>setAddPrescriptionOpen(false)} patientId={patient.id}></AddMedicine>
            </AppDialog>
        </div>
    )
}
export default PatientDetails
