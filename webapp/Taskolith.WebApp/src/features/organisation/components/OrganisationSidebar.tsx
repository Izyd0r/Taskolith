import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { useLogout } from '@/features/auth/hooks/useLogout'
import { useAuth } from '@/features/auth/context/AuthContext'
import {
    FolderKanban,
    Users,
    CalendarClock,
    ShieldCheck,
    Mail,
    Settings,
    ChevronsLeft,
    ChevronsRight,
    Home,
} from 'lucide-react'

const LG_BREAKPOINT = 1024

const OrganisationSidebar: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = useState(() => window.innerWidth < LG_BREAKPOINT)
    const { mutate: logout } = useLogout()
    const { user } = useAuth()

    const baseTextTransition = 'transition-all duration-200 ease-in-out'

    const getNavLinkClasses = ({ isActive }: { isActive: boolean }): string =>
        `flex flex-col items-center justify-center py-3 rounded-lg text-blue-600 hover:bg-blue-50 ${isActive ? 'bg-blue-100 font-bold text-blue-800' : 'font-medium'
        }`

    useEffect(() => {
        const handleResize = () => {
            setIsCollapsed(window.innerWidth < LG_BREAKPOINT)
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <aside
            className={`flex flex-col bg-white shadow-xl z-20 relative transition-all duration-300 ease-in-out ${isCollapsed ? 'w-24' : 'w-64'
                }`}
        >
            <div className="flex items-center justify-between h-16 p-4 shrink-0">
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 rounded-lg hover:bg-gray-200"
                    aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {isCollapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
                </button>
            </div>

            <div className="flex-1 flex flex-col overflow-y-auto p-4 bg-third-background">
                <nav className="flex-1 space-y-2">
                    <NavLink to="/dashboard" end className={getNavLinkClasses}>
                        <Home size={24} />
                        <span
                            className={`mt-1 text-xs whitespace-nowrap ${baseTextTransition} ${isCollapsed ? 'opacity-0 h-0' : 'opacity-100 h-auto delay-150'
                                }`}
                        >
                            Home
                        </span>
                    </NavLink>

                    <NavLink to="projects" className={getNavLinkClasses}>
                        <FolderKanban size={24} />
                        <span
                            className={`mt-1 text-xs whitespace-nowrap ${baseTextTransition} ${isCollapsed ? 'opacity-0 h-0' : 'opacity-100 h-auto delay-100'
                                }`}
                        >
                            Projects
                        </span>
                    </NavLink>

                    <NavLink to="members" className={getNavLinkClasses}>
                        <Users size={24} />
                        <span
                            className={`mt-1 text-xs whitespace-nowrap ${baseTextTransition} ${isCollapsed ? 'opacity-0 h-0' : 'opacity-100 h-auto delay-150'
                                }`}
                        >
                            Members
                        </span>
                    </NavLink>

                    <NavLink to="schedule" className={getNavLinkClasses}>
                        <CalendarClock size={24} />
                        <span
                            className={`mt-1 text-xs whitespace-nowrap ${baseTextTransition} ${isCollapsed ? 'opacity-0 h-0' : 'opacity-100 h-auto delay-200'
                                }`}
                        >
                            Schedule
                        </span>
                    </NavLink>

                    <NavLink to="roles" className={getNavLinkClasses}>
                        <ShieldCheck size={24} />
                        <span
                            className={`mt-1 text-xs whitespace-nowrap ${baseTextTransition} ${isCollapsed ? 'opacity-0 h-0' : 'opacity-100 h-auto delay-250'
                                }`}
                        >
                            Roles
                        </span>
                    </NavLink>

                    <NavLink to="invites" className={getNavLinkClasses}>
                        <Mail size={24} />
                        <span
                            className={`mt-1 text-xs whitespace-nowrap ${baseTextTransition} ${isCollapsed ? 'opacity-0 h-0' : 'opacity-100 h-auto delay-300'
                                }`}
                        >
                            Invites
                        </span>
                    </NavLink>

                    <NavLink to="settings" className={getNavLinkClasses}>
                        <Settings size={24} />
                        <span
                            className={`mt-1 text-xs whitespace-nowrap ${baseTextTransition} ${isCollapsed ? 'opacity-0 h-0' : 'opacity-100 h-auto delay-350'
                                }`}
                        >
                            Edit Org
                        </span>
                    </NavLink>
                </nav>

                <div
                    className={`
            border-t overflow-hidden transition-all duration-300 ease-in-out
            ${isCollapsed
                            ? 'h-0 opacity-0 p-0 border-0'
                            : 'h-auto opacity-100 p-4 mt-4 border-t delay-400'
                        }
          `}
                >
                    <div className="flex flex-col items-center">
                        <img
                            src="https://i.pravatar.cc/48"
                            alt="User avatar"
                            className="w-12 h-12 rounded-full shrink-0"
                        />
                        <div className="text-center mt-2 mb-2">
                            <h4 className="font-semibold text-sm">{user}</h4>
                        </div>
                        <Button variant="default" onClick={() => logout()}>
                            Logout
                        </Button>
                    </div>
                </div>
            </div>
        </aside>
    )
}

export default OrganisationSidebar
