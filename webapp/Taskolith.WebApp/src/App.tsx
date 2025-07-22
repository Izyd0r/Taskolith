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
            </Route>
            {/*other routes*/}
        </Routes>
    )
}

export default App;
