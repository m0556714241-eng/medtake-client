import { useEffect, useState } from "react"

interface CountUpProps {
    value: number
    duration?: number // כמה זמן הספירה לוקחת, במילישניות
}

// הנפשה: מספר ש"סופר" מאפס עד הערך – לריבועי המספרים בעמוד הניהול.
// מי שביקש במחשב "הפחתת תנועה" רואה את המספר הסופי מיד.
const CountUp = ({ value, duration = 700 }: CountUpProps) => {
    const [shown, setShown] = useState(0)

    useEffect(() => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const start = performance.now()
        let frame = 0
        const step = (now: number) => {
            const progress = reduce ? 1 : Math.min(1, (now - start) / duration)
            setShown(Math.round(value * progress))
            if (progress < 1) frame = requestAnimationFrame(step)
        }
        frame = requestAnimationFrame(step)
        return () => cancelAnimationFrame(frame)
    }, [value, duration])

    return <>{shown}</>
}
export default CountUp
