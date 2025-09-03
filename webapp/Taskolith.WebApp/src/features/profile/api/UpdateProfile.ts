import apiClient from '@/lib/axios'
import { type UpdateProfileRequest, type UserProfileResponse } from '../types/Profile'

export const UpdateProfile = async (data: UpdateProfileRequest): Promise<UserProfileResponse> => {
    try {
        const response = await apiClient.put<UserProfileResponse>('/users/me', data)
        return response.data
    } catch (error: any) {
        console.error('Failed to update profile:', error)
        const errorMessage = error.response?.data?.message || 'An error occurred while updating your profile.'
        throw new Error(errorMessage)
    }
}
