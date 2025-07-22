import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import createTestQueryClient from '@/tests/integration/utils/createTestQueryDefault';
import SignupPage from '@/features/auth/pages/SignupPage';
import DashboardLayout from '@/features/dashboard/layout/DashboardLayout';

export function renderSignupForm() {
    const queryClient = createTestQueryClient();
    return render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter initialEntries={['/signup']}>
                <Routes>
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/dashboard" element={<DashboardLayout />}>
                    </Route>
                </Routes>
            </MemoryRouter>
        </QueryClientProvider>
    );
}
