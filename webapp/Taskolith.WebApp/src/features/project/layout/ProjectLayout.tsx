import { Outlet } from 'react-router-dom'
import ProjectSidebar from '@/features/project/components/ProjectSidebar'

const ProjectLayout = () => {
    return (
        <div className="flex bg-gray-50 min-h-screen" >
            <ProjectSidebar />
            < main className="flex-1 flex flex-col overflow-hidden" >
                <div className="flex-1 overflow-x-hidden overflow-y-auto" >
                    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8" >
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    )
}

export default ProjectLayout
