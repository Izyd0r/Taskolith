import React from 'react'
import { createPortal } from 'react-dom'

interface DialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    children: React.ReactNode
}

export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
    if (!open) return null

    return createPortal(
        <div
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="dialog-title"
                className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative"
            >
                <button
                    onClick={() => onOpenChange(false)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
                    aria-label="Close"
                >
                    ×
                </button>
                {children}
            </div>
        </div>,
        document.body
    )
}

interface DialogTriggerProps {
    asChild?: boolean
    children: React.ReactNode
}

export const DialogTrigger: React.FC<DialogTriggerProps> = ({ children }) => {
    return <>{children}</>
}

interface DialogContentProps {
    children: React.ReactNode
}

export const DialogContent: React.FC<DialogContentProps> = ({ children }) => (
    <div className="mt-2">{children}</div>
)
