export function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('he-IL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    })
} export function toDateString(d: Date): string {
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`

}
export function todayString(): string {
    return toDateString(new Date())
}
export function weekRange(date: string): { from: string; to: string } {
    const [year, month, day] = date.split('-').map(Number)
    const sunday = new Date(year, month - 1, day)
    sunday.setDate(sunday.getDate() - sunday.getDay())
    const saturday = new Date(sunday)
    saturday.setDate(sunday.getDate() + 6)
    return { from: toDateString(sunday), to: toDateString(saturday) }
}
export function formatTime(iso: string): string {
    return new Date(iso).toLocaleTimeString('he-IL', {
        hour: '2-digit',
        minute: '2-digit',
    })
}
// עיצוב: חלק היום לפי השעה – מוצג מתחת לשעה בכרטיס המנה
export function partOfDay(iso: string): string {
    const hour = new Date(iso).getHours()
    if (hour < 12) return 'בוקר'
    if (hour < 17) return 'צהריים'
    return 'ערב'
}

// עיצוב: יום/חודש בלבד, לכותרת השבוע – למשל "18/10"
export function formatDayMonth(date: string): string {
    const [, month, day] = date.split('-')
    return `${day}/${month}`
}

// עיצוב: תאריך מלא לכרטיס הפתיחה – למשל "יום שלישי, 27 באוקטובר"
export function formatLongDate(d: Date = new Date()): string {
    return d.toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' })
}

// עיצוב: ברכה לפי השעה – "בוקר טוב", "צהריים טובים", "ערב טוב", "לילה טוב"
export function greeting(d: Date = new Date()): string {
    const hour = d.getHours()
    if (hour >= 5 && hour < 12) return 'בוקר טוב'
    if (hour >= 12 && hour < 17) return 'צהריים טובים'
    if (hour >= 17 && hour < 22) return 'ערב טוב'
    return 'לילה טוב'
}
