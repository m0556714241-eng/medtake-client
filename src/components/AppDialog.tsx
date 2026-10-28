import type { ReactNode } from "react"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import IconButton from "@mui/material/IconButton"
import CloseIcon from "@mui/icons-material/Close"
import MedicationIcon from "@mui/icons-material/Medication"

interface AppDialogProps {
    open: boolean
    onClose: () => void
    title: string
    subtitle?: string // עיצוב: שורה קטנה מתחת לכותרת, למשל "עבור אברהם כהן"
    children: ReactNode
}

// עיצוב: חלון כמו בהדמיה של "מרשם חדש" – רצועה ירוקה בראש החלון, רקע ירקרק מטושטש מאחור.
// כל החלונות באפליקציה עוברים דרך הרכיב הזה, ולכן השינוי כאן מעצב את כולם.
const AppDialog = ({ open, onClose, title, subtitle, children }: AppDialogProps) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            aria-labelledby="app-dialog-title"
            slotProps={{
                paper: { sx: { borderRadius: '32px', overflow: 'hidden', boxShadow: '0 40px 80px -30px rgba(20,50,45,.6)' } },
                backdrop: { sx: { backgroundColor: 'rgba(33,78,72,.28)', backdropFilter: 'blur(3px)' } },
            }}
        >
            <div className="flex items-center gap-4 bg-gradient-to-br from-primary via-[#2C6358] to-primary-dark px-8 py-6 text-white">
                <span className="grid h-[52px] w-[52px] flex-none place-items-center rounded-2xl bg-white/15">
                    <MedicationIcon />
                </span>
                <div className="min-w-0 flex-1">
                    <h2 id="app-dialog-title" className="m-0 text-[26px] font-extrabold leading-tight">{title}</h2>
                    {subtitle && <div className="opacity-85">{subtitle}</div>}
                </div>
                <IconButton onClick={onClose} aria-label="סגירה"
                    sx={{ width: 44, height: 44, color: '#FFFFFF', bgcolor: 'rgba(255,255,255,.16)', '&:hover': { bgcolor: '#C2410C' } }}> {/* עיצוב: ה-X נצבע כתום במעבר עכבר */}
                    <CloseIcon />
                </IconButton>
            </div>
            <DialogContent sx={{ px: 4, pt: '28px !important', pb: 3.5 }}>
                {children}
            </DialogContent>
        </Dialog>
    )
}
export default AppDialog
