import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { InputField } from '@/components/ui/InputField'
import { TextareaField } from '@/components/ui/TextareaField'
import { type Project } from '@/features/organisation/types/Project'

type ProjectForm = {
    name: string
    description: string
}

type ProjectFormModalProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (form: ProjectForm) => void
    isMutating: boolean
    editingProject: Project | null
}

export function ProjectFormModal({
    open,
    onOpenChange,
    onSubmit,
    isMutating,
    editingProject,
}: ProjectFormModalProps) {
    const [form, setForm] = useState({ name: '', description: '' })

    useEffect(() => {
        if (open) {
            if (editingProject) {
                setForm({ name: editingProject.projectName, description: editingProject.projectDescription })
            } else {
                setForm({ name: '', description: '' })
            }
        }
    }, [editingProject, open])

    const handleSubmit = () => {
        onSubmit(form)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <h2 id="dialog-title" className="text-xl font-bold">
                {editingProject ? 'Edit Project' : 'Create New Project'}
            </h2>
            <DialogContent>
                <div className="space-y-4">
                    <InputField
                        id="projectName"
                        placeholder="Project Name"
                        value={form.name}
                        onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    />
                    <TextareaField
                        id="projectDescription"
                        placeholder="Description"
                        value={form.description}
                        onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                    />
                </div>
                <div className="mt-6 flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={isMutating}>
                        {isMutating ? 'Saving...' : (editingProject ? 'Update Project' : 'Create Project')}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
