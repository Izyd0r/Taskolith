import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { InputField } from '@/components/ui/InputField'
import { Switch } from '@/components/ui/Switch'
import { Permission } from '@/features/organisation/types/Permission'
import { PermissionDescriptions } from '@/features/organisation/types/PermissionDescriptions'
import { type RoleRequest } from '@/features/organisation/types/RoleRequest'

interface RoleModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (payload: RoleRequest) => void
    initialData?: { name: string; permissions: number } | null
    isPending?: boolean
}

const RoleModal: React.FC<RoleModalProps> = ({ open, onOpenChange, onSubmit, initialData, isPending }) => {
    const [name, setName] = useState('')
    const [permissions, setPermissions] = useState<number>(0)

    useEffect(() => {
        if (open) {
            setName(initialData?.name ?? '')
            setPermissions(initialData?.permissions ?? 0)
        }
    }, [open, initialData])

    const toggle = (perm: number) => {
        setPermissions(prev => ((prev & perm) === perm) ? (prev & ~perm) : (prev | perm))
    }

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit({ name, permissions })
    }

    const permissionEntries = Object.entries(Permission)
        .filter(([k, v]) => k !== 'Public' && typeof v === 'number') as [string, number][]

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <form onSubmit={handleSave} className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            {initialData ? 'Edit Role' : 'New Role'}
                        </h3>
                    </div>

                    <InputField
                        id="roleName"
                        type="text"
                        placeholder="Role name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isPending}
                    />

                    <div>
                        <h4 className="text-sm font-medium mb-3">Permissions</h4>
                        <div className="max-h-64 overflow-y-auto border border-gray-200 bg-white rounded-md divide-y divide-gray-200">
                            {permissionEntries.map(([key, value]) => {
                                const meta = PermissionDescriptions[value] ?? { title: key, description: '' }
                                const enabled = (permissions & value) === value

                                return (
                                    <div
                                        key={key}
                                        className="flex items-center justify-between px-3 py-2"
                                    >
                                        <div className="pr-3">
                                            <div className="text-sm font-medium">{meta.title}</div>
                                            <div className="text-xs text-gray-500">{meta.description}</div>
                                        </div>
                                        <Switch
                                            checked={enabled}
                                            onCheckedChange={() => toggle(value)}
                                            disabled={isPending}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Saving...' : 'Save Role'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default RoleModal
