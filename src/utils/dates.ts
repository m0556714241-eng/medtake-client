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