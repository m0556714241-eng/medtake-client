import type { ReactNode } from "react"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import IconButton from "@mui/material/IconButton"
import CloseIcon from "@mui/icons-material/Close"

interface AppDialogProps {
    open: boolean
    onClose: () => void
    title: string
    children: ReactNode
}

const AppDialog = ({ open, onClose, title, children }: AppDialogProps) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            slotProps={{ paper: { sx: { borderRadius: 6 } } }}
        >
            <DialogTitle className="flex items-center justify-between">
                {title}
                <IconButton onClick={onClose} aria-label="סגירה">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                {children}
            </DialogContent>
        </Dialog>
    )
}
export default AppDialog