import { useMutation } from '@tanstack/react-query'
import { UpdateProfile } from '@/features/profile/api/UpdateProfile'
import { type UpdateProfileRequest } from '@/features/profile/types/Profile'

export const useUpdateProfile = () => {
    return useMutation({
        mutationFn: (data: UpdateProfileRequest) => UpdateProfile(data),
    })
}
