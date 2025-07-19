import { Routes, Route } from 'react-router-dom';
import LandingPage from '@/features/landing-page/pages/LandingPage';
import LoginPage from '@/features/auth/pages/LoginPage';
import SignupPage from '@/features/auth/pages/SignupPage';
import DashboardPage from '@/features/dashboard/pages/DashboardPage';

function App() {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        {/*other routes*/}
      </Routes>
  )
}

export default App;
