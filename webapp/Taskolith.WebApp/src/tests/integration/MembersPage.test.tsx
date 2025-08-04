import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@/tests/testServer'
import MembersPage from '@/features/organisation/components/MembersPage'
import RenderWithClient from '@/tests/integration/utils/RenderWithClient'
import { useAuth } from '@/features/auth/context/AuthContext'

vi.mock('@/features/auth/context/AuthContext', async () => {
    const actual = await vi.importActual('@/features/auth/context/AuthContext')
    return {
        ...actual,
        useAuth: vi.fn(),
    }
})

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        useParams: () => ({ organisationId: 'org123' }),
    }
})
const useAuthMock = useAuth as unknown as Mock

describe('MembersPage - Full Integration Test', () => {
    const initialRoute = ['/organisations/org123/members']

    beforeEach(() => {
        vi.clearAllMocks()
        useAuthMock.mockReturnValue({ userId: 'user-generic-id' })
        vi.spyOn(window, 'confirm').mockImplementation(() => true)
    })

    it('should show a loading message, then fetch and render the member list', async () => {
        RenderWithClient(<MembersPage />, { initialEntries: initialRoute })
        expect(screen.getByText(/Loading members.../i)).toBeInTheDocument()
        expect(await screen.findByText('Alice')).toBeInTheDocument()
    })

    describe('User Interaction', () => {
        const initialRoute = '/organisations/org-123'
        it('should display an error message if the API call fails', async () => {
            server.use(
                http.get('*/api/organisations/:organisationId/members', () => {
                    return new HttpResponse(null, {
                        status: 500,
                        statusText: 'Internal Server Error',
                    })
                })
            )
            RenderWithClient(<MembersPage />, { initialEntries: [initialRoute] })
            const errorMessage = await screen.findByText(/Failed to load members./i)
            expect(errorMessage).toBeInTheDocument()
        })
    })

    describe('Permissions', () => {
        it('should show a kick button on another user if the current user has permission', async () => {
            useAuthMock.mockReturnValue({ userId: 'user-alice-id' });
            RenderWithClient(<MembersPage />, { initialEntries: initialRoute });
            expect(await screen.findByLabelText(/Kick Bob/i)).toBeInTheDocument();
        });
    })

    describe('User Interaction', () => {
        it('should filter the member list based on search query', async () => {
            const user = userEvent.setup()
            RenderWithClient(<MembersPage />, { initialEntries: initialRoute })
            const searchInput = await screen.findByPlaceholderText(/Filter by username, email, or role.../i)
            expect(await screen.findByText('Alice')).toBeInTheDocument()
            expect(screen.getByText('Bob')).toBeInTheDocument()
            await user.type(searchInput, 'Developer')
            await waitFor(() => {
                expect(screen.queryByText('Alice')).not.toBeInTheDocument()
            })
            expect(screen.getByText('Bob')).toBeInTheDocument()
        })

        it('should remove a member from the list after they are kicked', async () => {
            const user = userEvent.setup()
            useAuthMock.mockReturnValue({ userId: 'user-alice-id' })
            RenderWithClient(<MembersPage />, { initialEntries: initialRoute })
            const kickButton = await screen.findByLabelText(/Kick Bob/i)
            await user.click(kickButton)
            await waitFor(() => {
                expect(screen.queryByText('Bob')).not.toBeInTheDocument()
            })
        })
    })
})
