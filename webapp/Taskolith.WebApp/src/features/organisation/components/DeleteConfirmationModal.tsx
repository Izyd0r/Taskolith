import React from 'react'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { AlertTriangle } from 'lucide-react'

type DeleteConfirmationModalProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
    isDeleting: boolean
    title: string
    description: string
}

export function DeleteConfirmationModal({
    open,
    onOpenChange,
    onConfirm,
    isDeleting,
    title,
    description,
}: DeleteConfirmationModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <div className="sm:flex sm:items-start">

                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h2 id="dialog-title" className="text-lg font-semibold leading-6 text-gray-900">
                        {title}
                    </h2>

                    <div className="mt-3">
                        <p className="text-sm text-gray-500">{description}</p>
                    </div>
                </div>
            </div>

            <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                <Button
                    variant="destructive"
                    onClick={onConfirm}
                    disabled={isDeleting}
                    className="w-full sm:ml-3 sm:w-auto"
                >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
                <Button
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    className="mt-3 w-full sm:mt-0 sm:w-auto"
                >
                    Cancel
                </Button>
            </div>
        </Dialog>
    )
}
