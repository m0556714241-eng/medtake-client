import { Outlet } from 'react-router-dom'
import Header from './Header'

const Layout = () => {
    return (
        <>
             <Header />
            {/* עיצוב: עמודה מרכזית ברוחב קבוע, עם ריווח מהצדדים */}
            <main className="mx-auto w-full max-w-[1180px] px-4 py-6 sm:px-8">
                <Outlet />
            </main>
        </>
    )
}
export default Layout