import React, { useState, useEffect, cloneElement, isValidElement, type ReactNode } from 'react'
import { ChevronsLeft, ChevronsRight } from 'lucide-react'

interface SidebarLayoutProps {
    children: ReactNode
}

const LG_BREAKPOINT = 1024

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
    const [isCollapsed, setIsCollapsed] = useState(() => window.innerWidth < LG_BREAKPOINT)

    useEffect(() => {
        const handleResize = () => setIsCollapsed(window.innerWidth < LG_BREAKPOINT)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const childrenWithProps = React.Children.map(children, child => {
        if (isValidElement(child)) {
            return cloneElement(child, { isCollapsed } as any)
        }
        return child
    })

    return (
        <aside
            className={`flex flex-col bg-white shadow-xl transition-all duration-300 ease-in-out ${isCollapsed ? 'w-24' : 'w-64'}`}
        >
            <div className="flex items-center justify-between h-16 p-4 flex-shrink-0">
                {!isCollapsed && <span className="font-bold text-gray-800 text-4xl">Taskolith</span>}
                <button
                    onClick={() => setIsCollapsed(prev => !prev)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                >
                    {isCollapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
                </button>
            </div>

            <div className="flex-1 flex flex-col overflow-y-auto">
                <nav className="flex-grow p-4 space-y-2">
                    {childrenWithProps}
                </nav>
            </div>
        </aside>
    )
}

export default SidebarLayout
