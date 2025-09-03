import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/features/auth/context/AuthContext"
import LoadingSpinner from "@/components/ui/LoadingSpinner"

export const PrivateRoute = () => {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) return <div className="flex h-screen w-screen items-center justify-center"><LoadingSpinner /></div>

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}
