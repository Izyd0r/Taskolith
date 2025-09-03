import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'
import { UserCircle, LogOut, ChevronUp } from 'lucide-react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface UserProfileTileProps {
    isCollapsed: boolean
    profileUrl: string
}

const getInitials = (name: string): string => {
    if (!name) return ''
    const names = name.split(' ')
    if (names.length > 1 && names[names.length - 1]) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
}

export const UserProfileTile: React.FC<UserProfileTileProps> = ({ isCollapsed, profileUrl }) => {
    const { user, isLoading, logout } = useAuth()
    const navigate = useNavigate()

    const [isMenuOpen, setMenuOpen] = useState(false)
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!isMenuOpen) return

        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isMenuOpen])

    const handleLogout = async () => {
        setIsLoggingOut(true)
        await logout()
        navigate('/login')
    }

    if (isLoading) {
        return (
            <div className="flex items-center gap-3 p-2">
                <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                {!isCollapsed && (
                    <div className="flex-1 space-y-2">
                        <div className="h-4 w-3/4 rounded bg-gray-200 animate-pulse" />
                        <div className="h-3 w-1/2 rounded bg-gray-200 animate-pulse" />
                    </div>
                )}
            </div>
        )
    }

    if (!user) {
        return null
    }

    return (
        <div className="relative" ref={menuRef}>
            {isMenuOpen && (
                <div className="absolute bottom-full left-0 right-0 z-10 mb-2 p-1 bg-white rounded-lg shadow-lg border border-gray-200">
                    <Link
                        to={profileUrl}
                        className="flex items-center w-full text-left p-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setMenuOpen(false)}
                    >
                        <UserCircle size={16} className="mr-2" />
                        Profile Settings
                    </Link>
                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex items-center w-full text-left p-2 rounded-md text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                        {isLoggingOut ? (
                            <LoadingSpinner size="sm" className="mr-2" />
                        ) : (
                            <LogOut size={16} className="mr-2" />
                        )}
                        Logout
                    </button>
                </div>
            )}
            <button
                onClick={() => setMenuOpen(!isMenuOpen)}
                className="flex items-center w-full p-2 rounded-lg hover:bg-gray-100"
            >
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">
                    {getInitials(user.username)}
                </div>
                {!isCollapsed && (
                    <div className="ml-3 text-left overflow-hidden">
                        <p className="font-semibold text-sm text-gray-800 truncate">{user.username}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email || 'No email'}</p>
                    </div>
                )}
                {!isCollapsed && (
                    <ChevronUp
                        size={16}
                        className={`ml-auto text-gray-400 transition-transform ${isMenuOpen ? 'rotate-0' : 'rotate-180'}`}
                    />
                )}
            </button>
        </div>
    )
}
