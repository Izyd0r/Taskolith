import apiClient from '@/lib/axios'
import { type MyTasksApiResponse } from '../types/Task'

export const getMyTasks = async (): Promise<MyTasksApiResponse> => {
    const response = await apiClient.get('/tasks/my-tasks')
    return response.data
}
