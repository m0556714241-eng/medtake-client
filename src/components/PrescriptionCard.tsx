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
            <CardContent className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                    <Typography variant="h6">{Prescription.drugName}</Typography>
                    <Chip
                        size="small"
                        label={prescriptionStatusLabels[Prescription.status]}
                        color={prescriptionStatusColors[Prescription.status]}
                    />
                </div>
                <Typography color="text.secondary">
                    {Prescription.dosage} · {prescriptionStatusShapes[Prescription.form]}
                </Typography>
                <Typography>ימים: {dayText}</Typography>
                <Typography>שעות: {schedule.times.join(', ')}</Typography>
                <div className="flex items-center gap-2">
                    <Typography>מלאי: {Prescription.stockQuantity}</Typography>
                    {Prescription.isLowStock && <Chip size="small" variant="outlined" label="מלאי נמוך" />}
                </div>
                {Prescription.instructions && (
                    <Typography color="text.secondary">{Prescription.instructions}</Typography>
                )}
            </CardContent>
            <CardActions>
                <Button size="small" onClick={() => setEditOpen(true)}>עריכה</Button>
                <Button size="small" onClick={() => { setRefillOpen(true) }}>חידוש מלאי </Button>
                <Button size="small" onClick={() => setConfirmOpen(true)}>מחיקה</Button>
                <TextField
                    select
                    size="small"
                    label="סטטוס"
                    value={Prescription.status}
                    onChange={(e) => handleStatusChange(e.target.value as PrescriptionStatus)}
                    disabled={statusMutation.isPending}
                    className="ms-auto min-w-32"
                >

                    {Object.entries(prescriptionStatusLabels).map(([value, label]) => (
                        <MenuItem key={value} value={value}>{label}</MenuItem>
                    ))}


                </TextField>

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

            <AppDialog open={confirmOpen} onClose={() => { setConfirmOpen(false) }} title="מחיקת מרשם">
                <Typography>
                    למחוק את {Prescription.drugName}? תימחק גם כל היסטוריית הנטילה שלו.
                </Typography>
                <Typography color="text.secondary" className="mt-1">
                    אם הטיפול הסתיים, עדיף לשנות את הסטטוס ל"הסתיים".
                </Typography>
                {deleteMutation.isError && (
                    <Typography color="error" className="mt-2">המחיקה נכשלה. נסו שוב</Typography>
                )}
                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outlined" onClick={() => setConfirmOpen(false)} disabled={deleteMutation.isPending}>
                        ביטול
                    </Button>
                    <Button variant="contained" onClick={handleDelete} disabled={deleteMutation.isPending}>
                        {deleteMutation.isPending ? 'מוחק...' : 'מחיקה'}
                    </Button>
                </div>

            </AppDialog>

        </Card>
    )



}
export default PrescriptionCard