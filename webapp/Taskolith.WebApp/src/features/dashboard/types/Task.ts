export interface TaskCoreDetails {
    taskId: string
    title: string
    description: string
    dueDate: string
    priority: number
}

export interface OrganisationDto {
    organisationId: string
    organisationName: string
}

export interface ProjectDto {
    projectId: string
    projectName: string
}

export interface TaskItem {
    task: TaskCoreDetails
    organisation: OrganisationDto
    project: ProjectDto
}

export interface MyTasksApiResponse {
    tasks: TaskItem[]
}
