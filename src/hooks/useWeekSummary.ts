import { useQuery } from "@tanstack/react-query"
import { getDosesSummary } from "../api/doses"
import { todayString, weekRange } from "../utils/dates"

// עיצוב: hook משותף לסיכום השבוע.
// משמש את WeeklyMedicine (כרטיסי הימים והכותרת) ואת MyMedicines (העיגול בכרטיס הירוק בתצוגה שבועית).
// אותו queryKey בשני המקומות – בקשה אחת לשרת, בלי כפל קוד.
export function useWeekSummary(date: string) {
    const { from, to } = weekRange(date)
    const query = useQuery({
        queryKey: ['doses-summary', from, to],
        queryFn: () => getDosesSummary({ from, to }),
    })
    // סופרים רק ימים שכבר הגיעו (עד היום, כולל) – "נלקחו X מתוך Y עד היום"
    const today = todayString()
    const pastDays = query.data?.filter(day => day.date <= today) ?? []
    const takenSoFar = pastDays.reduce((sum, day) => sum + day.taken, 0)
    const totalSoFar = pastDays.reduce((sum, day) => sum + day.total, 0)
    return { ...query, from, to, takenSoFar, totalSoFar }
}
