import { useQuery } from "@tanstack/react-query"
import type { PrescriptionFilters } from "../types"
import { getPrescriptions } from "../api/prescriptions"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import PrescriptionCard from "./PrescriptionCard"

interface PrescriptionListProps{
    patientId:string
    filters:PrescriptionFilters
}

const PrescriptionList=({patientId,filters}:PrescriptionListProps)=>{
    const {data,isPending,isError,refetch }=useQuery({
        queryKey: ['prescriptions', patientId, filters],
           queryFn: () => getPrescriptions({ ...filters, patientId }),
    })

    if (isPending) {
        return <p>טוען מרשמים...</p>
    }
    if (isError) {
        return (
            <div className="flex flex-col items-start gap-3">
                <p>לא הצלחנו לטעון את המרשמים</p>
                <Button variant="outlined" onClick={() => refetch()}>נסו שנית</Button>
            </div>
        )
    }
    if (data.length === 0) {
        return <Typography>עדיין אין מרשמים</Typography>
    }
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map(
            res=><PrescriptionCard key={res.id} Prescription={res}></PrescriptionCard> /* תוקן: key לפי ה-id של המרשם, ולא של המטופל */
          )}
        </div>
    )
}
export default PrescriptionList
