import React from 'react'

interface SwitchProps {
    id?: string
    checked: boolean
    onCheckedChange: (checked: boolean) => void
    disabled?: boolean
}

export const Switch: React.FC<SwitchProps> = ({ id, checked, onCheckedChange, disabled }) => {
    return (
        <button
            id={id}
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => !disabled && onCheckedChange(!checked)}
            className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors ${checked ? 'bg-blue-500' : 'bg-gray-300'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <span
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${checked ? 'translate-x-5' : ''
                    }`}
            />
        </button>
    )
}
