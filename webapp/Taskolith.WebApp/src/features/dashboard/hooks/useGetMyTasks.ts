import { useQuery } from '@tanstack/react-query'
import { getMyTasks } from '@/features/dashboard/api/Tasks'
import { type MyTasksApiResponse, type TaskItem } from '@/features/dashboard/types/Task'

export const useGetMyTasks = () => {
    // The hook is now strongly typed to return the array of TaskItem objects.
    return useQuery<TaskItem[]>({
        queryKey: ['my-tasks'],
        queryFn: async () => {
            // 1. Fetch the full API response.
            const response: MyTasksApiResponse = await getMyTasks()
            // 2. Explicitly return ONLY the 'tasks' array from the response.
            return response.tasks || []
        },
    })
}
