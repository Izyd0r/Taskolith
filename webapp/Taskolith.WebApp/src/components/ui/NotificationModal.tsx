import React from 'react'
import { Dialog, DialogContent } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

type NotificationVariant = 'success' | 'error' | 'warning'

interface NotificationModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    variant?: NotificationVariant
    title: string
    description: string
    buttonText?: string
}

const variantStyles = {
    success: {
        icon: CheckCircle,
        iconBgClass: 'bg-green-100',
        iconTextClass: 'text-green-600',
    },
    error: {
        icon: XCircle,
        iconBgClass: 'bg-red-100',
        iconTextClass: 'text-red-600',
    },
    warning: {
        icon: AlertTriangle,
        iconBgClass: 'bg-yellow-100',
        iconTextClass: 'text-yellow-600',
    },
}

export function NotificationModal({
    open,
    onOpenChange,
    variant = 'success',
    title,
    description,
    buttonText = 'OK',
}: NotificationModalProps) {
    const { icon: Icon, iconBgClass, iconTextClass } = variantStyles[variant]

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <div className="sm:flex sm:items-start">
                    <div
                        className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${iconBgClass} sm:mx-0 sm:h-10 sm:w-10`}
                    >
                        <Icon className={`h-6 w-6 ${iconTextClass}`} aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <h2 id="dialog-title" className="text-lg font-semibold leading-6 text-gray-900">
                            {title}
                        </h2>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">{description}</p>
                        </div>
                    </div>
                </div>
                <div className="mt-5 sm:mt-4 flex flex-row-reverse">
                    <Button onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
                        {buttonText}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
