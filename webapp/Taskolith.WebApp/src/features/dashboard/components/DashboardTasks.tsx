import React, { useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useGetMyTasks } from '@/features/dashboard/hooks/useGetMyTasks'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { Button } from '@/components/ui/Button'
import { Building, Calendar, CheckSquare, Flag, Kanban, Search, X } from 'lucide-react'
import { type TaskItem } from '@/features/dashboard/types/Task'

const priorityOptions = [
    { name: 'Critical', value: 1, className: 'text-purple-600 bg-purple-100' },
    { name: 'High', value: 2, className: 'text-red-600 bg-red-100' },
    { name: 'Medium', value: 3, className: 'text-yellow-600 bg-yellow-100' },
    { name: 'Low', value: 4, className: 'text-blue-600 bg-blue-100' },
    { name: 'Lowest', value: 5, className: 'text-gray-600 bg-gray-100' },
] as const

const DashboardTasks: React.FC = () => {
    const navigate = useNavigate()
    const { data: tasks, isLoading, isError, error } = useGetMyTasks()
    const { register, control, reset } = useForm({
        defaultValues: { nameFilter: '', orgFilter: '', priorityFilter: '', dateFilter: '' }
    })

    const filterValues = useWatch({ control })

    const organisations = useMemo(() => {
        if (!tasks) return []
        const orgMap = new Map<string, string>()
        tasks.forEach(item => {
            if (!orgMap.has(item.organisation.organisationId)) {
                orgMap.set(item.organisation.organisationId, item.organisation.organisationName)
            }
        })
        return Array.from(orgMap, ([id, name]) => ({ id, name }))
    }, [tasks])

    const filteredTasks = useMemo(() => {
        if (!tasks) return []
        return tasks.filter(item => {
            const nameMatch = filterValues.nameFilter ? item.task.title.toLowerCase().includes(filterValues.nameFilter.toLowerCase()) : true
            const orgMatch = filterValues.orgFilter ? item.organisation.organisationId === filterValues.orgFilter : true
            const priorityMatch = filterValues.priorityFilter ? item.task.priority === parseInt(filterValues.priorityFilter, 10) : true
            const dateMatch = filterValues.dateFilter ? new Date(item.task.dueDate).toISOString().split('T')[0] === filterValues.dateFilter : true
            return nameMatch && orgMatch && priorityMatch && dateMatch
        })
    }, [tasks, filterValues])

    const handleNavigateToBoard = (taskItem: TaskItem) => {
        navigate(`/organisations/${taskItem.organisation.organisationId}/projects/${taskItem.project.projectId}/kanban`)
    }

    const renderList = () => {
        if (isLoading) {
            return <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>
        }
        if (isError) {
            return <p className="text-red-500 text-center p-6">Error: {(error as Error).message}</p>
        }
        if (!tasks || tasks.length === 0) {
            return <div className="text-center py-10 text-gray-500 flex flex-col justify-center items-center bg-white rounded-lg border border-dashed h-48"><CheckSquare className="w-12 h-12 text-gray-400 mb-4" /><p className="font-medium text-gray-800">No Tasks Found</p><p className="text-sm">You're all caught up!</p></div>
        }
        if (filteredTasks.length === 0) {
            return <div className="text-center py-10 text-gray-500 flex flex-col justify-center items-center bg-white rounded-lg border border-dashed h-48"><Search className="w-12 h-12 text-gray-400 mb-4" /><p className="font-medium text-gray-800">No Tasks Match Filters</p><p className="text-sm">Try adjusting or clearing your filters.</p></div>
        }
        return (
            <div className="space-y-4">
                {filteredTasks.map((item) => {
                    const priorityInfo = priorityOptions.find(p => p.value === item.task.priority) || priorityOptions[2]

                    return (
                        <div
                            key={item.task.taskId}
                            className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col gap-3"
                        >
                            <div className="flex justify-between items-start gap-4">
                                <h3 className="text-lg font-bold text-gray-900">{item.task.title}</h3>
                                <div className="flex-shrink-0">
                                    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full ${priorityInfo.className}`}>
                                        <Flag size={12} />
                                        <span className="text-xs font-semibold">{priorityInfo.name}</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">{item.task.description || 'No description provided.'}</p>
                            <div className="flex items-center text-sm text-gray-500">
                                <Calendar size={14} className="mr-2 flex-shrink-0" />
                                <span>Due on {new Date(item.task.dueDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>

                            <div className="flex justify-between items-center pt-3 mt-2 border-t border-gray-100">
                                <div className="flex items-center">
                                    <Building className="h-4 w-4 text-gray-400" />
                                    <span className="ml-2 text-xs font-medium text-gray-500">{item.organisation.organisationName} / {item.project.projectName}</span>
                                </div>
                                <Button variant="default" size="sm" onClick={() => handleNavigateToBoard(item)}>
                                    <Kanban size={14} className="mr-2" />
                                    Go to Board
                                </Button>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }

    return (
        <div className="h-full bg-gray-50 p-4 sm:p-6 flex flex-col">
            <div className="flex-shrink-0">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
                    <Button variant="outline" size="sm" onClick={() => reset()}><X size={14} className="mr-2" />Clear Filters</Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input {...register('nameFilter')} placeholder="Filter by name..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
                    </div>
                    <select {...register('orgFilter')} className="w-full py-2 px-3 border border-gray-200 rounded-lg hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                        <option value="">All Organisations</option>
                        {organisations.map(org => <option key={org.id} value={org.id}>{org.name}</option>)}
                    </select>
                    <select {...register('priorityFilter')} className="w-full py-2 px-3 border border-gray-200 rounded-lg hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                        <option value="">All Priorities</option>
                        {priorityOptions.map(p => <option key={p.value} value={p.value}>{p.name}</option>)}
                    </select>
                    <input {...register('dateFilter')} type="date" className="w-full py-2 px-3 border border-gray-200 rounded-lg hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" />
                </div>
            </div>
            <div className="relative flex-grow min-h-0">
                <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-gray-50 to-transparent z-10 pointer-events-none" />
                <div className="h-full overflow-y-auto pr-2 pl-1 pt-2 pb-2">{renderList()}</div>
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-gray-50 to-transparent z-10 pointer-events-none" />
            </div>
        </div>
    )
}

export default DashboardTasks
