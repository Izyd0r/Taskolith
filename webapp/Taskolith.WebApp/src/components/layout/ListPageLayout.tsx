import React from 'react'
import { Search } from 'lucide-react'

type ListPageLayoutProps = {
    title: string
    description: string
    actionButton?: React.ReactNode
    searchQuery: string
    onSearchChange: (query: string) => void
    searchPlaceholder: string
    isSearchDisabled?: boolean
    children: React.ReactNode
}

export function ListPageLayout({
    title,
    description,
    actionButton,
    searchQuery,
    onSearchChange,
    searchPlaceholder,
    isSearchDisabled = false,
    children,
}: ListPageLayoutProps) {
    return (
        <div className="p-6 bg-gray-50 h-full flex flex-col">
            <div className="max-w-4xl mx-auto flex flex-col h-full w-full">

                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 flex-shrink-0">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
                        <p className="text-sm text-gray-500">{description}</p>
                    </div>
                    {actionButton}
                </div>

                <div className="mb-6 flex-shrink-0">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder={searchPlaceholder}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isSearchDisabled}
                        />
                    </div>
                </div>

                <div className="flex-1 min-h-0">
                    {children}
                </div>

            </div>
        </div>
    )
}
