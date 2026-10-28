import type { PrescriptionForm } from "../types"
import MedicationLiquidIcon from "@mui/icons-material/MedicationLiquid"
import WaterDropIcon from "@mui/icons-material/WaterDrop"
import VaccinesIcon from "@mui/icons-material/Vaccines"
import SanitizerIcon from "@mui/icons-material/Sanitizer"
import MedicalServicesIcon from "@mui/icons-material/MedicalServices"

interface FormIconProps {
    form: PrescriptionForm
    size?: number // גודל האייקון בפיקסלים
}

// אייקון לפי צורת התרופה – רכיב משותף ל-DoseItem ול-PrescriptionCard, כדי לא לכתוב את אותה בחירה בכמה מקומות.
// aria-hidden: שם הצורה כבר כתוב בטקסט, אז קורא מסך לא צריך להקריא גם את האייקון.
const FormIcon = ({ form, size = 24 }: FormIconProps) => {
    const color = '#214E48'
    switch (form) {
        // שונה: כדור וכמוסה מקבלים את אותה גלולה מוטה – כמו הלוגו של האתר
        case 'tablet':
        case 'capsule':
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <rect x="3" y="8" width="18" height="8" rx="4" transform="rotate(-35 12 12)" />
                    <line x1="9.2" y1="8" x2="14.8" y2="16" />
                </svg>
            )
        case 'syrup':
            return <MedicationLiquidIcon aria-hidden sx={{ fontSize: size, color }} />
        case 'drops':
            return <WaterDropIcon aria-hidden sx={{ fontSize: size, color }} />
        case 'injection':
            return <VaccinesIcon aria-hidden sx={{ fontSize: size, color }} />
        case 'cream':
            return <SanitizerIcon aria-hidden sx={{ fontSize: size, color }} />
        default:
            return <MedicalServicesIcon aria-hidden sx={{ fontSize: size, color }} />
    }
}
export default FormIcon
