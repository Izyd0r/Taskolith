import { createContext, useContext, useState, useEffect } from 'react'

type AuthContextType = {
    user: string | null
    token: string | null
    login: (username: string, token: string) => void
    logout: () => void
    isAuthenticated: boolean
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<string | null>(null)
    const [token, setToken] = useState<string | null>(null)

    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        const storedToken = localStorage.getItem('token')

        if (storedUser && storedToken) {
            setUser(storedUser)
            setToken(storedToken)
        }
    }, [])

    const login = (username: string, jwt: string) => {
        setUser(username)
        setToken(jwt)

        localStorage.setItem('user', username)
        localStorage.setItem('token', jwt)
    }
    
    const logout = () => {
        setUser(null)
        setToken(null)
    
        localStorage.removeItem('user')
        localStorage.removeItem('token')
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if(!context) throw new Error("useAuth must be used within an AuthProvider")
    return context
}
