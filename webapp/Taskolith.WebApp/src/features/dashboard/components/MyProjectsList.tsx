import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetMyAllProjects } from '@/features/dashboard/hooks/useGetMyAllProjects'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { ArrowRight, Briefcase, Building } from 'lucide-react'

const MyProjectsList: React.FC = () => {
    const { data: projects, isLoading, isError, error } = useGetMyAllProjects()
    const navigate = useNavigate()

    const renderList = () => {
        if (isLoading) {
            return <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>
        }

        if (isError) {
            return <p className="text-red-500 text-center p-6">Error: {(error as Error).message}</p>
        }

        if (!projects || projects.length === 0) {
            return (
                <div className="text-center py-10 text-gray-500 flex flex-col justify-center items-center bg-white rounded-lg border border-dashed h-48">
                    <Briefcase className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="font-medium text-gray-800">No Projects Found</p>
                    <p className="text-sm">You haven't been assigned to any projects yet.</p>
                </div>
            )
        }

        return (
            <div className="space-y-4">
                {projects.map((project) => (
                    <div
                        key={project.projectId}
                        className="group relative p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg hover:border-blue-400 transition-all duration-300 cursor-pointer flex flex-col justify-between gap-3"
                        onClick={() =>
                            navigate(`/organisations/${project.organisationId}/projects/${project.projectId}`)
                        }
                    >
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 pr-8">{project.projectName}</h3>
                            <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                                {project.projectDescription}
                            </p>
                        </div>

                        <div className="flex items-center pt-2 border-t border-gray-100">
                            <Building className="h-4 w-4 text-gray-400" />
                            <span className="ml-2 text-xs font-medium text-gray-500">
                                {project.organisationName}
                            </span>
                        </div>

                        <ArrowRight className="absolute top-4 right-4 h-5 w-5 text-gray-300 group-hover:text-blue-600 transition-colors" />
                    </div>
                ))}
            </div>
        )
    }

    return (
        <section className="h-full flex flex-col">
            <div className="flex-shrink-0">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">My Projects</h2>
            </div>
            <div className="relative flex-grow min-h-0">
                <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-gray-50 to-transparent z-10 pointer-events-none" />
                <div className="h-full overflow-y-auto pr-2 pl-1 pt-2 pb-2">
                    {renderList()}
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-gray-50 to-transparent z-10 pointer-events-none" />
            </div>
        </section>
    )
}

export default MyProjectsList
