import type { PrescriptionFilters, PrescriptionForm, PrescriptionStatus } from "../types"
import { prescriptionStatusLabels, prescriptionStatusShapes } from "../utils/labels"
import TextField from "@mui/material/TextField"
import MenuItem from "@mui/material/MenuItem"
import InputAdornment from "@mui/material/InputAdornment"
import SearchIcon from "@mui/icons-material/Search"
import { pillFieldSx } from "../utils/styles" // עיצוב: אותו סגנון גלולה כמו בעמוד הניהול

interface FiltersPrescriptionProps {
    filters: PrescriptionFilters
    onFiltersChange: (filters: PrescriptionFilters) => void
}
interface SortOption {
    value: string
    label: string
    sortBy: 'drugName' | 'startDate' | 'stockQuantity'
    sortOrder: 'asc' | 'desc'
}
const sortOptions: SortOption[] = [
    { value: 'name-asc', label: "שם (א'–ת')", sortBy: 'drugName', sortOrder: 'asc' },
    { value: 'name-desc', label: "שם (ת'–א')", sortBy: 'drugName', sortOrder: 'desc' },
    { value: 'stock-asc', label: 'מלאי (נמוך קודם)', sortBy: 'stockQuantity', sortOrder: 'asc' },
    { value: 'start-desc', label: 'התחילו לאחרונה', sortBy: 'startDate', sortOrder: 'desc' },
]

const FiltersPrescription = ({ filters, onFiltersChange }: FiltersPrescriptionProps) => {
    const currentSort = sortOptions.find(o => o.sortBy == filters.sortBy && o.sortOrder ==
        filters.sortOrder
    )
    const handleSortChange = (value: string) => {
        const option = sortOptions.find(o => o.value == value)
        if (option) {
            onFiltersChange({
                ...filters,
                sortBy: option.sortBy,
                sortOrder: option.sortOrder

            })
        }

    }
    return (
        // עיצוב: בלי מסגרת מסביב – חיפוש בגלולה לבנה רחבה, ושלוש רשימות נפתחות בגלולות קטנות
        <div className="flex flex-wrap items-center gap-3">
            <TextField
                placeholder="חיפוש לפי שם תרופה…"
                aria-label="חיפוש לפי שם תרופה"
                type="search"
                value={filters.search ?? ''}
                className="min-w-60 flex-[1_1_280px]"
                sx={pillFieldSx}
                onChange={e =>
                    onFiltersChange({
                        ...filters,
                        search: e.target.value
                    })
                }
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
                aria-label="סטטוס"
                value={filters.status ?? ""}
                onChange={e => onFiltersChange({
                    ...filters,
                    status: (e.target.value || undefined) as PrescriptionStatus | undefined,
                })}
                className="min-w-40"
                sx={pillFieldSx}
                slotProps={{ select: { displayEmpty: true, renderValue: value => `סטטוס: ${prescriptionStatusLabels[value as PrescriptionStatus] ?? 'הכול'}` } }}
            >
                <MenuItem value="">הכול</MenuItem>
                {Object.entries(prescriptionStatusLabels).map(([value, label]) => (
                    <MenuItem key={value} value={value}>{label}</MenuItem>
                ))}
            </TextField>
            <TextField
                select
                aria-label="צורה"
                value={filters.form ?? ""}
                onChange={e => onFiltersChange({
                    ...filters,
                    form: (e.target.value || undefined) as PrescriptionForm | undefined,
                })}
                className="min-w-40"
                sx={pillFieldSx}
                slotProps={{ select: { displayEmpty: true, renderValue: value => `צורה: ${prescriptionStatusShapes[value as PrescriptionForm] ?? 'הכול'}` } }}
            >
                <MenuItem value="">הכול</MenuItem>
                {Object.entries(prescriptionStatusShapes).map(([value, label]) => (
                    <MenuItem key={value} value={value}>{label}</MenuItem>
                ))}
            </TextField>


            <TextField
                select
                aria-label="מיון"
                value={currentSort?.value ?? 'name-asc'}
                onChange={e => handleSortChange(e.target.value)}
                className="min-w-52"
                sx={pillFieldSx}
                slotProps={{ select: { renderValue: value => `מיון: ${sortOptions.find(o => o.value === value)?.label ?? ''}` } }}
            >
                {sortOptions.map(
                    o => (
                        <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                    )
                )}

            </TextField>
        </div>
    )
}

export default FiltersPrescription