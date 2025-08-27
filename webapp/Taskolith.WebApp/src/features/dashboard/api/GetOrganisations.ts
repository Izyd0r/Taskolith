import apiClient from '@/lib/axios'

export const GetOrganisations = async () => {
    const { data } = await apiClient.get('/organisations/user')
    return data
}
