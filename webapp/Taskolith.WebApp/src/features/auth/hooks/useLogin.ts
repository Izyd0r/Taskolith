import { useMutation } from "@tanstack/react-query"
import * as authService from "@/features/auth/api/Auth"
import { useAuth } from "@/features/auth/context/AuthContext"
import { type LoginCredentials, type LoginResponse } from "@/features/auth/types"

export const useLogin = () => {
    const { login } = useAuth()

    return useMutation<LoginResponse, Error, LoginCredentials>({
        mutationFn: authService.login,
        onSuccess: (data) => {
            login({ userId: data.userId, username: data.username })
        },
    })
}
