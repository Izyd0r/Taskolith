import React, { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Dialog, DialogContent } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { InputField } from '@/components/ui/InputField'
import { useInviteMember } from '@/features/organisation/hooks/useInviteMember'
import { Mail, AlertCircle, Calendar } from 'lucide-react'

interface InviteMemberModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    organisationId: string
}

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({ open, onOpenChange, organisationId }) => {
    const queryClient = useQueryClient()
    const [email, setEmail] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [error, setError] = useState<string | null>(null)

    const { mutate: inviteMember, isPending } = useInviteMember(organisationId)

    const resetForm = () => {
        setEmail('')
        setDueDate('')
        setError(null)
    }

    useEffect(() => {
        if (open) {
            resetForm()
        }
    }, [open])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!email) {
            setError('Email is required.')
            return
        }
        if (!dueDate) {
            setError('Expiry date is required.')
            return
        }

        const isoDueDate = `${dueDate}T00:00:00.000Z`

        inviteMember({ email, dueDate: isoDueDate }, {
            onSuccess: () => {
                alert('Invitation sent successfully!')
                onOpenChange(false)
                queryClient.invalidateQueries({ queryKey: ['organisation', organisationId, 'members'] })
            },
            onError: (err: any) => {
                const data = err?.response?.data
                if (data?.errors && typeof data.errors === 'object') {
                    const errorMessages = Object.values(data.errors).flat()
                    setError(errorMessages.join(' '))
                }
                else if (data?.message) {
                    setError(data.message)
                }
                else {
                    setError('An unexpected error occurred. Please try again.')
                }
            }
        })
    }

    return (
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

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                                <AlertCircle size={16} />
                                <span className="text-sm">{error}</span>
                            </div>
                        )}

                        <div className="space-y-4">
                            <InputField
                                id="email"
                                type="email"
                                placeholder="Enter member's email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isPending}
                                toggle={<Mail className="text-gray-400" size={18} />}
                            />
                            <InputField
                                id="dueDate"
                                type="date"
                                placeholder="Invitation expiry date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                disabled={isPending}
                                toggle={<Calendar className="text-gray-400" size={18} />}
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
    )
}
