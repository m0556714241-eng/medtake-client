import TextField from "@mui/material/TextField"
import MenuItem from "@mui/material/MenuItem"
import InputAdornment from "@mui/material/InputAdornment"
import Button from "@mui/material/Button"
import SearchIcon from "@mui/icons-material/Search"
import type { PatientFilters } from "../types"
import { pillFieldSx, pillShadow } from "../utils/styles" // עיצוב: סגנון משותף עם FiltersPrescription

interface FiltersPatientProps {
    filters: PatientFilters
    onFiltersChange: (filters: PatientFilters) => void
}

interface SortOption {
    value: string
    label: string
    sortBy: 'createdAt' | 'fullName'
    sortOrder: 'asc' | 'desc'
}

const sortOptions: SortOption[] = [
    { value: 'name-asc', label: "שם (א'–ת')", sortBy: 'fullName', sortOrder: 'asc' },
    { value: 'name-desc', label: "שם (ת'–א')", sortBy: 'fullName', sortOrder: 'desc' },
    { value: 'joined-desc', label: 'הצטרפו לאחרונה', sortBy: 'createdAt', sortOrder: 'desc' },
    { value: 'joined-asc', label: 'הצטרפו ראשונים', sortBy: 'createdAt', sortOrder: 'asc' },
]

// שונה: במקום תיבות סימון – שני כפתורי גלולה. מוגדרים פעם אחת במערך, כדי לא לכתוב את אותו כפתור פעמיים
const toggles = [
    { key: 'missedToday', label: 'פוספס היום' },
    { key: 'lowStock', label: 'מלאי נמוך' },
] as const


const FiltersPatient = ({ filters, onFiltersChange }: FiltersPatientProps) => {
    const currentSort = sortOptions.find(
        o => o.sortBy === (filters.sortBy ?? 'fullName') && o.sortOrder === (filters.sortOrder ?? 'asc')
    )

    const handleSortChange = (value: string) => {
        const option = sortOptions.find(o => o.value === value)
        if (option) {
            onFiltersChange({ ...filters, sortBy: option.sortBy, sortOrder: option.sortOrder })
        }
    }

    return (
        // עיצוב: בלי מסגרת מסביב – שורה של גלולות לבנות, כמו בהדמיה
        <div className="flex flex-wrap items-center gap-3">
            <TextField
                placeholder="חיפוש מטופל…"
                aria-label="חיפוש לפי שם"
                type="search"
                value={filters.search ?? ""}
                onChange={e => onFiltersChange({ ...filters, search: e.target.value })}
                className="min-w-60 flex-[1_1_280px]"
                sx={pillFieldSx}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" />
                            </InputAdornment>
                        ),
                    },
                }}
            />

            <TextField
                select
                aria-label="מיון"
                value={currentSort?.value ?? 'name-asc'}
                onChange={e => handleSortChange(e.target.value)}
                className="min-w-52"
                sx={pillFieldSx}
                slotProps={{
                    // עיצוב: בשדה עצמו כתוב "מיון: ..." – ברשימה שנפתחת רק שם האפשרות
                    select: { renderValue: value => `מיון: ${sortOptions.find(o => o.value === value)?.label ?? ''}` },
                }}
            >
                {sortOptions.map(o => (
                    <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                ))}
            </TextField>

            {toggles.map(t => {
                const isOn = filters[t.key] ?? false
                return (
                    <Button
                        key={t.key}
                        aria-pressed={isOn}
                        onClick={() => onFiltersChange({ ...filters, [t.key]: !isOn })}
                        sx={{
                            minHeight: 48,
                            px: 2.5,
                            fontWeight: isOn ? 700 : 500,
                            bgcolor: isOn ? '#214E48' : '#FFFFFF',
                            color: isOn ? '#FFFFFF' : 'text.primary',
                            boxShadow: isOn ? 'none' : pillShadow,
                            '&:hover': { bgcolor: isOn ? '#2C6358' : '#F2F6F4' },
                        }}
                    >
                        {t.label}
                    </Button>
                )
            })}
        </div>
    )
}
export default FiltersPatient
