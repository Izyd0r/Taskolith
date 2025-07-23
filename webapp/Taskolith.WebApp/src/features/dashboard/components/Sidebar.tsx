import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/Button'
import { useLogout } from '@/features/auth/hooks/useLogout'
import {
    LayoutDashboard,
    CheckSquare,
    Building,
    Mail,
    ChevronsLeft,
    ChevronsRight,
} from 'lucide-react';

const LG_BREAKPOINT = 1024;

const Sidebar: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = useState(
        () => window.innerWidth < LG_BREAKPOINT
    );

    const baseTextTransition = 'transition-all duration-200 ease-in-out';

    const getNavLinkClasses = ({ isActive }: { isActive: boolean }): string =>
        `flex flex-col items-center justify-center py-3 rounded-lg text-blue-600 hover:bg-blue-50 ${isActive ? 'bg-blue-100 font-bold text-blue-800' : 'font-medium'
        }`;

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < LG_BREAKPOINT) {
                setIsCollapsed(true);
            } else {
                setIsCollapsed(false);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const { mutate: logout } = useLogout();

    return (
        <aside
            className={`flex flex-col bg-white shadow-xl transition-all duration-300 ease-in-out ${isCollapsed ? 'w-24' : 'w-64'
                }`}
        >
            <div className="flex items-center justify-between h-16 p-4 shrink-0">
                <a href="/dashboard">
                    <h1
                        className={`
                    text-main-font-color text-2xl font-bold overflow-hidden
                    transition-all duration-300 ease-in-out
                    ${isCollapsed ? 'w-0 opacity-0' : 'w-32 opacity-100'}
                `}
                    >
                        Taskolith
                    </h1>
                </a>

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
                        <LayoutDashboard size={24} />
                        <span
                            className={`mt-1 text-xs whitespace-nowrap ${baseTextTransition} ${isCollapsed ? 'opacity-0 h-0' : 'opacity-100 h-auto delay-150'
                                }`}
                        >
                            Dashboard
                        </span>
                    </NavLink>
                    <NavLink to="/dashboard/tasks" className={getNavLinkClasses}>
                        <CheckSquare size={24} />
                        <span className={`mt-1 text-xs whitespace-nowrap ${baseTextTransition} ${isCollapsed ? 'opacity-0 h-0' : 'opacity-100 h-auto delay-200'}`}>
                            My Tasks
                        </span>
                    </NavLink>
                    <NavLink to="/dashboard/create-organisation" className={getNavLinkClasses}>
                        <Building size={24} />
                        <span className={`mt-1 text-xs whitespace-nowrap ${baseTextTransition} ${isCollapsed ? 'opacity-0 h-0' : 'opacity-100 h-auto delay-250'}`}>
                            Create Organisation
                        </span>
                    </NavLink>
                    <NavLink to="/dashboard/invites" className={getNavLinkClasses}>
                        <Mail size={24} />
                        <span className={`mt-1 text-xs whitespace-nowrap ${baseTextTransition} ${isCollapsed ? 'opacity-0 h-0' : 'opacity-100 h-auto delay-300'}`}>
                            My Invites
                        </span>
                    </NavLink>
                </nav>
                <div
                    className={`
                        border-t overflow-hidden
                        transition-all duration-300 ease-in-out
                        ${isCollapsed
                            ? 'h-0 opacity-0 p-0 border-0'
                            : 'h-auto opacity-100 p-4 mt-4 border-t delay-350'
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
                            <h4 className="font-semibold text-sm">Ada Lovelace</h4>
                            <p className="text-xs text-gray-500">ada@example.com</p>
                        </div>
                        <Button variant="default" onClick={() => logout()} >
                            Logout
                        </Button>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
