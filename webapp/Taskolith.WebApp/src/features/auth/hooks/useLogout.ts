import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/features/auth/context/AuthContext'

export const useLogout = () => {
    const { logout: contextLogout } = useAuth()
    const queryClient = useQueryClient()

    const { mutate, isPending } = useMutation({
        mutationFn: async () => {
            
            await contextLogout()
        },
        onSuccess: () => {
            queryClient.clear()
        },
    })

    return { mutate, isPending }
}
