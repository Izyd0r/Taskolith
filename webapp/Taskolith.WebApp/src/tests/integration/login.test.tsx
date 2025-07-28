import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClientProvider } from '@tanstack/react-query'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect } from 'vitest';
import { PrivateRoute } from '@/features/auth/components/PrivateRoute'
import { PublicOnlyRoute } from '@/features/auth/components/PublicOnlyRoute'
import { AuthProvider } from '@/features/auth/context/AuthContext'
import createTestQueryClient from '@/tests/integration/utils/createTestQueryDefault'
import DashboardHome from '@/features/dashboard/components/DashboardHome';
import DashboardLayout from '@/features/dashboard/layout/DashboardLayout';
import { afterEach } from 'vitest'

describe('Login integration', () => {
    afterEach(() => {
        localStorage.clear()
    })

    it('should login with correct credentials', async () => {
        const queryClient = createTestQueryClient()

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={['/login']}>
                    <AuthProvider>
                        <Routes>
                            <Route element={<PublicOnlyRoute />}>
                                <Route path="/login" element={<LoginForm />} />
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
        )

        const emailInput = screen.getByPlaceholderText(/username/i)
        const passwordInput = screen.getByPlaceholderText(/password/i)
        const submitBtn = screen.getByRole('button', { name: /log in/i })

        await userEvent.type(emailInput, 'user1')
        await userEvent.type(passwordInput, 'StrongPass123!')
        await userEvent.click(submitBtn)

        expect(await screen.findByText(/Dashboard/i)).toBeInTheDocument()
        expect(await screen.findByText(/My Tasks/i)).toBeInTheDocument()
        expect(await screen.findByText(/Create Org/i)).toBeInTheDocument()
        expect(await screen.findByText(/My Invites/i)).toBeInTheDocument()
    })

    it('should show error for invalid credentials', async () => {
        const queryClient = createTestQueryClient()

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={['/login']}>
                    <AuthProvider>
                        <Routes>
                            <Route element={<PublicOnlyRoute />}>
                                <Route path="/login" element={<LoginForm />} />
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
        )

        await userEvent.type(screen.getByPlaceholderText(/username/i), 'invalid')
        await userEvent.type(screen.getByPlaceholderText(/password/i), 'Wrong123!')
        await userEvent.click(screen.getByRole('button', { name: /log in/i }))

        expect(await screen.findByText(/Authentication failed. Please check your credentials./i)).toBeInTheDocument()
    })
})

