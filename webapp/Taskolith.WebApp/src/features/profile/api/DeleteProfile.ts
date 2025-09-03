import apiClient from '@/lib/axios'

export const DeleteProfile = async (): Promise<void> => {
    try {
        await apiClient.delete('/users/me');
    } catch (error: any) {
        console.error('Failed to delete profile:', error);
        const errorMessage = error.response?.data?.message || 'An error occurred while deleting your account.';
        throw new Error(errorMessage);
    }
};
