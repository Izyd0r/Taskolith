import React, { useMemo, useState } from 'react'
import { type Role } from '@/features/organisation/types/Role'
import { InputField } from '@/components/ui/InputField'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { Search } from 'lucide-react'

interface RoleSelectionListProps {
    availableRoles: Role[]
    activeRoles: Role[]
    onRoleChange: (role: Role) => void
    isLoading: boolean
    isDisabled: boolean
}

export const RoleSelectionList: React.FC<RoleSelectionListProps> = ({
    availableRoles,
    activeRoles,
    onRoleChange,
    isLoading,
    isDisabled,
}) => {
    const [searchTerm, setSearchTerm] = useState('')

    const filteredRoles = useMemo(() => {
        if (!availableRoles) return []
        return availableRoles.filter(role =>
            role.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [availableRoles, searchTerm])

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-48 rounded-lg border border-gray-200">
                <LoadingSpinner />
            </div>
        )
    }

    return (
        <div className="space-y-3">
            <InputField
                id="role-search"
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isDisabled || availableRoles.length === 0}
                toggle={<Search className="text-gray-400" size={18} />}
            />

            <div className="h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white">
                <ul className="divide-y divide-gray-200">
                    {filteredRoles.length > 0 ? (
                        filteredRoles.map(role => {
                            const isActive = activeRoles.some(r => r.id === role.id)
                            const isEffectivelyDisabled = isDisabled

                            return (
                                <li
                                    key={role.id}
                                    className={`flex items-center gap-3 p-3 transition-colors ${isEffectivelyDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:bg-gray-50'
                                        }`}
                                    onClick={() => !isEffectivelyDisabled && onRoleChange(role)}
                                >
                                    <input
                                        type="checkbox"
                                        id={`role-${role.id}`}
                                        checked={isActive}
                                        readOnly
                                        disabled={isEffectivelyDisabled}
                                        className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${isEffectivelyDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
                                            }`}
                                    />
                                    <label
                                        htmlFor={`role-${role.id}`}
                                        className={`text-sm font-medium text-gray-800 ${isEffectivelyDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
                                            }`}
                                    >
                                        {role.name}
                                    </label>
                                </li>
                            )
                        })
                    ) : (
                        <div className="flex justify-center items-center h-full">
                            <p className="p-4 text-sm text-gray-500">
                                {availableRoles.length === 0 ? "No roles available." : "No roles match your search."}
                            </p>
                        </div>
                    )}
                </ul>
            </div>
        </div>
    )
}
