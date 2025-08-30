import React from 'react'
import { Button } from '@/components/ui/Button'
import { Plus } from 'lucide-react'
import { ListPageLayout } from '@/components/layout/ListPageLayout'
import { useRolesPage } from '@/features/organisation/hooks/useRolesPage'
import { RoleList } from '@/features/organisation/components/RoleList'
import RoleModal from '@/features/organisation/components/RoleModal'
import { NotificationModal } from '@/components/ui/NotificationModal'
import { DeleteConfirmationModal } from '@/features/organisation/components/DeleteConfirmationModal'

export default function RolesPage() {
    const {
        query, setQuery, permissions, isLoadingRoles, isErrorRoles, filteredRoles,
        isRoleModalOpen, setRoleModalOpen, editingRole, openCreateRoleModal, openEditRoleModal, handleSubmitRole,
        roleToDelete, setRoleToDelete, openDeleteRoleModal, handleConfirmDelete,
        notification, setNotification, isSubmitting, isDeleting,
    } = useRolesPage()

    return (
        <>
            <ListPageLayout
                title="Roles"
                description="Manage organisation roles and permissions."
                searchQuery={query}
                onSearchChange={setQuery}
                searchPlaceholder="Filter roles by name..."
                isSearchDisabled={isLoadingRoles || isErrorRoles}
                actionButton={
                    permissions.canCreate && (
                        <Button onClick={openCreateRoleModal} className="gap-2">
                            <Plus size={16} /> New Role
                        </Button>
                    )
                }
            >
                <RoleList
                    roles={filteredRoles}
                    isLoading={isLoadingRoles}
                    isError={isErrorRoles}
                    canEdit={permissions.canEdit}
                    canDelete={permissions.canDelete}
                    onEditRole={openEditRoleModal}
                    onDeleteRole={openDeleteRoleModal}
                />
            </ListPageLayout>

            <RoleModal
                open={isRoleModalOpen}
                onOpenChange={setRoleModalOpen}
                onSubmit={handleSubmitRole}
                initialData={editingRole}
                isPending={isSubmitting}
            />

            <DeleteConfirmationModal
                open={!!roleToDelete}
                onOpenChange={() => setRoleToDelete(null)}
                onConfirm={handleConfirmDelete}
                isDeleting={isDeleting}
                title="Delete Role"
                description={`Are you sure you want to delete the "${roleToDelete?.name}" role? This action cannot be undone.`}
            />

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
