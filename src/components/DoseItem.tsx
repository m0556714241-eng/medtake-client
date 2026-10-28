import Typography from "@mui/material/Typography"
import type { Dose } from "../types"
import Chip from "@mui/material/Chip"
import { doseStatusLabels } from "../utils/labels"
import FormIcon from "./FormIcon" // נוסף: אייקון לפי צורת התרופה
import { formatTime, partOfDay } from "../utils/dates"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { markIntake, unmarkIntake } from "../api/intakes"
import Button from "@mui/material/Button" // שונה: כפתור גדול כמו בהדמיה במקום העיגול
import CheckIcon from "@mui/icons-material/Check"

interface DoseItemProps {
    dose: Dose
    canMark: boolean
    isNext?: boolean // עיצוב: המנה הבאה בתור – מסגרת ירוקה עבה
}
const DoseItem = ({ dose, canMark, isNext = false }: DoseItemProps) => {
    const queryClient = useQueryClient()

    const refresh = () => Promise.all([
        queryClient.invalidateQueries({ queryKey: ['doses'] }),
        queryClient.invalidateQueries({ queryKey: ['doses-summary'] }),
        queryClient.invalidateQueries({ queryKey: ['prescriptions'] }),
        queryClient.invalidateQueries({ queryKey: ['patients'] }),
        queryClient.invalidateQueries({ queryKey: ['alerts'] }),
    ])
    const markMutation = useMutation({
        mutationFn: async () => {
            await markIntake({ prescriptionId: dose.prescriptionId, scheduledAt: dose.scheduledAt })
            await refresh()
        }
    })
    const unMarkMutation = useMutation({
        mutationFn: async (intakeId: string) => {
            await unmarkIntake(intakeId) // תוקן: await, כדי לחכות למחיקה לפני הרענון
            await refresh()
        }
    })
    const isSaving = markMutation.isPending || unMarkMutation.isPending
    const isFailed = markMutation.isError || unMarkMutation.isError


    // עיצוב: צבע הכרטיס לפי המצב – כמו בהדמיה
    const cardLook =
        dose.status === 'taken' ? 'bg-primary-soft'
            : dose.status === 'missed' ? 'bg-[#FFF4E8] shadow-[inset_0_0_0_2px_#F5B98A]'
                : isNext ? 'bg-white shadow-[inset_0_0_0_3px_#39796B]'
                    : 'bg-white/80 shadow-[inset_0_0_0_1px_#E3ECE7]'
    const isTaken = !!dose.intakeId

    // עיצוב: אצל המטפלת (בלי סימון) – כרטיס קטן, כמה בשורה, כמו בהדמיה של עמוד המטופל
    if (!canMark) {
        const pillLook =
            dose.status === 'taken' ? 'bg-primary text-white'
                : dose.status === 'missed' ? 'bg-[#C2410C] text-white'
                    : 'bg-[#F2F6F4] text-muted'
        return (
            <li className={`flex flex-col items-start gap-1 rounded-[22px] p-4 ${
                dose.status === 'taken' ? 'bg-primary-soft'
                    : dose.status === 'missed' ? 'bg-[#FFF4E8] shadow-[inset_0_0_0_2px_#F5B98A]'
                        : 'bg-white shadow-[inset_0_0_0_1px_#E3ECE7]'
            }`}>
                {/* נוסף: אייקון הצורה ליד השעה */}
                <div className="flex w-full items-center justify-between gap-2">
                    <Typography sx={{ fontWeight: 800, fontSize: 22, lineHeight: 1.2, fontVariantNumeric: 'tabular-nums' }}>{formatTime(dose.scheduledAt)}</Typography>
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/70"><FormIcon form={dose.form} size={20} /></span>
                </div>
                <Typography sx={{ fontWeight: 800 }}>{dose.drugName}</Typography>
                <Typography variant="body2" color="text.secondary">{dose.dosage}</Typography>
                <div className="mt-1 flex flex-wrap gap-2">
                    <span className={`rounded-full px-3 py-0.5 text-[13px] font-bold ${pillLook}`}>
                        {doseStatusLabels[dose.status]}{dose.status === 'taken' && dose.takenAt ? ` ${formatTime(dose.takenAt)}` : ''}
                    </span>
                    {dose.isLowStock && <Chip size="small" variant="outlined" label="מלאי נמוך" />}
                </div>
            </li>
        )
    }

    return (
        // עיצוב: כרטיס מנה כמו בהדמיה – שעה וחלק היום מימין, קו מפריד, שם התרופה, וכפתור גדול משמאל
        <li className={`flex flex-wrap items-center gap-5 rounded-[26px] px-6 py-5 ${cardLook}`}>
            <div className="w-20 text-center">
                <Typography sx={{ fontWeight: 800, fontSize: 26, lineHeight: 1.1, fontVariantNumeric: 'tabular-nums' }}>{formatTime(dose.scheduledAt)}</Typography>
                <Typography sx={{ fontSize: 14, color: '#5B6E70' }}>{partOfDay(dose.scheduledAt)}</Typography>
            </div>
            <div className="w-px self-stretch bg-[#E3ECE7]" />
            {/* נוסף: אייקון הצורה ליד שם התרופה */}
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary-soft"><FormIcon form={dose.form} size={26} /></span>
            <div className="min-w-0 flex-1">
                <Typography sx={{ fontWeight: 800, fontSize: 22, lineHeight: 1.2 }}>{dose.drugName}</Typography>
                <Typography color="text.secondary">{dose.dosage}</Typography>
                {dose.status === 'missed' && !isTaken && (
                    <Typography sx={{ fontSize: 14, color: '#9A3412', fontWeight: 600 }}>עבר הזמן – אפשר עדיין לסמן</Typography>
                )}
                <div className="mt-1 flex flex-wrap gap-2">
                    {dose.isLowStock && <Chip size="small" variant="outlined" label="מלאי נמוך" />}
                </div>
                {isFailed && <Typography variant="caption" color="error">הפעולה נכשלה</Typography>}
            </div>
            {/* שונה: כפתור גדול כמו בהדמיה במקום העיגול – לחיצה מסמנת 'לקחתי', לחיצה על 'נלקח' מבטלת */}
            {(
                <Button
                    variant="contained"
                    onClick={() =>
                        dose.intakeId ? unMarkMutation.mutate(dose.intakeId) : markMutation.mutate()
                    }
                    disabled={isSaving}
                    startIcon={isTaken ? <CheckIcon /> : undefined}
                    aria-label={isTaken ? 'ביטול סימון' : 'סימון כנלקח'}
                    sx={{
                        minHeight: 58,
                        minWidth: 150,
                        fontSize: 20,
                        fontWeight: 800,
                        borderRadius: 999,
                        // כתום למנה שפוספסה, ירוק לכל השאר
                        ...(dose.status === 'missed' && !isTaken && {
                            background: '#C2410C',
                            '&:hover': { background: '#9A3412' },
                        }),
                    }}
                >
                    {isTaken ? 'נלקח' : 'לקחתי'}
                </Button>
            )}
        </li>
    )

}
export default DoseItem