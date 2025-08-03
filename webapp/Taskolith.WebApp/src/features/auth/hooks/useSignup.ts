import { useMutation } from '@tanstack/react-query'
import * as authService from '@/features/auth/api/auth'
import { type SignupCredentials, type SignupResponse } from '@/features/auth/types/auth'
import { useAuth } from '@/features/auth/context/AuthContext'

export const useSignup = () => {
    const { login } = useAuth()

    return useMutation<SignupResponse, Error, SignupCredentials>({
        mutationFn: authService.signup,
        onSuccess: (data) => {
            login(data.username, data.token, data.userId)
        },
    });
}
