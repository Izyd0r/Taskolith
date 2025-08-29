import React from 'react'

const LoadingSpinner: React.FC = () => {
    return (
        <div className="flex justify-center items-center p-10">
            <div className="w-10 h-10 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
        </div>
    )
}

export default LoadingSpinner
