import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'

const Layout = () => {
    const location = useLocation()
    return (
        <>
             <Header />
            {/* עיצוב: עמודה מרכזית ברוחב קבוע, עם ריווח מהצדדים */}
            <main className="mx-auto w-full max-w-[1180px] px-4 py-6 sm:px-8">
                {/* הנפשה: כל עמוד חדש נכנס בהופעה רכה. key – כדי שההנפשה תרוץ מחדש בכל מעבר עמוד */}
                <div key={location.pathname} className="page-enter">
                    <Outlet />
                </div>
            </main>
        </>
    )
}
export default Layout