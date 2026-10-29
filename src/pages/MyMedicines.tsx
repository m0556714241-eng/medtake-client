import { useAuth } from "../context/useAuth"
import { formatDate, formatTime, greeting, todayString } from "../utils/dates"
import { useDayDoses } from "../hooks/useDayDoses"
import ProgressRing from "../components/ProgressRing"
import { useState } from "react"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import ToggleButton from "@mui/material/ToggleButton"
import DailyMedicine from "../components/DailyMedicine"
import WeeklyMedicine from "../components/WeeklyMedicine"
import { useNavigate, useParams } from "react-router-dom"

type View = 'daily' | 'weekly'
const MyMedicines = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const date = useParams().date ?? todayString() 
    const [view, setView] = useState<View>('daily')
    // עיצוב: אותן מנות כמו ברשימה (אותו מפתח – בקשה אחת), בשביל העיגול והמשפט בכרטיס הירוק
    const { data: doses } = useDayDoses(date)
    const total = doses?.length ?? 0
    const taken = doses?.filter(dose => dose.status === 'taken').length ?? 0
    const nextDose = doses?.find(dose => dose.status === 'pending')
    const subtitle =
        !doses ? 'טוען את התרופות של היום...'
            : total === 0 ? 'אין תרופות ביום הזה.'
                : taken === total ? 'כל התרופות של היום נלקחו. כל הכבוד!'
                    : `נשארו עוד ${total - taken} תרופות להיום.` + (nextDose ? ` הבאה ב־${formatTime(nextDose.scheduledAt)}.` : '')
    const handleSelectDay =(day:string)=>{
        navigate(`/my-medicines/${day}`)
        setView('daily')
    
    }

    // עיצוב: המתג מוגדר פעם אחת ומוצג במקום אחר לפי התצוגה – בלי לכתוב אותו פעמיים
    const toggle = (
        <ToggleButtonGroup
                value={view}
                exclusive
               onChange={(_,value:View|null)=>{
                if(value)
                    setView(value)
               }}
                size="small"
                className={view === 'daily' ? 'self-center' : ''} /* עיצוב: ביומי – במרכז */
            >
                <ToggleButton value="daily">יומי</ToggleButton>
                <ToggleButton value="weekly">שבועי</ToggleButton>
            </ToggleButtonGroup>
    )

    return (
        <div className="flex flex-col gap-5">
            {/* עיצוב: כרטיס פתיחה ירוק עם ברכה ותאריך – כמו בהדמיה */}
            {/* עיצוב: הכרטיס הירוק מוצג רק בתצוגה היומית – בשבועית השבוע מקבל את כל המקום */}
            {view === 'daily' && (
            <section className="drop-in flex flex-wrap items-center justify-between gap-6 rounded-[32px] bg-gradient-to-br from-primary via-[#2C6358] to-primary-dark px-8 py-7 text-white shadow-[0_24px_48px_-26px_rgba(33,78,72,.8)]">
                <div>
                    <div className="opacity-85">{formatDate(date)}</div>
                    <h1 className="m-0 mt-1 text-[36px] font-extrabold leading-tight">{greeting()}, {user?.fullName}</h1> {/* עיצוב: ברכה לפי השעה */}
                    <p className="m-0 mt-2 text-lg opacity-90">{subtitle}</p>
                </div>
                {/* עיצוב: עיגול לבן גדול בתוך הכרטיס – כמו בהדמיה */}
                {total > 0 && (
                    <ProgressRing taken={taken} total={total} size={130} color="#FFFFFF" trackColor="rgba(255,255,255,.18)" textColor="#FFFFFF" caption="נלקחו" />
                )}
            </section>
            )}
            {/* עיצוב: ביומי המתג במרכז; בשבועי הוא עובר לשורת הכותרת של השבוע */}
            {view === 'daily' && toggle}
            {view === 'daily' ?
            <DailyMedicine date={date} canMark={true}></DailyMedicine>
            :<WeeklyMedicine date={date} onSelectDay={handleSelectDay} toggle={toggle} ></WeeklyMedicine>
            }
        </div>

    )

}
export default MyMedicines
