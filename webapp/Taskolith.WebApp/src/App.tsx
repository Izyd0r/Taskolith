import { Routes, Route } from 'react-router-dom';
import { PrivateRoute } from '@/features/auth/components/PrivateRoute'
import { PublicRoute } from '@/features/auth/components/PublicRoute'
import LandingPage from '@/features/landing-page/pages/LandingPage';
import LoginPage from '@/features/auth/pages/LoginPage';
import SignupPage from '@/features/auth/pages/SignupPage';
import DashboardLayout from '@/features/dashboard/layout/DashboardLayout'
import DashboardHome from '@/features/dashboard/components/DashboardHome';
import DashboardTasks from '@/features/dashboard/components/DashboardTasks';
import DashboardMyInvites from '@/features/dashboard/components/MyInvites';
import OrganisationLayout from '@/features/organisation/layout/OrganisationLayout'
import ProjectsPage from '@/features/organisation/components/ProjectsPage'
import SchedulePage from '@/features/organisation/components/SchedulePage'
import RolesPage from '@/features/organisation/components/RolesPage'
import OrganisationSettingsPage from '@/features/organisation/components/OrganisationSettingsPage'
import ProjectLayout from '@/features/project/layout/ProjectLayout'
import Kanban from '@/features/project/components/Kanban'
import ProjectMembersPage from '@/features/project/components/ProjectMembersPage'
import EditProjectPage from '@/features/project/components/EditProjectPage'
import OrganisationAccessPage from '@/features/organisation/components/OrganisationAccessPage'

function App() {
    return (
        <Routes>
            <Route element={<PublicRoute />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
            </Route>
            <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route index element={<DashboardHome />} />
                    <Route path="tasks" element={<DashboardTasks />} />
                    <Route path="invites" element={<DashboardMyInvites />} />
                </Route>
                <Route path="/organisations/:organisationId" element={<OrganisationLayout />}>
                    <Route path="projects" element={<ProjectsPage />} />
                    <Route path="schedule" element={<SchedulePage />} />
                    <Route path="roles" element={<RolesPage />} />
                    <Route path="settings" element={<OrganisationSettingsPage />} />
                    <Route path="access" element={<OrganisationAccessPage />} />
                </Route>
                <Route path="/organisations/:organisationId/projects/:projectId" element={<ProjectLayout />}>
                    <Route path="kanban" element={<Kanban />} />
                    <Route path="members" element={<ProjectMembersPage />} />
                    <Route path="schedule" element={<SchedulePage />} />
                    <Route path="settings" element={<EditProjectPage />} />
                </Route>
            </Route>
            {/*other routes*/}
        </Routes>
    )
}

export default App;
