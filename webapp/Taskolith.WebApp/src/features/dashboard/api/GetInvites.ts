import { apiClient } from '@/lib/axios'

export const GetInvites = async () => {
    const { data } = await apiClient.get('/invitations')
    return data
}
