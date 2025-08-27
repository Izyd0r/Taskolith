import { createContext, useContext, useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'

type AuthContextType = {
    user: User | null
    login: (userData: User) => void
    logout: () => void
    isAuthenticated: boolean
    isLoading: boolean
}

type User = {
    userId: string
    username: string
    email: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const queryClient = useQueryClient()

    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const checkUserStatus = async () => {
            try {
                const response = await api.get<{ user: User }>('/auth/status')

                setUser(response.data.user);
            } catch (error) {
                setUser(null)
            } finally {
                setIsLoading(false)
            }
        };

        checkUserStatus();
    }, [])

    const login = (userData: User) => {
        setUser(userData);
    }

    const logout = async () => {
        queryClient.clear()

        try {
            await api.post('/auth/logout')
        } catch (error) {
            console.error("Logout failed", error)
        } finally {
            setUser(null)
        }
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context
}
