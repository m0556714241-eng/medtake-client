import { useEffect, useRef, type ReactNode } from "react"

interface RevealProps {
    children: ReactNode
    className?: string
}

// הנפשה: הקטע מחליק פנימה רק כשגוללים אליו (כמו בסרטון לדוגמה).
// IntersectionObserver מודיע כשהקטע נכנס למסך, ואז מוסיפים את המחלקה revealed – פעם אחת בלבד.
const Reveal = ({ children, className = "" }: RevealProps) => {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const element = ref.current
        if (!element) return
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                element.classList.add('revealed')
                observer.disconnect()
            }
        }, { threshold: 0.12 })
        observer.observe(element)
        return () => observer.disconnect()
    }, [])

    return <div ref={ref} className={`reveal ${className}`}>{children}</div>
}
export default Reveal
