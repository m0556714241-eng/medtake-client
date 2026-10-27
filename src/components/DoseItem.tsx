import Typography from "@mui/material/Typography"
import type { Dose } from "../types"
import Chip from "@mui/material/Chip"
import { doseStatusColors, doseStatusLabels } from "../utils/labels"
import { formatTime } from "../utils/dates"

interface DoseItemProps {
    dose: Dose
}
const DoseItem=({dose}:DoseItemProps)=>{
        return (
        <li className="flex items-center gap-3">
            <Typography className="w-12">{formatTime(dose.scheduledAt)}</Typography>
            <Typography className="flex-1">
                {dose.drugName} · {dose.dosage}
            </Typography>
            {dose.isLowStock && <Chip size="small" variant="outlined" label="מלאי נמוך" />}
            <Chip
                size="small"
                label={doseStatusLabels[dose.status]}
                color={doseStatusColors[dose.status]}
               
            />
        </li>
    )

}
export default DoseItem