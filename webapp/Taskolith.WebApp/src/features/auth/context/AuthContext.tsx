import { createContext, useContext, useState, useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import api from "@/lib/axios"

type User = {
    userId: string
    username: string
    email?: string
}

type AuthContextType = {
    user: User | null
    login: (user: User) => void
    logout: () => Promise<void>
    isAuthenticated: boolean
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const queryClient = useQueryClient()

    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const checkAuthStatus = async () => {
        try {
            const res = await api.get<User>("/auth/status")
            setUser(res.data) // Set the full user object with email
        } catch {
            setUser(null)
        } finally {
            if (isLoading) {
                setIsLoading(false)
            }
        }
    }

    useEffect(() => {
        checkAuthStatus()
    }, [])

    const login = (user: User) => {
        setUser(user)
        checkAuthStatus()
    }

    const logout = async () => {
        queryClient.clear()
        try {
            await api.post("/auth/logout")
        } catch (e) {
            console.error("Logout failed", e)
        } finally {
            setUser(null)
        }
    }

    return (
        <AuthContext.Provider
            value={{ user, login, logout, isAuthenticated: !!user, isLoading }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
    return ctx
}
