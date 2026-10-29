interface CardSkeletonProps {
    count?: number // כמה כרטיסים אפורים להציג
    height?: number // גובה כל כרטיס בפיקסלים
    className?: string // הפריסה – אותה רשת כמו של הכרטיסים האמיתיים
}

// הנפשה: שלד טעינה – כרטיסים אפורים עם הבהוב עדין, במקום "טוען...".
// רכיב משותף לרשימת המטופלים, למרשמים ולמנות. role="status" – קורא מסך מקריא "טוען".
const CardSkeleton = ({ count = 3, height = 160, className = "grid gap-5 sm:grid-cols-2 lg:grid-cols-3" }: CardSkeletonProps) => {
    return (
        <div className={className} role="status" aria-label="טוען">
            {Array.from({ length: count }, (_, index) => (
                <div key={index} className="skeleton" style={{ height }} />
            ))}
        </div>
    )
}
export default CardSkeleton
