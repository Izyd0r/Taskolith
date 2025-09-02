import React from 'react'

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    className?: string 
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    className = '',
}) => {
    const sizeClasses = {
        sm: 'w-5 h-5 border-2',
        md: 'w-10 h-10 border-4',
        lg: 'w-16 h-16 border-4',
    }
    const spinnerClasses = `
        border-dashed rounded-full animate-spin border-blue-500
        ${sizeClasses[size]}
        ${className}
    `
    return (
        <div className={spinnerClasses}></div>
    )
}

export default LoadingSpinner
