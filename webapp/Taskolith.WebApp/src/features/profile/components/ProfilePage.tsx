import React, { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuth, authQueryKey } from '@/features/auth/context/AuthContext'
import { useUpdateProfile } from '@/features/profile/hooks/useUpdateProfile'
import { useDeleteProfile } from '@/features/profile/hooks/useDeleteProfile'

import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { Button } from '@/components/ui/Button'
import { NotificationModal, type Notification } from '@/components/ui/NotificationModal'
import { DeleteConfirmationModal } from '@/features/organisation/components/DeleteConfirmationModal'
import { User, Mail, Lock, Edit, Check, X, AlertTriangle } from 'lucide-react'

type EditableField = 'username' | 'email' | null

const ProfilePage: React.FC = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { user, isLoading: isAuthLoading, logout } = useAuth()
    const { mutate: updateProfile, isPending: isUpdating, reset: resetUpdateMutation } = useUpdateProfile()
    const { mutate: deleteProfile, isPending: isDeleting } = useDeleteProfile()

    const [editingField, setEditingField] = useState<EditableField>(null)
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [notification, setNotification] = useState<Notification>({
        open: false,
        variant: 'success',
        title: '',
        description: '',
    })

    useEffect(() => {
        if (user) {
            setUsername(user.username)
            setEmail(user.email ?? '')
        }
    }, [user])

    const startEditing = (field: EditableField) => {
        resetUpdateMutation()
        setEditingField(field)
    }

    const handleCancel = () => {
        if (user) {
            setUsername(user.username)
            setEmail(user.email ?? '')
        }
        setEditingField(null)
    }

    const handleSaveField = (field: 'username' | 'email') => {
        const value = field === 'username' ? username : email
        const originalValue = field === 'username' ? user?.username : user?.email
        if (value.trim() === '' || value === originalValue) {
            setEditingField(null)
            return
        }

        updateProfile({ [field]: value }, {
            onSuccess: (updatedUser) => {
                queryClient.setQueryData(authQueryKey, (old: any) => {
                    return old ? { ...old, [field]: value } : updatedUser
                })

                setNotification({
                    open: true,
                    variant: 'success',
                    title: 'Profile Updated',
                    description: `${field.charAt(0).toUpperCase() + field.slice(1)} updated.`,
                })
                setEditingField(null)
            },
            onError: (error) =>
                setNotification({
                    open: true,
                    variant: 'error',
                    title: 'Update Failed',
                    description: (error as Error).message,
                }),
        })
    }

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        resetUpdateMutation()
        if (!password || password !== confirmPassword) {
            setNotification({
                open: true,
                variant: 'error',
                title: 'Invalid Input',
                description: 'Passwords do not match or are empty.',
            })
            return
        }
        updateProfile({ password }, {
            onSuccess: () => {
                setNotification({
                    open: true,
                    variant: 'success',
                    title: 'Security Updated',
                    description: 'Password changed successfully.',
                })
                setPassword('')
                setConfirmPassword('')
            },
            onError: (error) =>
                setNotification({
                    open: true,
                    variant: 'error',
                    title: 'Update Failed',
                    description: (error as Error).message,
                }),
        })
    }

    const handleConfirmDelete = () => {
        deleteProfile(undefined, {
            onSuccess: async () => {
                setDeleteModalOpen(false)
                await logout()
                navigate('/')
            },
            onError: (error) => {
                setDeleteModalOpen(false)
                setNotification({
                    open: true,
                    variant: 'error',
                    title: 'Deletion Failed',
                    description: (error as Error).message,
                })
            },
        })
    }

    if (isAuthLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <LoadingSpinner />
            </div>
        )
    }

    if (!user) {
        return (
            <p className="p-4 text-red-500 text-center">
                You must be logged in to view this page.
            </p>
        )
    }

    return (
        <>
            <div className="h-full w-full bg-gray-50 overflow-y-auto p-4 sm:p-6 flex justify-center">
                <div className="w-full max-w-2xl mb-12">
                    <header className="flex-shrink-0">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
                        <p className="text-gray-500 mb-6">Manage your account details and password.</p>
                    </header>

                    <main className="space-y-8 pb-10">
                        {/* Account Info */}
                        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm border border-gray-200 space-y-6">
                            <h2 className="text-lg font-semibold text-gray-800">Account Information</h2>

                            {/* Username */}
                            <div className="space-y-1">
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                    Username
                                </label>
                                <div className="flex items-center gap-x-2">
                                    {editingField === 'username' ? (
                                        <div className="relative flex-grow">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <input
                                                id="username"
                                                type="text"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                className="w-full p-2 pl-10 border border-gray-300 rounded-md"
                                            />
                                        </div>
                                    ) : (
                                        <p className="flex-grow text-gray-900 p-2 font-medium">{username}</p>
                                    )}
                                    {editingField === 'username' ? (
                                        <>
                                            <Button size="icon" type="button" variant="ghost" onClick={handleCancel}>
                                                <X className="h-5 w-5" />
                                            </Button>
                                            <Button size="icon" type="button" onClick={() => handleSaveField('username')} disabled={isUpdating}>
                                                <Check className="h-5 w-5" />
                                            </Button>
                                        </>
                                    ) : (
                                        <Button size="icon" type="button" variant="ghost" onClick={() => startEditing('username')}>
                                            <Edit className="h-5 w-5" />
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-1">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email Address
                                </label>
                                <div className="flex items-center gap-x-2">
                                    {editingField === 'email' ? (
                                        <div className="relative flex-grow">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <input
                                                id="email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full p-2 pl-10 border border-gray-300 rounded-md"
                                            />
                                        </div>
                                    ) : (
                                        <p className="flex-grow text-gray-900 p-2 font-medium">{email}</p>
                                    )}
                                    {editingField === 'email' ? (
                                        <>
                                            <Button size="icon" type="button" variant="ghost" onClick={handleCancel}>
                                                <X className="h-5 w-5" />
                                            </Button>
                                            <Button size="icon" type="button" onClick={() => handleSaveField('email')} disabled={isUpdating}>
                                                <Check className="h-5 w-5" />
                                            </Button>
                                        </>
                                    ) : (
                                        <Button size="icon" type="button" variant="ghost" onClick={() => startEditing('email')}>
                                            <Edit className="h-5 w-5" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Password Change */}
                        <form
                            onSubmit={handlePasswordSubmit}
                            className="bg-white p-6 sm:p-8 rounded-lg shadow-sm border border-gray-200 space-y-6"
                        >
                            <h2 className="text-lg font-semibold text-gray-800">Change Password</h2>
                            <div>
                                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                                    New Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        id="new-password"
                                        type="password"
                                        autoComplete="new-password"
                                        placeholder="Enter new password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full p-2 pl-10 border border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        id="confirm-password"
                                        type="password"
                                        autoComplete="new-password"
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full p-2 pl-10 border border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-end pt-2">
                                <Button type="submit" disabled={isUpdating}>
                                    {isUpdating ? 'Saving' : 'Save Password'}
                                </Button>
                            </div>
                        </form>

                        {/* Danger Zone */}
                        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm border-2 border-red-500/50 space-y-4">
                            <div className="flex items-start gap-x-4">
                                <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-red-100">
                                    <AlertTriangle className="h-6 w-6 text-red-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-red-800">Danger Zone</h2>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Deleting your account is permanent. All of your data, including organisations, projects, and tasks you
                                        own, will be permanently removed.
                                    </p>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button variant="destructive" onClick={() => setDeleteModalOpen(true)}>
                                    Delete My Account
                                </Button>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            <NotificationModal
                open={notification.open}
                onOpenChange={(isOpen) => setNotification({ ...notification, open: isOpen })}
                variant={notification.variant}
                title={notification.title}
                description={notification.description}
            />

            <DeleteConfirmationModal
                open={isDeleteModalOpen}
                onOpenChange={setDeleteModalOpen}
                onConfirm={handleConfirmDelete}
                isDeleting={isDeleting}
                title="Confirm Account Deletion"
                description="Are you absolutely sure? This action is irreversible and all your data will be permanently lost."
            />
        </>
    )
}

export default ProfilePage

