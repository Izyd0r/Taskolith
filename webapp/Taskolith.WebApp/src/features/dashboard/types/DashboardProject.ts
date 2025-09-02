import { type MyProject } from './MyProject'

export type DashboardProject = MyProject & {
    organisationId: string
    organisationName: string
}
