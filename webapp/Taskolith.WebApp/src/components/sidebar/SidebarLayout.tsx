import React, { useState, useEffect, cloneElement, isValidElement, type ReactElement } from 'react'
import { ChevronsLeft, ChevronsRight } from 'lucide-react'
import { type SidebarItemProps } from '@/components/sidebar/types'

interface SidebarLayoutProps {
    children: ReactElement<SidebarItemProps>[] | ReactElement<SidebarItemProps>
    bottomItem?: ReactElement<SidebarItemProps>
}

const LG_BREAKPOINT = 1024

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children, bottomItem }) => {
    const [isCollapsed, setIsCollapsed] = useState(() => window.innerWidth < LG_BREAKPOINT)

    useEffect(() => {
        const handleResize = () => setIsCollapsed(window.innerWidth < LG_BREAKPOINT)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <aside
            className={`flex flex-col bg-white shadow-xl transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'
                }`}
        >
            <div className="flex items-center justify-end h-16 p-4">
                <button
                    onClick={() => setIsCollapsed(prev => !prev)}
                    className="p-2 rounded-lg hover:bg-gray-200"
                >
                    {isCollapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
                </button>
            </div>

            <div className="flex-1 flex flex-col overflow-y-auto p-4 bg-third-background">
                <nav className="space-y-2">
                    {React.Children.map(children, child =>
                        isValidElement(child) ? cloneElement(child, { isCollapsed }) : child
                    )}
                </nav>

                {bottomItem && (
                    <nav className="mt-auto pt-4 border-t">
                        {isValidElement(bottomItem) &&
                            cloneElement(bottomItem, { isCollapsed })}
                    </nav>
                )}
            </div>
        </aside>
    )
}

export default SidebarLayout
