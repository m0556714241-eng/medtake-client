import type { ReactNode } from "react"

interface FormSectionProps {
    title: string
    children: ReactNode
}

// עיצוב: קטע בטופס על רקע ירקרק בהיר עם כותרת – כמו "מתי לוקחים" בהדמיה.
// רכיב משותף: כל טופס יכול לעטוף בו חלק מהשדות, בלי לכתוב את העיצוב מחדש.
// fieldset + legend – כך קורא מסך יודע שהשדות שבפנים שייכים לאותו נושא.
const FormSection = ({ title, children }: FormSectionProps) => {
    return (
        <fieldset className="m-0 flex flex-col gap-4 rounded-3xl border-0 bg-[#F5F8F5] p-5">
            <legend className="float-right mb-1 w-full p-0 text-lg font-extrabold">{title}</legend>
            {children}
        </fieldset>
    )
}
export default FormSection
