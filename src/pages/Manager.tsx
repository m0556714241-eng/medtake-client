import { useState } from "react"
import type { PatientFilters } from "../types"
import FiltersPatient from "../components/FiltersPatient"
import PatientList from "../components/PatientList"
import Button from "@mui/material/Button"
import AppDialog from "../components/AppDialog"
import AddPatient from "../components/AddPatient"

const Manager = () => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [filters, setFilters] = useState<PatientFilters>({})
    const [onedit, setOnedit] = useState<string | null>(null)
    const [autoOpen, setAutoOpen] = useState(false)

    const openAdd = () => {
        setOnedit(null)
        setDialogOpen(true)
    }

    const openEdit = (id: string) => {
        setOnedit(id)
        setDialogOpen(true)
    }
    const handleEmpty = () => {
        if (!autoOpen) {
            setAutoOpen(true)
            openAdd()
        }
    }

    return (
        <div className="flex flex-col gap-6 p-6">
            { }
            <Button variant="contained" onClick={openAdd} className="self-start" >
                הוסף מטופל
            </Button>
            <FiltersPatient filters={filters} onFiltersChange={setFilters}></FiltersPatient>
            <AppDialog open={dialogOpen} onClose={() => setDialogOpen(false)}
                title={onedit ? "עריכת מטופל" : "הוספת מטופל"}>
                <AddPatient onClose={() => setDialogOpen(false)} patientId={onedit ?? undefined} />
            </AppDialog>
            <PatientList filters={filters} onEdit={openEdit} onAdd={openAdd} onEmpty={handleEmpty}></PatientList >


        </div>

    )
}
export default Manager