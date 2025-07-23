import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { PrivateRoute } from '@/features/auth/components/PrivateRoute'
import { PublicOnlyRoute } from '@/features/auth/components/PublicOnlyRoute'
import { AuthProvider } from '@/features/auth/context/AuthContext'
import createTestQueryClient from '@/tests/integration/utils/createTestQueryDefault';
import SignupPage from '@/features/auth/pages/SignupPage';
import DashboardHome from '@/features/dashboard/components/DashboardHome';
import DashboardLayout from '@/features/dashboard/layout/DashboardLayout';

export function renderSignupForm() {
    const queryClient = createTestQueryClient();
    return render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter initialEntries={['/signup']}>
                <AuthProvider>
                    <Routes>
                        <Route element={<PublicOnlyRoute />}>
                            <Route path="/signup" element={<SignupPage />} />
                        </Route>
                        <Route element={<PrivateRoute />}>
                            <Route path="/dashboard" element={<DashboardLayout />}>
                                <Route index element={<DashboardHome />} />
                            </Route>
                        </Route>
                    </Routes>
                </AuthProvider>
            </MemoryRouter>
        </QueryClientProvider>
    );
}
