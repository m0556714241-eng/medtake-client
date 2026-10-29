// עיגול התקדמות, כמו בהדמיה: כמה נלקח מתוך כמה.
// קומפוננטה תצוגתית בלבד – משמשת את כרטיס המטופל, את המנות של היום ואת כרטיסי הימים.
interface ProgressRingProps {
    taken: number
    total: number
    size?: number
    color?: string
    trackColor?: string
    textColor?: string
    caption?: string
}

const ProgressRing = ({
    taken,
    total,
    size = 64,
    color = '#39796B',
    trackColor = '#E3ECE7',
    textColor = '#16242A',
    caption,
}: ProgressRingProps) => {
    const stroke = Math.max(6, Math.round(size / 9))
    const radius = (size - stroke) / 2
    const circumference = 2 * Math.PI * radius
    const part = total > 0 ? taken / total : 0

    return (
        <div className="relative shrink-0" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`נלקחו ${taken} מתוך ${total}`}>
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={trackColor} strokeWidth={stroke} />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={`${circumference * part} ${circumference}`}
                    className="ring-draw" // הנפשה: מתמלא מאפס כשהעיגול מופיע
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                    style={{ transition: 'stroke-dasharray .4s ease' }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center leading-tight" style={{ color: textColor }}>
                <span style={{ fontWeight: 800, fontSize: Math.round(size / 4.2) }}>{taken}/{total}</span>
                {caption && <span style={{ fontSize: Math.max(11, Math.round(size / 9)), opacity: 0.85 }}>{caption}</span>}
            </div>
        </div>
    )
}
export default ProgressRing
