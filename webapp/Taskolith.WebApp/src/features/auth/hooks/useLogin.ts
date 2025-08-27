import { useMutation } from '@tanstack/react-query'
import * as authService from '@/features/auth/api/auth'
import { useAuth } from '@/features/auth/context/AuthContext'
import { type LoginCredentials, type LoginResponse } from '@/features/auth/types/auth'

export const useLogin = () => {
    const { login } = useAuth()

    return useMutation<LoginResponse, Error, LoginCredentials>({
        mutationFn: authService.login,
        onSuccess: (data) => {
            login(data.user)
        }
    })
}
