import { Routes, Route } from 'react-router-dom';
import { PrivateRoute } from '@/features/auth/components/PrivateRoute'
import { PublicOnlyRoute } from '@/features/auth/components/PublicOnlyRoute'
import LandingPage from '@/features/landing-page/pages/LandingPage';
import LoginPage from '@/features/auth/pages/LoginPage';
import SignupPage from '@/features/auth/pages/SignupPage';
import DashboardLayout from '@/features/dashboard/layout/DashboardLayout'
import DashboardHome from '@/features/dashboard/components/DashboardHome';
import DashboardTasks from '@/features/dashboard/components/DashboardTasks';
import DashboardOrganisation from '@/features/dashboard/components/DashboardOrganisation';
import DashboardMyInvites from '@/features/dashboard/components/MyInvites';
import OrganisationLayout from '@/features/organisation/layout/OrganisationLayout'
import ProjectsPage from '@/features/organisation/components/ProjectsPage'
import MembersPage from '@/features/organisation/components/MembersPage'
import SchedulePage from '@/features/organisation/components/SchedulePage'
import RolesPage from '@/features/organisation/components/RolesPage'
import InvitesPage from '@/features/organisation/components/InvitesPage'
import OrganisationSettingsPage from '@/features/organisation/components/OrganisationSettingsPage'
import ProjectLayout from '@/features/project/layout/ProjectLayout'
import Kanban from '@/features/project/components/Kanban'
import AssignedMembersPage from '@/features/project/components/AssignedMembersPage'
import EditProjectPage from '@/features/project/components/EditProjectPage'

function App() {
    return (
        <Routes>
            <Route element={<PublicOnlyRoute />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
            </Route>
            <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route index element={<DashboardHome />} />
                    <Route path="tasks" element={<DashboardTasks />} />
                    <Route path="create-organisation" element={<DashboardOrganisation />} />
                    <Route path="invites" element={<DashboardMyInvites />} />
                </Route>
                <Route path="/organisations/:organisationId" element={<OrganisationLayout />}>
                    <Route path="projects" element={<ProjectsPage />} />
                    <Route path="members" element={<MembersPage />} />
                    <Route path="schedule" element={<SchedulePage />} />
                    <Route path="roles" element={<RolesPage />} />
                    <Route path="invites" element={<InvitesPage />} />
                    <Route path="settings" element={<OrganisationSettingsPage />} />
                </Route>
                <Route path="/organisations/:organisationId/projects/:projectId" element={<ProjectLayout />}>
                    <Route path="kanban" element={<Kanban />} />
                    <Route path="members" element={<AssignedMembersPage />} />
                    <Route path="schedule" element={<SchedulePage />} />
                    <Route path="settings" element={<EditProjectPage />} />
                </Route>
            </Route>
            {/*other routes*/}
        </Routes>
    )
}

export default App;
