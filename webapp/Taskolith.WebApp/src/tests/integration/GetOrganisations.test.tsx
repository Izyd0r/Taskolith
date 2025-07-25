import React from 'react'
import { screen, waitFor, render } from '@testing-library/react'
import { QueryClientProvider } from '@tanstack/react-query'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import DashboardHome from '@/features/dashboard/components/DashboardHome'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import createTestQueryClient from '@/tests/integration/utils/createTestQueryDefault'

describe('Get Organisations Integration', () => {
    it('user should see all organisations and navigate to one', async () => {
        const OrganisationPage = () => <div>Organisation Detail Page</div>
        const queryClient = createTestQueryClient()
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={['/']}>
                    <Routes>
                        <Route path="/" element={<DashboardHome />} />
                        <Route path="/organisations/:organisationId" element={<OrganisationPage />} />
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => {
            expect(screen.getByText('Org One')).toBeInTheDocument()
            expect(screen.getByText('Org Two')).toBeInTheDocument()
        })

        const viewButton = screen.getAllByRole('button', { name: /view/i })
        await userEvent.click(viewButton[0])

        await waitFor(() => {
            expect(screen.getByText('Organisation Detail Page')).toBeInTheDocument()
        })
    })
})
