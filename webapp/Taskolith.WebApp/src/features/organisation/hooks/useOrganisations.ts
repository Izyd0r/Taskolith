import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { UpdateOrganisation, DeleteOrganisation } from '@/features/organisation/api/Organisations'

export const useUpdateOrganisation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: UpdateOrganisation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organisations'] })
            alert('Organisation updated successfully!')
        },
        onError: (error: any) => {
            alert(`Failed to update organisation: ${error.message}`)
        }
    })
}

export const useDeleteOrganisation = () => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    return useMutation({
        mutationFn: DeleteOrganisation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organisations'] })
            alert('Organisation deleted successfully.')
            navigate('/dashboard')
        },
        onError: (error: any) => {
            alert(`Failed to delete organisation: ${error.message}`)
        }
    })
}
