import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useCreateProject } from '@/features/organisation/hooks/useCreateProject'
import { useGetProjects } from '@/features/organisation/hooks/useGetProjects'
import { InputField } from '@/components/ui/InputField'
import { TextareaField } from '@/components/ui/TextareaField'
import { Dialog, DialogContent } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { type Project } from '@/features/organisation/types/Project'

const ProjectTiles: React.FC = () => {
    const { organisationId } = useParams<{ organisationId: string }>()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const { data: projects = [], isLoading } = useGetProjects(organisationId || '')
    const { mutate: createProject, isPending: isCreating } = useCreateProject(organisationId || '')

    const [open, setOpen] = useState(false)
    const [form, setForm] = useState({ name: '', description: '' })

    const handleCreateProject = () => {
        if (!form.name.trim() || !organisationId) return

        createProject(
            {
                name: form.name,
                description: form.description,
            },
            {
                onSuccess: () => {
                    setForm({ name: '', description: '' })
                    setOpen(false)
                    queryClient.invalidateQueries({ queryKey: ['projects', organisationId] })
                },
            }
        )
    }

    if (isLoading) return <p>Loading projects...</p>

    return (
        <section className="p-6 min-h-[70vh] flex flex-col items-center">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm mb-10">
                <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Create a New Project</h2>
                <Button onClick={() => setOpen(true)} className="w-full">
                    Create Project
                </Button>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent>
                        <h3 className="text-lg font-semibold mb-4">New Project Details</h3>
                        <div className="space-y-4">
                            <InputField
                                id="projectName"
                                placeholder="Project Name"
                                value={form.name}
                                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                            />
                            <TextareaField
                                id="projectDescription"
                                placeholder="Project Description"
                                value={form.description}
                                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                            />
                            <Button onClick={handleCreateProject} disabled={isCreating} className="w-full">
                                {isCreating ? 'Creating...' : 'Create Project'}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
                {projects && projects.length > 0 ? (
                    projects.map((project: Project) => (
                        <div
                            key={project.projectId}
                            className="bg-white p-5 rounded-lg shadow-md flex flex-col justify-between"
                        >
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800">{project.projectName}</h4>
                                <p className="text-sm text-gray-600 mt-2 break-words">
                                    {project.projectDescription || 'No description provided.'}
                                </p>
                            </div>
                            <Button
                                variant="default"
                                className="mt-4"
                                onClick={() =>
                                    navigate(`/organisations/${organisationId}/projects/${project.projectId}`)
                                }
                            >
                                Go to Kanban
                            </Button>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 col-span-full text-center">
                        No projects found. Create one to get started!
                    </p>
                )}
            </div>
        </section>
    )
}

export default ProjectTiles
