import { createContext, useEffect, useState, type ReactNode } from 'react'
import { getMe, login as loginRequest, register as registerRequest } from '../api/auth'
import type { RegisterRequest, User } from '../types'


export interface AuthContextValue {
    user: User | null,
    token: string | null,
    isLoading: boolean,
    login: (email: string, password: string) => Promise<User>,
    logout: () => void
    register:(data:RegisterRequest)=> Promise<User>

}
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | null>(null)
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
    const [isLoading, setIsLoading] = useState<boolean>(() => localStorage.getItem('token')?true:false)
    const logout = () => {
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
    }
    useEffect(() => {
        // no token: isLoading already started as false
        if (!token) {
            return;

        }
        getMe().then((user)=>{
            setUser(user)
        }).catch((error)=>{
            if(error?.response?.status === 401)
            {
                logout()
            }
        }).finally(()=>setIsLoading(false))
        // רץ פעם אחת בטעינת האתר, בכוונה – אם token היה ברשימה, getMe היה נקרא שוב אחרי כל login
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


const login = async (email: string, password: string) => {
    const result = await loginRequest({ email, password })
    localStorage.setItem('token', result.token)
    setToken(result.token)
    setUser(result.user)
    return result.user
}
const register = async (data: RegisterRequest) => {
    const result = await registerRequest(data)
    localStorage.setItem('token', result.token)
    setToken(result.token)
    setUser(result.user)
    return result.user
}
return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, register }}>
        {children}
    </AuthContext.Provider>
)
}