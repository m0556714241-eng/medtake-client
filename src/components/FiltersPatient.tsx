import Paper from "@mui/material/Paper"
import TextField from "@mui/material/TextField"
import MenuItem from "@mui/material/MenuItem"
import FormControlLabel from "@mui/material/FormControlLabel"
import Checkbox from "@mui/material/Checkbox"
import InputAdornment from "@mui/material/InputAdornment"
import SearchIcon from "@mui/icons-material/Search"
import type { PatientFilters } from "../types"

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
        <Paper
            elevation={0}
            className="flex flex-wrap items-center gap-4 p-4"
            sx={{ borderRadius: 5, boxShadow: "0 10px 24px -18px rgba(33,78,72,.45)" }}
        >
            <TextField
                placeholder="חיפוש לפי שם…"
                aria-label="חיפוש לפי שם"
                type="search"
                size="small"
                value={filters.search ?? ""}
                onChange={e => onFiltersChange({ ...filters, search: e.target.value })}
                className="flex-1 min-w-60"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 999, bgcolor: "#F7FAF8" } }}
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
                label="מיון"
                size="small"
                value={currentSort?.value ?? 'name-asc'}
                onChange={e => handleSortChange(e.target.value)}
                className="min-w-48"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 999 } }}
            >
                {sortOptions.map(o => (
                    <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                ))}
            </TextField>

            <div className="flex flex-wrap gap-2">
                <FormControlLabel
                    label="מלאי נמוך"
                    control={
                        <Checkbox
                            size="small"
                            checked={filters.lowStock ?? false}
                            onChange={e => onFiltersChange({ ...filters, lowStock: e.target.checked })}
                        />
                    }
                />
                <FormControlLabel
                    label="פוספס היום"
                    control={
                        <Checkbox
                            size="small"
                            checked={filters.missedToday ?? false}
                            onChange={e => onFiltersChange({ ...filters, missedToday: e.target.checked })}
                        />
                    }
                />
            </div>
        </Paper>
    )
}
export default FiltersPatient
