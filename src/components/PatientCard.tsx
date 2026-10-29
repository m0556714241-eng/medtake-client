import Typography from "@mui/material/Typography"
import type { PatientSummary } from "../types"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import { formatDayMonth, toDateString } from "../utils/dates"
import Avatar from "@mui/material/Avatar"
import Chip from "@mui/material/Chip"
import { Link } from "react-router-dom"
import IconButton from "@mui/material/IconButton"
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"
import CloseIcon from "@mui/icons-material/Close"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deletePatient } from "../api/patients"
import ProgressRing from "./ProgressRing"
import ConfirmDialog from "./ConfirmDialog" // תוקן: הוסרו Button ו-AppDialog שכבר לא בשימוש

// עיצוב: צבעי ריבוע האות – כל מטופל מקבל צבע קבוע לפי השם שלו
const avatarColors = [
    'linear-gradient(135deg, #DDEBE3, #B9D6C8)',
    'linear-gradient(135deg, #F6E3D0, #EFC9A6)',
    'linear-gradient(135deg, #E2E8F0, #C9D3E0)',
    'linear-gradient(135deg, #E6EFE0, #C8DDB9)',
]
// עיצוב: ריבוע אפור קטן לאייקוני העריכה והמחיקה
const iconBoxSx = { width: 40, height: 40, borderRadius: '12px', bgcolor: '#F2F6F4' }

interface PatientCardProps {
    patient: PatientSummary
    onEdit: (id: string) => void
}
const PatientCard = ({ patient, onEdit }: PatientCardProps) => {
    const firstLetter = patient.fullName.charAt(0)
    const colorIndex = patient.fullName.charCodeAt(0) % avatarColors.length
    const allGood = patient.todayMissed === 0 && !patient.hasLowStock
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false)
    const queryClient = useQueryClient()
    const deleteMutation = useMutation({
        mutationFn: deletePatient
    })

    const handleDelete = async () => {
        await deleteMutation.mutateAsync(patient.id)
        await queryClient.invalidateQueries({ queryKey: ['patients'] })
        setConfirmOpen(false)
    }
    return (
        <Card className="lift patient-card" sx={{ borderRadius: '26px' }}> {/* הנפשה: מתרומם בריחוף עכבר; patient-card – לצבע השם והחץ בריחוף */}
            {/* עיצוב: כמו בהדמיה – אות צבעונית, שם, ועיפרון ו-X קטנים משמאל; מתחת עיגול ההתקדמות של היום */}
            <CardContent className="flex flex-col gap-4" sx={{ p: '22px !important' }}>
                <div className="flex items-center gap-3">
                    {/* שונה: רק האות והשם הם קישור לעמוד המטופל – כדי שהכפתורים לא יהיו בתוך קישור */}
                    <Link to={`/manager/patients/${patient.id}`} className="flex min-w-0 flex-1 items-center gap-3 text-ink no-underline">
                        <Avatar variant="rounded" sx={{ background: avatarColors[colorIndex], color: "primary.dark", width: 54, height: 54, borderRadius: "18px", fontWeight: 800, fontSize: 22 }}>
                            {firstLetter}
                        </Avatar>
                        <div className="min-w-0">
                            <Typography className="patient-name" sx={{ fontWeight: 800, fontSize: 19 }}>{patient.fullName}</Typography>
                            <Typography color="text.secondary" variant="body2">
                                גיל {patient.age ?? "לא ידוע"} · מצטרף מ-{formatDayMonth(toDateString(new Date(patient.createdAt)))}
                            </Typography>
                        </div>
                    </Link>
                    {/* שונה: עריכה ומחיקה כאייקונים קטנים במקום כפתורי טקסט למטה */}
                    <IconButton aria-label={`עריכת ${patient.fullName}`} onClick={() => onEdit(patient.id)} sx={iconBoxSx}>
                        <EditOutlinedIcon fontSize="small" sx={{ color: 'primary.dark' }} />
                    </IconButton>
                    <IconButton aria-label={`מחיקת ${patient.fullName}`} onClick={() => setConfirmOpen(true)} sx={iconBoxSx}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </div>

                {/* גם האזור של העיגול מוביל לעמוד המטופל; tabIndex={-1} – כדי שבמקלדת לא יהיו שני קישורים זהים */}
                <Link to={`/manager/patients/${patient.id}`} tabIndex={-1} className="flex items-center gap-4 rounded-[20px] bg-[#F7FAF8] px-4 py-3 text-ink no-underline">
                    <ProgressRing
                        taken={patient.todayTaken}
                        total={patient.todayTotal}
                        color={patient.todayMissed > 0 ? '#E07A3F' : '#39796B'}
                    />
                    <div className="flex flex-col gap-1">
                        <Typography sx={{ fontWeight: 700 }}>נלקחו היום</Typography>
                        <div className="flex flex-wrap gap-2">
                            {patient.todayMissed > 0 && (
                                <Chip label="פוספסה מנה" size="small"
                                    sx={{ bgcolor: "#FFEDD5", color: "#9A3412", fontWeight: 700 }} />
                            )}
                            {patient.hasLowStock && (
                                <Chip label="מלאי נמוך" size="small"
                                    sx={{ bgcolor: "#FED7AA", color: "#9A3412", fontWeight: 700 }} /* עיצוב: כתום בהיר */ />
                            )}
                            {allGood && (
                                <Chip label="הכול בסדר" size="small"
                                    sx={{ bgcolor: "#DDEBE3", color: "#214E48", fontWeight: 700 }} />
                            )}
                        </div>
                    </div>
                </Link>

                {/* נוסף: שורת "צפייה בפרטים" – שיהיה ברור שאפשר להיכנס לכרטיס.
                    מוסתרת ממקלדת וקורא מסך, כי השם כבר קישור לאותו עמוד */}
                <Link to={`/manager/patients/${patient.id}`} tabIndex={-1} aria-hidden="true"
                    className="flex items-center justify-end gap-1 font-bold text-primary no-underline">
                    צפייה בפרטים <span className="details-arrow inline-block">←</span>
                </Link>
            </CardContent>
            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                title="מחיקת מטופל"
                onConfirm={handleDelete}
                isPending={deleteMutation.isPending}
                isError={deleteMutation.isError}
            >
                <Typography>
                    למחוק את {patient.fullName}? יימחקו גם כל המרשמים וההיסטוריה שלו. אי אפשר לבטל את הפעולה.
                </Typography>
            </ConfirmDialog>
        </Card>
    )


}
export default PatientCard