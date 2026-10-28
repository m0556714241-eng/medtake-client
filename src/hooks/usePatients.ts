import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { getPatients } from "../api/patients"
import type { PatientFilters } from "../types"

// עיצוב: hook משותף לרשימת המטופלים.
// משמש את PatientList (הרשימה המסוננת) ואת Manager (המספרים בריבועים למעלה, בלי סינון).
export function usePatients(filters: PatientFilters) {
    return useQuery({
        queryKey: ['patients', filters],
        queryFn: () => getPatients(filters),
        placeholderData: keepPreviousData,
    })
}
