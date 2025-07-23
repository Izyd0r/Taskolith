import { useMutation } from '@tanstack/react-query'
import { useAuth } from '@/features/auth/context/AuthContext'
import { useNavigate } from 'react-router-dom'

export const useLogout = () => {
    const { logout } = useAuth()
    const navigate = useNavigate()

    return useMutation({
        mutationFn: async () => {
            logout()
        },
        onSuccess: () => {
            navigate("/login")
        }
    });
};
