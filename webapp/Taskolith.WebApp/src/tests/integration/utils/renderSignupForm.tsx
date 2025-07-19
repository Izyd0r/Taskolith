import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import createTestQueryClient from '@/tests/integration/utils/createTestQueryDefault';
import SignupPage from '@/features/auth/pages/SignupPage';
import DashboardPage from '@/features/dashboard/pages/DashboardPage';

export function renderSignupForm() {
    const queryClient = createTestQueryClient();
    return render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter initialEntries={['/signup']}>
                <Routes>
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/dashboard" element={<DashboardPage />}>
                    </Route>
                </Routes>
            </MemoryRouter>
        </QueryClientProvider>
    );
}
