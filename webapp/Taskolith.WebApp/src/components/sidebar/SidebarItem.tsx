import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { type SidebarItemProps } from '@/components/sidebar/types'

const SidebarItem: React.FC<SidebarItemProps> = ({
    label,
    to,
    icon,
    isCollapsed = false,
    onClick,
    variant = 'default',
}) => {
    const isBreadcrumb = variant === 'breadcrumb'

    const baseClasses = 'flex w-full rounded-lg transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
    let dynamicClasses = ''

    if (isBreadcrumb) {
        dynamicClasses = 'flex-row items-center h-8 px-2 text-sm text-gray-600 hover:bg-gray-100'
    } else {
        if (isCollapsed) {
            dynamicClasses = 'items-center justify-center h-14 text-gray-700 hover:bg-gray-100'
        } else {
            dynamicClasses = 'flex-row items-center h-11 px-3 text-gray-700 hover:bg-gray-100'
        }
    }

    const content = (
        <>
            <div className="flex-shrink-0">{icon}</div>
            <div className={`overflow-hidden transition-all duration-200 ease-in-out ${isCollapsed ? 'w-0' : 'w-full ml-3'}`}>
                <span
                    className={`whitespace-nowrap transition-transform transition-opacity duration-200 ease-in-out origin-left
                        ${isCollapsed ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'}
                        ${isBreadcrumb ? 'font-medium' : 'font-semibold'}
                    `}
                >
                    {label}
                </span>
            </div>
        </>
    )

    const fullClasses = `${baseClasses} ${dynamicClasses}`

    if (to) {
        if (variant === 'default') {
            return (
                <NavLink to={to} end className={({ isActive }) =>
                    `${fullClasses} 
                     ${isActive && !isCollapsed ? 'bg-blue-100 font-bold text-blue-700' : ''}
                     ${isActive && isCollapsed ? 'bg-blue-100 text-blue-700' : ''}`
                }>
                    {content}
                </NavLink>
            )
        }
        return (
            <Link to={to} className={fullClasses}>
                {content}
            </Link>
        )
    }

    return (
        <button onClick={onClick} className={fullClasses}>
            {content}
        </button>   
    )
}

export default SidebarItem
