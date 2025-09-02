import React from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { Home, LayoutDashboard, CheckSquare, Mail, FolderKanban, Users, ShieldCheck, Settings, Kanban, CornerUpLeft } from 'lucide-react'
import SidebarLayout from '@/components/sidebar/SidebarLayout'
import SidebarItem from '@/components/sidebar/SidebarItem'
import { useGetOrganisation } from '@/features/organisation/hooks/useGetOrganisation'
import { useGetProject } from '@/features/project/hooks/useGetProject'
import { UserProfileTile } from './UserProfileTile'
import { useLogout } from '@/features/auth/hooks/useLogout'

interface BreadcrumbTrailProps { isCollapsed?: boolean }
const BreadcrumbTrail: React.FC<BreadcrumbTrailProps> = ({ isCollapsed = false }) => {
    const navigate = useNavigate()
    const { organisationId, projectId } = useParams<{ organisationId: string, projectId: string }>()
    const { data: organisation, isLoading: isLoadingOrg } = useGetOrganisation(organisationId!)
    const { data: project, isLoading: isLoadingProj } = useGetProject(organisationId!, projectId!)
    if (isCollapsed) return null
    const handleGoUp = () => {
        if (projectId) navigate(`/organisations/${organisationId}/projects`)
        else if (organisationId) navigate('/dashboard')
    }
    return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 space-y-2">
            <div className="flex justify-between items-center px-2">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Navigation</h3>
                {organisationId && (
                    <button onClick={handleGoUp} className="p-1 rounded-md hover:bg-gray-200 text-gray-500 hover:text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" title="Go up one level"><CornerUpLeft size={16} /></button>
                )}
            </div>
            <SidebarItem label="Dashboard" to="/dashboard" icon={<Home size={18} />} variant="breadcrumb" />
            {organisationId && (
                <div className="ml-3 pl-3 border-l-2 border-gray-200">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 mt-2">Organisation</p>
                    <SidebarItem label={isLoadingOrg ? 'Loading...' : organisation?.organisationName || '...'} to={`/organisations/${organisationId}/projects`} icon={<LayoutDashboard size={18} />} variant="breadcrumb" />
                    {projectId && (
                        <div className="mt-2 pl-4">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Project</p>
                            <SidebarItem label={isLoadingProj ? 'Loading...' : project?.projectName || '...'} to={`/organisations/${organisationId}/projects/${projectId}/kanban`} icon={<FolderKanban size={18} />} variant="breadcrumb" />
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}


interface AppSidebarProps {
    isCollapsed?: boolean
}

const AppSidebarContent: React.FC<AppSidebarProps> = ({ isCollapsed = false }) => {
    const location = useLocation()
    const { organisationId, projectId } = useParams<{ organisationId: string, projectId: string }>()

    const { mutate: logout, isPending: isLoggingOut } = useLogout()

    const getProfileUrl = (): string => {
        if (projectId && organisationId) return `/organisations/${organisationId}/projects/${projectId}/profile`
        if (organisationId) return `/organisations/${organisationId}/profile`
        return '/dashboard/profile'
    }

    const getNavItems = () => {
        const commonProps = { isCollapsed }
        if (location.pathname.includes('/projects/')) {
            return (
                <>
                    <SidebarItem label="Kanban" to="kanban" icon={<Kanban size={20} />} {...commonProps} />
                    <SidebarItem label="Members" to="members" icon={<Users size={20} />} {...commonProps} />
                    <SidebarItem label="Settings" to="settings" icon={<Settings size={20} />} {...commonProps} />
                </>
            )
        }
        if (location.pathname.startsWith('/organisations/')) {
            return (
                <>
                    <SidebarItem label="Projects" to={`/organisations/${organisationId}/projects`} icon={<FolderKanban size={20} />} {...commonProps} />
                    <SidebarItem label="Access" to={`/organisations/${organisationId}/access`} icon={<Users size={20} />} {...commonProps} />
                    <SidebarItem label="Roles" to={`/organisations/${organisationId}/roles`} icon={<ShieldCheck size={20} />} {...commonProps} />
                    <SidebarItem label="Settings" to={`/organisations/${organisationId}/settings`} icon={<Settings size={20} />} {...commonProps} />
                </>
            )
        }
        return (
            <>
                <SidebarItem label="Dashboard" to="/dashboard" icon={<LayoutDashboard size={20} />} {...commonProps} />
                <SidebarItem label="My Tasks" to="/dashboard/tasks" icon={<CheckSquare size={20} />} {...commonProps} />
                <SidebarItem label="My Invites" to="/dashboard/invites" icon={<Mail size={20} />} {...commonProps} />
            </>
        )
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow">
                <BreadcrumbTrail isCollapsed={isCollapsed} />
                {!isCollapsed && <div className="my-4 border-t border-gray-200" />}
                <div className="px-2 space-y-1">
                    {getNavItems()}
                </div>
            </div>

            <div className="mt-auto flex-shrink-0 p-2 border-t border-gray-200">
                <UserProfileTile
                    isCollapsed={isCollapsed}
                    profileUrl={getProfileUrl()}
                    isLoggingOut={isLoggingOut}
                    onLogout={() => logout()}
                />
            </div>
        </div>
    )
}

const AppSidebar: React.FC = () => {
    return (
        <SidebarLayout>
            <AppSidebarContent />
        </SidebarLayout>
    )
}

export default AppSidebar
