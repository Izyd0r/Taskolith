import { useMutation } from '@tanstack/react-query'
import { DeleteProfile } from '@/features/profile/api/DeleteProfile'

export const useDeleteProfile = () => {
    return useMutation({
        mutationFn: DeleteProfile,
    })
}
