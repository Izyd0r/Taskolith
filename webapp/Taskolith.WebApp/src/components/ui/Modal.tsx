import React from 'react'
import { Dialog } from '@/components/ui/Dialog'

interface ModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    children: React.ReactNode
}

export const Modal = ({ open, onOpenChange, children }: ModalProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {children}
        </Dialog>
    )
}

interface ModalHeaderProps {
    title: string
    description?: string
}

export const ModalHeader = ({ title, description }: ModalHeaderProps) => {
    return (
        <div className="mb-4 text-left">
            <h2 id="dialog-title" className="text-lg font-semibold leading-6 text-gray-900">
                {title}
            </h2>
            {description && (
                <div className="mt-2">
                    <p className="text-sm text-gray-500">{description}</p>
                </div>
            )}
        </div>
    )
}

export const ModalBody = ({ children }: { children: React.ReactNode }) => {
    return <div className="py-2">{children}</div>
}
