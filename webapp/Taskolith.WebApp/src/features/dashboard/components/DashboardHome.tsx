import React from 'react'
import OrganisationsList from '@/features/dashboard/components/OrganisationsList'
import MyProjectsList from '@/features/dashboard/components/MyProjectsList'

const DashboardHome: React.FC = () => {
    return (
        <div className="h-full bg-gray-50 p-4 sm:p-6">
           <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
               <div className="flex flex-col min-h-0 pb-6 lg:pb-0 lg:pr-6">
                    <MyProjectsList />
                </div>
               <div className="flex flex-col min-h-0 border-t border-gray-200 pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
                    <OrganisationsList />
                </div>
            </div>
        </div>
    )
}

export default DashboardHome
