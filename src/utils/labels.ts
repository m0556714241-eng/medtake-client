import type { DoseStatus, PrescriptionForm, PrescriptionStatus } from "../types";

export const doseStatusLabels: Record<DoseStatus, string> = {
    pending: 'ממתין',
    taken: 'נלקח',
    missed: 'פוספס',
}
export const doseStatusColors: Record<DoseStatus, 'default' | 'success' | 'warning'> = {
    pending: 'default',
    taken: 'success',
    missed: 'warning',
}
export const prescriptionStatusShapes: Record<PrescriptionForm, string> = {
    tablet: 'כדור',
    capsule: 'כמוסה',
    syrup: 'סירופ',
    drops: 'טיפות',
    injection: 'זריקה',
    cream: 'משחה',
    other: 'אחר',
}
export const prescriptionStatusLabels: Record<PrescriptionStatus, string> = {
    active: 'פעיל',
    paused: 'מושהה',
    finished: 'הסתיים',
}
export const prescriptionStatusColors: Record<PrescriptionStatus, 'default' | 'success' | 'warning'> = {
    active: 'success',
    paused: 'warning',
    finished: 'default',
}

export const dayLabels = ["א'", "ב'", "ג'", "ד'", "ה'", "ו'", "ש'"]
// עיצוב: שמות ימים מלאים – לכרטיסי הימים בתצוגה השבועית, כמו בהדמיה
export const dayFullNames = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']
export type DayState = 'complete' | 'missed' | 'pending'
export const dayStateLabels: Record<DayState, string> = {
    complete: 'הכול נלקח',
    missed: 'פוספסה מנה', // עיצוב: הנוסח מההדמיה
    pending: 'מתוכנן', // עיצוב: הנוסח מההדמיה
}
export const dayStateColors: Record<DayState, 'success' | 'warning' | 'default'> = {
    complete: 'success',
    missed: 'warning',
    pending: 'default',
}