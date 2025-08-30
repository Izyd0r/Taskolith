import React, { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Dialog, DialogContent } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { InputField } from '@/components/ui/InputField'
import { useInviteMember } from '@/features/organisation/hooks/useInvite'
import { useGetRoles } from '@/features/organisation/hooks/useRoles'
import { type Role } from '@/features/organisation/types/Role'
import { Mail } from 'lucide-react'
import { RoleSelectionList } from './RoleSelectionList'
import { NotificationModal } from '@/components/ui/NotificationModal'

interface InviteMemberModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    organisationId: string
}

interface NotificationState {
    open: boolean
    title: string
    description: string
    variant: 'success' | 'error'
}

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({ open, onOpenChange, organisationId }) => {
    const queryClient = useQueryClient()

    const [email, setEmail] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [selectedRoles, setSelectedRoles] = useState<Role[]>([])

    const [notification, setNotification] = useState<NotificationState>({
        open: false,
        title: '',
        description: '',
        variant: 'success',
    })

    const { data: rolesResponse, isLoading: isLoadingRoles } = useGetRoles(organisationId, { enabled: open })
    const { mutate: inviteMember, isPending } = useInviteMember(organisationId)

    const resetForm = () => {
        setEmail('')
        setDueDate('')
        setSelectedRoles([])
    }

    useEffect(() => {
        if (open) {
            resetForm()
        }
    }, [open])

    const handleRoleChange = (role: Role) => {
        setSelectedRoles(prevSelected =>
            prevSelected.some(r => r.id === role.id)
                ? prevSelected.filter(r => r.id !== role.id)
                : [...prevSelected, role]
        )
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!email || !dueDate) {
            setNotification({
                open: true,
                variant: 'error',
                title: 'Missing Information',
                description: 'Please provide both an email address and an expiry date.',
            })
            return
        }

        const isoDueDate = `${dueDate}T00:00:00.000Z`
        const payload = { email, dueDate: isoDueDate, initialRoles: selectedRoles }

        inviteMember(payload, {
            onSuccess: () => {
                onOpenChange(false)
                setNotification({
                    open: true,
                    variant: 'success',
                    title: 'Invitation Sent',
                    description: `An invitation has been successfully sent to ${email}.`,
                })
                queryClient.invalidateQueries({ queryKey: ['organisation', organisationId, 'invites'] })
            },
            onError: (err: any) => {
                const errorMessage = err?.response?.data?.message || 'An unexpected error occurred.'
                setNotification({
                    open: true,
                    variant: 'error',
                    title: 'Failed to Send Invitation',
                    description: errorMessage,
                })
            }
        })
    }

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Invite New Member</h3>
                                <p className="text-sm text-gray-500">
                                    The invitation will expire at midnight on the selected date.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <InputField
                                    id="email" type="email" placeholder="Enter member's email"
                                    value={email} onChange={(e) => setEmail(e.target.value)}
                                    disabled={isPending} toggle={<Mail className="text-gray-400" size={18} />}
                                />
                                <InputField
                                    id="dueDate" type="date" placeholder="Invitation expiry date"
                                    value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                                    disabled={isPending}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Assign Roles (Optional)</label>
                                <RoleSelectionList
                                    availableRoles={rolesResponse?.roles ?? []}
                                    isLoading={isLoadingRoles} isDisabled={isPending}
                                    activeRoles={selectedRoles} onRoleChange={handleRoleChange}
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isPending}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isPending}>
                                    {isPending ? 'Sending...' : 'Send Invitation'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <NotificationModal
                open={notification.open}
                onOpenChange={() => setNotification({ ...notification, open: false })}
                variant={notification.variant}
                title={notification.title}
                description={notification.description}
            />
        </>
    )
}
