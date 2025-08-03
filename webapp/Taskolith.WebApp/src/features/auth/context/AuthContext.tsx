import { createContext, useContext, useState, useEffect } from 'react'

type AuthContextType = {
    user: string | null
    userId: string | null
    token: string | null
    login: (username: string, token: string, userId: string) => void
    logout: () => void
    isAuthenticated: boolean
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({
    children,
    initialUsername = null,
    initialToken = null,
    initialUserId = null
}: {
    children: React.ReactNode
    initialUsername?: string | null
    initialToken?: string | null
    initialUserId?: string | null
}) => {
    const [userId, setUserId] = useState<string | null>(initialUserId)
    const [user, setUser] = useState<string | null>(initialUsername)
    const [token, setToken] = useState<string | null>(initialToken)

    useEffect(() => {
        if (!initialUsername || !initialToken || !initialUserId) {
            const storedUser = localStorage.getItem('user')
            const storedToken = localStorage.getItem('token')
            const storedUserId = localStorage.getItem('userId')

            if (storedUser && storedToken && storedUserId) {
                setUser(storedUser)
                setToken(storedToken)
                setUserId(storedUserId)
            }
        }
    }, [])

    const login = (username: string, jwt: string, userId: string) => {
        setUser(username)
        setToken(jwt)
        setUserId(userId)

        localStorage.setItem('user', username)
        localStorage.setItem('token', jwt)
        localStorage.setItem('userId', userId)
    }

    const logout = () => {
        setUser(null)
        setToken(null)
        setUserId(null)

        localStorage.removeItem('user')
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
    }

    return (
        <AuthContext.Provider value={{ user, token, userId, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error("useAuth must be used within an AuthProvider")
    return context
}
