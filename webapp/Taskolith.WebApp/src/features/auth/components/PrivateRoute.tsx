import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'

export const PrivateRoute = () => {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) {
        return <div>Loading...</div> // todo: add spinner
    }
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}
