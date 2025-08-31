import React from 'react'
import { createPortal } from 'react-dom'

interface DialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    children: React.ReactNode
    className?: string
}

export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children, className }) => {
    if (!open) return null

    const baseDialogClasses = "bg-white rounded-lg shadow-xl p-6 w-full relative"
    const finalDialogClasses = `${baseDialogClasses} ${className || 'max-w-md'}`

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
                className={finalDialogClasses}
            >
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
