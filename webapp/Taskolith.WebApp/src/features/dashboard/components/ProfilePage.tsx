import React from 'react'

const ProfilePage: React.FC = () => {
    return (
        <div className="h-full bg-gray-50 p-4 sm:p-6 flex flex-col">
            <div className="flex-shrink-0">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile Settings</h1>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <p className="text-gray-600">Your profile settings form and content will go here.</p>
            </div>
        </div>
    )
}

export default ProfilePage
