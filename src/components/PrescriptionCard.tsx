import CardContent from "@mui/material/CardContent"
import type { Prescription, PrescriptionStatus } from "../types"
import Typography from "@mui/material/Typography"
import Card from "@mui/material/Card"
import { dayLabels, prescriptionStatusColors, prescriptionStatusLabels, prescriptionStatusShapes } from "../utils/labels"
import Chip from "@mui/material/Chip"
import { useState } from "react"
import Button from "@mui/material/Button"
import AddMedicine from "./AddMedicine"
import CardActions from "@mui/material/CardActions"
import AppDialog from "./AppDialog"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { changeStatus, deletePrescription } from "../api/prescriptions"
import MenuItem from "@mui/material/MenuItem"
import TextField from "@mui/material/TextField"
import RefillStock from "./RefillStock"
import ConfirmDialog from "./ConfirmDialog"

interface PrescriptionCardProps {
    Prescription: Prescription
}
const PrescriptionCard = ({ Prescription }: PrescriptionCardProps) => {
    const { schedule } = Prescription
    const [editOpen, setEditOpen] = useState(false)//שומר האם העריכת מרשם פתוח
    const [refillOpen, setRefillOpen] = useState(false)//שומר האם ההוספת מלאי פתוח
    const [confirmOpen, setConfirmOpen] = useState(false)//חלון אישור מחיקה
    const queryClient = useQueryClient()
    const statusMutation = useMutation({
        mutationFn: (status: PrescriptionStatus) => changeStatus(Prescription.id, status)

    })

    const handleStatusChange = async (status: PrescriptionStatus) => {
        await statusMutation.mutateAsync(status)
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: ['prescriptions'] }),
            queryClient.invalidateQueries({ queryKey: ['doses'] }),
            queryClient.invalidateQueries({ queryKey: ['patient', Prescription.patientId] }),
            queryClient.invalidateQueries({ queryKey: ['patients'] }),
            queryClient.invalidateQueries({ queryKey: ['alerts'] }),
        ])
    }
    const deleteMutation = useMutation({
        mutationFn: (id: string) => deletePrescription(id)
    })
    const handleDelete = async () => {
        await deleteMutation.mutateAsync(Prescription.id)
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: ['prescriptions'] }),
            queryClient.invalidateQueries({ queryKey: ['doses'] }),
            queryClient.invalidateQueries({ queryKey: ['patient', Prescription.patientId] }),
            queryClient.invalidateQueries({ queryKey: ['patients'] }),
            queryClient.invalidateQueries({ queryKey: ['alerts'] }),
        ])
        setConfirmOpen(false)
    }
    const dayText = schedule.days.length == 7 ? "כל יום" :
        schedule.days.map(day => dayLabels[day]).join(' ')
    return (
        <Card>
            {/* עיצוב: סמל של כדור בריבוע ירוק, שם ומינון, סטטוס, ושורות מידע עם סמלים – כמו בהדמיה */}
            <CardContent className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                    <span className="grid h-[50px] w-[50px] shrink-0 place-items-center rounded-2xl bg-primary-soft">
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#214E48" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><rect x="3" y="8" width="18" height="8" rx="4" transform="rotate(-35 12 12)"></rect><line x1="9.2" y1="8" x2="14.8" y2="16"></line></svg>
                    </span>
                    <div className="min-w-0 flex-1">
                        <Typography variant="h6">{Prescription.drugName}</Typography>
                        <Typography color="text.secondary" variant="body2">
                            {Prescription.dosage} · {prescriptionStatusShapes[Prescription.form]}
                        </Typography>
                    </div>
                    <Chip
                        size="small"
                        label={prescriptionStatusLabels[Prescription.status]}
                        color={prescriptionStatusColors[Prescription.status]}
                    />
                </div>
                <div className="flex items-center gap-2 text-muted">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><polyline points="12 7 12 12 15 14"></polyline></svg>
                    <Typography variant="body2" color="text.secondary">{dayText} · {schedule.times.join(', ')}</Typography>
                </div>
                <div className="flex items-center justify-between gap-2 rounded-2xl bg-[#F7FAF8] px-3 py-2">
                    <Typography variant="body2" color="text.secondary">מלאי</Typography>
                    <div className="flex items-center gap-2">
                        {Prescription.isLowStock && <Chip size="small" variant="outlined" label="מלאי נמוך" />}
                        <Typography sx={{ fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{Prescription.stockQuantity}</Typography>
                    </div>
                </div>
                {Prescription.instructions && (
                    <Typography color="text.secondary">{Prescription.instructions}</Typography>
                )}
                {/* שונה: בחירת הסטטוס עברה לכאן, מעל הכפתורים */}
                <TextField
                    select
                    size="small"
                    label="סטטוס"
                    value={Prescription.status}
                    onChange={(e) => handleStatusChange(e.target.value as PrescriptionStatus)}
                    disabled={statusMutation.isPending}
                    fullWidth // שונה: הסטטוס בשורה משלו ברוחב מלא – כדי שלא יעלה על הכפתורים
                >
                    {Object.entries(prescriptionStatusLabels).map(([value, label]) => (
                        <MenuItem key={value} value={value}>{label}</MenuItem>
                    ))}
                </TextField>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={() => setEditOpen(true)} sx={{ bgcolor: '#F2F6F4', color: 'text.primary' }}>עריכה</Button>
                <Button size="small" onClick={() => { setRefillOpen(true) }} sx={{ bgcolor: 'primary.light', color: 'primary.dark' }}>חידוש מלאי </Button>
                <Button size="small" onClick={() => setConfirmOpen(true)} sx={{ color: 'text.secondary' }}>מחיקה</Button>
            </CardActions>
            {statusMutation.isError && (
                <Typography color="error" className="px-4 pb-2">שינוי הסטטוס נכשל. נסו שוב</Typography>
            )}
            <AppDialog open={editOpen} onClose={() => setEditOpen(false)} title="עריכת מרשם">
                <AddMedicine onClose={() => setEditOpen(false)} patientId={Prescription.patientId} prescription={Prescription} />
            </AppDialog>

            <AppDialog open={refillOpen} onClose={() => setRefillOpen(false)} title="חידוש מלאי" >
                <RefillStock prescription={Prescription} onClose={() => setRefillOpen(false)} />
            </AppDialog>

            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                title="מחיקת מרשם"
                onConfirm={handleDelete}
                isPending={deleteMutation.isPending}
                isError={deleteMutation.isError}
            >
                <Typography>
                    למחוק את {Prescription.drugName}? תימחק גם כל היסטוריית הנטילה שלו.
                </Typography>
                <Typography color="text.secondary" className="mt-1">
                    אם הטיפול הסתיים, עדיף לשנות את הסטטוס ל"הסתיים".
                </Typography>
            </ConfirmDialog>

        </Card>
    )



}
export default PrescriptionCard