import React from 'react'
import { NavLink } from 'react-router-dom'
import { type SidebarItemProps } from '@/components/sidebar/types'

const SidebarItem: React.FC<SidebarItemProps> = ({
    label,
    to,
    icon,
    delay = 100,
    isCollapsed = false,
    onClick,
}) => {
    const classes = `flex flex-col items-center justify-center py-3 rounded-lg text-blue-600 hover:bg-blue-50`;

    const content = (
        <>
            {icon}
            <span
                className={`mt-1 text-xs whitespace-nowrap transition-all duration-200 ease-in-out ${isCollapsed ? 'opacity-0 h-0' : `opacity-100 h-auto delay-${delay}`
                    }`}
            >
                {label}
            </span>
        </>
    )

    if (to) {
        return (
            <NavLink to={to} end className={({ isActive }) =>
                `${classes} ${isActive ? 'bg-blue-100 font-bold text-blue-800' : 'font-medium'}`
            }>
                {content}
            </NavLink>
        )
    }

    return (
        <button
            onClick={onClick}
            className={`${classes} font-medium w-full text-left`}
        >
            {content}
        </button>
    )
}

export default SidebarItem
