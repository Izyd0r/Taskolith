import { useQuery } from '@tanstack/react-query'
import { getMyTasks } from '@/features/dashboard/api/Tasks'
import { type MyTasksApiResponse, type TaskItem } from '@/features/dashboard/types/Task'

export const useGetMyTasks = () => {
    return useQuery<TaskItem[]>({
        queryKey: ['my-tasks'],
        queryFn: async () => {
            const response: MyTasksApiResponse = await getMyTasks()
            return response.tasks || []
        },
    })
}
