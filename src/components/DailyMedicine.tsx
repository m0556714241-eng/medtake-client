import { useQuery } from "@tanstack/react-query"
import { getDoses } from "../api/doses"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import {  formatTime } from "../utils/dates"
import DoseItem from "./DoseItem"

interface DailyMedicineProps {
    patientId?: string,
    date: string
    canMark: boolean
}
const DailyMedicine = ({ patientId, date, canMark }: DailyMedicineProps) => {
    const { data, isPending, isError, refetch } = useQuery({
        queryKey: ['doses', patientId, date, date],
        queryFn: () => getDoses({ from: date, to: date, patientId }),
    }
    )

    if (isPending) {
        return <p>טוען מנות...</p>
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
        return <Typography>אין מנות ביום הזה</Typography>
    }
    return (
        <ul className="flex flex-col gap-2">
            {
                data.map(dose => (
                  <DoseItem key={`${dose.prescriptionId}-${dose.scheduledAt}`} dose={dose}></DoseItem>
                ))
            }

        </ul>
    )

}
export default DailyMedicine