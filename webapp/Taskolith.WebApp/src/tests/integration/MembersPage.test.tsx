import React from 'react'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server, resetMockData } from '@/tests/testServer'
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
        resetMockData()
        useAuthMock.mockReturnValue({ userId: 'user-generic-id' })
        vi.spyOn(window, 'confirm').mockImplementation(() => true)
    })

    it('should show a loading message, then fetch and render the member list', async () => {
        RenderWithClient(<MembersPage />, { initialEntries: initialRoute })
        expect(screen.getByText(/Loading members.../i)).toBeInTheDocument()
        expect(await screen.findByText('Alice')).toBeInTheDocument()
    })

    describe('API Error Handling', () => {
        it('should display an error message if the API call fails', async () => {
            server.use(
                http.get('*/api/organisations/:organisationId/members', () => {
                    return new HttpResponse(null, {
                        status: 500,
                        statusText: 'Internal Server Error',
                    })
                })
            )
            RenderWithClient(<MembersPage />, { initialEntries: initialRoute })
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

    describe('Invite Member Modal', () => {
        beforeEach(() => {
            useAuthMock.mockReturnValue({ userId: 'user-alice-id' })
            vi.spyOn(window, 'alert').mockImplementation(() => { })
        })

        it('should open the invite modal when the invite button is clicked', async () => {
            const user = userEvent.setup()
            RenderWithClient(<MembersPage />, { initialEntries: initialRoute })
            const inviteButton = await screen.findByRole('button', { name: /invite member/i })
            await user.click(inviteButton)
            expect(await screen.findByRole('dialog')).toBeInTheDocument()
            expect(screen.getByText(/invite new member/i)).toBeInTheDocument()
        })

        it('should show client-side validation errors if fields are empty', async () => {
            const user = userEvent.setup()
            RenderWithClient(<MembersPage />, { initialEntries: initialRoute })
            const inviteButton = await screen.findByRole('button', { name: /invite member/i })
            await user.click(inviteButton)
            const sendButton = await screen.findByRole('button', { name: /send invitation/i })
            await user.click(sendButton)
            expect(await screen.findByText(/email is required/i)).toBeInTheDocument()
            const emailInput = screen.getByPlaceholderText(/enter member's email/i)
            await user.type(emailInput, 'new.member@test.com')
            await user.click(sendButton)
            expect(await screen.findByText(/expiry date is required/i)).toBeInTheDocument()
        })

        it('should successfully send an invitation and close the modal', async () => {
            const user = userEvent.setup()
            server.use(
                http.post('*/api/organisations/org123/invitations', () => {
                    return new HttpResponse(null, { status: 200 })
                })
            )
            RenderWithClient(<MembersPage />, { initialEntries: initialRoute })
            const inviteButton = await screen.findByRole('button', { name: /invite member/i })
            await user.click(inviteButton)
            const emailInput = await screen.findByPlaceholderText(/enter member's email/i)
            const dateInput = screen.getByPlaceholderText(/invitation expiry date/i)
            const sendButton = screen.getByRole('button', { name: /send invitation/i })
            await user.type(emailInput, 'new.user@example.com')
            await user.type(dateInput, '2025-12-31')
            await user.click(sendButton)
            await waitFor(() => {
                expect(window.alert).toHaveBeenCalledWith('Invitation sent successfully!')
            })
            await waitFor(() => {
                expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
            })
        })

        it('should display a specific API error inside the modal if the backend fails', async () => {
            const user = userEvent.setup()
            server.use(
                http.post('*/api/organisations/org123/invitations', () => {
                    return new HttpResponse(
                        JSON.stringify({
                            title: 'One or more validation errors occurred.',
                            status: 400,
                            errors: { DueDate: ['Invitation date cannot be in the past.'] },
                        }),
                        { status: 400, headers: { 'Content-Type': 'application/json' } }
                    )
                })
            )
            RenderWithClient(<MembersPage />, { initialEntries: initialRoute })
            const inviteButton = await screen.findByRole('button', { name: /invite member/i })
            await user.click(inviteButton)
            const emailInput = await screen.findByPlaceholderText(/enter member's email/i)
            const dateInput = screen.getByPlaceholderText(/invitation expiry date/i)
            const sendButton = screen.getByRole('button', { name: /send invitation/i })
            await user.type(emailInput, 'new.user@example.com')
            await user.type(dateInput, '2020-01-01')
            await user.click(sendButton)
            expect(await screen.findByText(/Invitation date cannot be in the past/i)).toBeInTheDocument()
            expect(screen.getByRole('dialog')).toBeInTheDocument()
        })
    })
    describe('Manage Roles Modal', () => {
        beforeEach(() => {
            useAuthMock.mockReturnValue({ userId: 'user-alice-id' })
        })

        it('should open the modal when clicking "Manage Roles"', async () => {
            const user = userEvent.setup()
            RenderWithClient(<MembersPage />, { initialEntries: initialRoute })
            const bobRow = await screen.findByText('Bob').then(node => node.closest('tr'))
            const manageButton = within(bobRow!).getByRole('button', { name: /manage roles/i })
            await user.click(manageButton)
            expect(await screen.findByRole('dialog')).toBeInTheDocument()
            expect(screen.getByText(/manage roles for bob/i)).toBeInTheDocument()
        })

        it('should add a role to a member and update the UI', async () => {
            const user = userEvent.setup()
            RenderWithClient(<MembersPage />, { initialEntries: initialRoute })
            const bobRow = await screen.findByText('Bob').then(node => node.closest('tr'))
            expect(within(bobRow!).queryByText('Viewer')).not.toBeInTheDocument()

            const manageButton = within(bobRow!).getByRole('button', { name: /manage roles/i })
            await user.click(manageButton)

            const viewerCheckbox = await screen.findByLabelText('Viewer')
            expect(viewerCheckbox).not.toBeChecked()

            await user.click(viewerCheckbox)
            await waitFor(() => {
                expect(viewerCheckbox).toBeChecked()
            })

            await user.click(screen.getByRole('button', { name: /done/i }))
            await waitFor(() => {
                expect(within(bobRow!).getByText('Viewer')).toBeInTheDocument()
            })
        })

        it('should remove a role from a member and update the UI', async () => {
            const user = userEvent.setup()
            RenderWithClient(<MembersPage />, { initialEntries: initialRoute })
            const bobRow = await screen.findByText('Bob').then(node => node.closest('tr'))
            expect(within(bobRow!).getByText('Developer')).toBeInTheDocument()

            const manageButton = within(bobRow!).getByRole('button', { name: /manage roles/i })
            await user.click(manageButton)

            const developerCheckbox = await screen.findByLabelText('Developer')
            expect(developerCheckbox).toBeChecked()

            await user.click(developerCheckbox)

            await waitFor(() => {
                expect(developerCheckbox).not.toBeChecked()
            })

            await user.click(screen.getByRole('button', { name: /done/i }))
            await waitFor(() => {
                expect(within(bobRow!).queryByText('Developer')).not.toBeInTheDocument()
            })
        })

        it('should not show the Manage Roles button if user lacks permission', async () => {
            useAuthMock.mockReturnValue({ userId: 'user3' })
            RenderWithClient(<MembersPage />, { initialEntries: initialRoute })
            expect(await screen.findByText('Alice')).toBeInTheDocument()
            expect(screen.queryByRole('button', { name: /manage roles/i })).not.toBeInTheDocument()
        })
    })
})
