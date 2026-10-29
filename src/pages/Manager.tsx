import { useState } from "react"
import type { PatientFilters } from "../types"
import FiltersPatient from "../components/FiltersPatient"
import PatientList from "../components/PatientList"
import Button from "@mui/material/Button"
import AppDialog from "../components/AppDialog"
import AddPatient from "../components/AddPatient"
import { useAuth } from "../context/useAuth"
import AddIcon from "@mui/icons-material/Add"
import { usePatients } from "../hooks/usePatients"
import { formatLongDate, greeting } from "../utils/dates"
import CountUp from "../components/CountUp"

const Manager = () => {
    const { user } = useAuth()
    const [dialogOpen, setDialogOpen] = useState(false)
    const [filters, setFilters] = useState<PatientFilters>({})
    const [onedit, setOnedit] = useState<string | null>(null)
    const [autoOpen, setAutoOpen] = useState(false)
    // עיצוב: המספרים בריבועים – מכל המטופלים, בלי סינון (לכן {} ולא filters)
    const { data: allPatients } = usePatients({})
    const patientsCount = allPatients?.length ?? 0
    const missedCount = allPatients?.filter(p => p.todayMissed > 0).length ?? 0
    const lowStockCount = allPatients?.filter(p => p.hasLowStock).length ?? 0
    const needAttention = allPatients?.filter(p => p.todayMissed > 0 || p.hasLowStock).length ?? 0
    const heroText =
        !allPatients ? 'טוען את המטופלים...'
            : patientsCount === 0 ? 'עדיין אין מטופלים. אפשר להוסיף את הראשון.'
                : needAttention === 0 ? 'כל המטופלים בסדר היום.'
                    : needAttention === 1 ? 'מטופל אחד צריך את תשומת הלב שלך היום.'
                        : `${needAttention} מטופלים צריכים את תשומת הלב שלך היום.`
    // עיצוב: שלושת הריבועים; לחיצה על "פספסו היום" או "מלאי נמוך" מפעילה את הסינון המתאים
    const stats = [
        { label: 'מטופלים', value: patientsCount, dot: '#39796B', filter: null },
        { label: 'פספסו היום', value: missedCount, dot: '#C2410C', filter: 'missedToday' as const },
        { label: 'מלאי נמוך', value: lowStockCount, dot: '#F59E5B', filter: 'lowStock' as const },
    ]

    const openAdd = () => {
        setOnedit(null)
        setDialogOpen(true)
    }

    const openEdit = (id: string) => {
        setOnedit(id)
        setDialogOpen(true)
    }
    const handleEmpty = () => {
        if (!autoOpen) {
            setAutoOpen(true)
            openAdd()
        }
    }

    return (
        <div className="flex flex-col gap-6">
            {/* עיצוב: כרטיס פתיחה ירוק ולידו שלושה ריבועי מספרים – כמו בהדמיה */}
            <section className="flex flex-wrap items-start gap-5">
                <div className="drop-in flex min-w-0 flex-[2_1_380px] flex-col gap-5 rounded-[28px] bg-gradient-to-br from-primary to-primary-dark px-8 py-7 text-white shadow-[0_24px_40px_-24px_rgba(33,78,72,.7)]">
                    <div>
                        <div className="text-[15px] opacity-80">{formatLongDate()}</div>
                        <h1 className="m-0 mt-1 text-[32px] font-extrabold">{greeting()}, {user?.fullName}</h1>
                        <p className="m-0 mt-1 opacity-90">{heroText}</p>
                    </div>
                    <Button variant="contained" onClick={openAdd} startIcon={<AddIcon />} className="self-start"
                        sx={{ minHeight: 48, px: 3, fontWeight: 700, background: '#FFFFFF', color: 'primary.dark', boxShadow: 'none', '&:hover': { background: '#F2F6F4' } }}>
                        הוספת מטופל
                    </Button>
                </div>
                <div className="stagger-side grid flex-[1_1_260px] grid-cols-3 gap-3"> {/* הנפשה: הריבועים נכנסים מהצד */}
                    {stats.map(stat => {
                        const isOn = stat.filter ? !!filters[stat.filter] : false
                        const content = (
                            <>
                                <span className="h-2.5 w-2.5 rounded-full" style={{ background: stat.dot }} />
                                <span className="text-[32px] font-extrabold leading-none tabular-nums"><CountUp value={stat.value} /></span> {/* הנפשה: המספר "סופר" עד הערך */}
                                <span className="text-sm text-muted">{stat.label}</span>
                            </>
                        )
                        const boxClass = `flex flex-col items-start gap-1.5 rounded-[22px] bg-white p-4 text-ink shadow-[0_16px_32px_-22px_rgba(33,78,72,.4)] ${isOn ? 'outline outline-2 outline-primary-dark' : ''}`
                        // ריבוע עם סינון – כפתור; ריבוע "מטופלים" – רק תצוגה
                        return stat.filter ? (
                            <button key={stat.label} type="button" aria-pressed={isOn}
                                onClick={() => setFilters({ ...filters, [stat.filter!]: !isOn })}
                                className={`${boxClass} cursor-pointer border-0 text-start font-[inherit]`}>
                                {content}
                            </button>
                        ) : (
                            <div key={stat.label} className={boxClass}>{content}</div>
                        )
                    })}
                </div>
            </section>
            <FiltersPatient filters={filters} onFiltersChange={setFilters}></FiltersPatient>
            <AppDialog open={dialogOpen} onClose={() => setDialogOpen(false)}
                title={onedit ? "עריכת מטופל" : "הוספת מטופל"}>
                <AddPatient onClose={() => setDialogOpen(false)} patientId={onedit ?? undefined} />
            </AppDialog>
            <PatientList filters={filters} onEdit={openEdit} onAdd={openAdd} onEmpty={handleEmpty}></PatientList >


        </div>

    )
}
export default Manager