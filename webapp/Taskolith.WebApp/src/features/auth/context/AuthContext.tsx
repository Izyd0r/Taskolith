import React, { createContext, useContext } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import apiClient from "@/lib/axios"

type User = {
    userId: string
    username: string
    email: string
}

type AuthContextType = {
    user: User | null
    login: () => Promise<void>
    logout: () => Promise<void>
    isAuthenticated: boolean
    isLoading: boolean
}

export const authQueryKey = ['auth-status']

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const getAuthStatus = async (): Promise<User> => {
    const response = await apiClient.get<User>("/auth/status")
    return response.data
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const queryClient = useQueryClient()

    const { data: user, isLoading, isError } = useQuery<User>({
        queryKey: authQueryKey,
        queryFn: getAuthStatus,
        retry: false,
        refetchOnWindowFocus: false,
    })

    const login = async () => {
        await queryClient.invalidateQueries({ queryKey: authQueryKey })
    }

    const logout = async () => {
        try {
            await apiClient.post("/auth/logout")
        } catch (e) {
            console.error("Logout API failed", e)
        } finally {
            queryClient.setQueryData(authQueryKey, null)
            await queryClient.invalidateQueries({ queryKey: authQueryKey })
        }
    }

    const contextValue = {
        user: isError ? null : user || null,
        login,
        logout,
        isAuthenticated: !isError && !!user,
        isLoading,
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
    return ctx
}
