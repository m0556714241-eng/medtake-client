import Typography from "@mui/material/Typography"
import type { PatientSummary } from "../types"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import { formatDate } from "../utils/dates"
import Avatar from "@mui/material/Avatar"
import Chip from "@mui/material/Chip"
import CardActionArea from "@mui/material/CardActionArea"
import { Link } from "react-router-dom"
import CardActions from "@mui/material/CardActions"
import Button from "@mui/material/Button"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deletePatient } from "../api/patients"
import AppDialog from "./AppDialog"

interface PatientCardProps {
    patient: PatientSummary
    onEdit: (id: string) => void
}
const PatientCard = ({ patient, onEdit }: PatientCardProps) => {
    const firstLetter = patient.fullName.charAt(0)
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
        <Card sx={{ borderRadius: 4 }}>
            <CardActionArea component={Link} to={`/manager/patients/${patient.id}`}>
                <CardContent className="flex items-center gap-4">
                    <Avatar sx={{ bgcolor: "primary.main", width: 52, height: 52 }}>
                        {firstLetter}
                    </Avatar>
                    <div>
                        <Typography variant="h6">{patient.fullName}</Typography>
                        <Typography color="text.secondary">
                            גיל {patient.age ?? "לא ידוע"} · הצטרף {formatDate(patient.createdAt)}
                        </Typography>

                        <Typography className="mt-1">
                            נלקחו {patient.todayTaken} מתוך {patient.todayTotal} היום
                        </Typography>

                        <div className="flex flex-wrap gap-2 mt-2">
                            {patient.todayMissed > 0 && (
                                <Chip label={`פוספסו ${patient.todayMissed}`} size="small"
                                    sx={{ bgcolor: "#FFEDD5", color: "#9A3412" }} />
                            )}
                            {patient.hasLowStock && (
                                <Chip label="מלאי נמוך" size="small"
                                    sx={{ bgcolor: "#EEF2F5", color: "#475569" }} />
                            )}
                            {allGood && (
                                <Chip label="הכול בסדר" size="small"
                                    sx={{ bgcolor: "#DDEBE3", color: "#214E48" }} />
                            )}
                        </div>
                    </div>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Button size="small" onClick={() => { onEdit(patient.id) }}>
                    עריכה
                </Button>
                <Button size="small" color="error" onClick={() => setConfirmOpen(true)}>
                    מחיקה
                </Button>

            </CardActions>
            <AppDialog open={confirmOpen} onClose={() => { setConfirmOpen(false) }} title="מחיקת מטופל">
                <Typography>
                    למחוק את {patient.fullName}? יימחקו גם כל המרשמים וההיסטוריה שלו. אי אפשר לבטל את הפעולה.
                </Typography>
                {deleteMutation.isError && (
                    <Typography color="error" className="mt-2">המחיקה נכשלה. נסו שוב</Typography>
                )}
                <div className="flex justify-end gap-2 mt-6">
                    <Button onClick={() => setConfirmOpen(false)} disabled={deleteMutation.isPending}>
                        ביטול
                    </Button>
                    <Button variant="contained" color="error" onClick={handleDelete} disabled={deleteMutation.isPending}>
                        {deleteMutation.isPending ? "מוחק..." : "מחיקה"}
                    </Button>
                </div>

            </AppDialog>
        </Card>
    )


}
export default PatientCard