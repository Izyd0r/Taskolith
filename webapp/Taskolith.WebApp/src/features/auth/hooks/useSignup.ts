import { useMutation } from "@tanstack/react-query"
import * as authService from "@/features/auth/api/Auth"
import { useAuth } from "@/features/auth/context/AuthContext"
import { type SignupCredentials, type SignupResponse } from "@/features/auth/types"

export const useSignup = () => {
    const { login } = useAuth()

    return useMutation<SignupResponse, Error, SignupCredentials>({
        mutationFn: authService.signup,
        onSuccess: (data) => {
            login({ userId: data.userId, username: data.username, email: data.email })
        },
    })
}
