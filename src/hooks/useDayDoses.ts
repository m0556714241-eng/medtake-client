import { useQuery } from "@tanstack/react-query"
import { getDoses } from "../api/doses"

// עיצוב: hook משותף למנות של יום אחד.
// משמש את DailyMedicine (הרשימה) ואת MyMedicines (העיגול בכרטיס הירוק).
// אותו queryKey בשני המקומות – React Query שולח בקשה אחת בלבד ומשתף את התוצאה, בלי כפל קוד.
export function useDayDoses(date: string, patientId?: string) {
    return useQuery({
        queryKey: ['doses', patientId, date, date],
        queryFn: () => getDoses({ from: date, to: date, patientId }),
    })
}
