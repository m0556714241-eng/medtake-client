import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import type { ReactNode } from "react"
import AppDialog from "./AppDialog"

interface ConfirmDialogProps {
    open: boolean
    onClose: () => void
    title: string
    children: ReactNode
    onConfirm: () => void
    isPending: boolean
    isError: boolean
}
const ConfirmDialog = ({ open, onClose, title, children, onConfirm, isPending, isError }: ConfirmDialogProps) => {
    // תוקן: חסר return – בלי return הפונקציה מחזירה void, ו-React לא יכול להציג אותה
    return (
        <AppDialog open={open} onClose={onClose} title={title}>
            {children}
            {isError && (
                <Typography color="error" className="mt-2">המחיקה נכשלה. נסו שוב</Typography>
            )}
            <div className="mt-6 flex justify-end gap-2">
                <Button variant="soft" onClick={onClose} disabled={isPending}>
                    ביטול
                </Button>
                <Button variant="contained" color="error" onClick={onConfirm} disabled={isPending}>
                    {isPending ? 'מוחק...' : 'מחיקה'}
                </Button>
            </div>
        </AppDialog>
    )
}
export default ConfirmDialog