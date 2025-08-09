import React from 'react'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { http } from 'msw'
import { server, resetMockData } from '@/tests/testServer'
import RolesPage from '@/features/organisation/components/RolesPage'
import RenderWithClient from '@/tests/integration/utils/RenderWithClient'
import { useAuth } from '@/features/auth/context/AuthContext'

vi.mock('@/features/auth/context/AuthContext', async () => {
    const actual = await vi.importActual('@/features/auth/context/AuthContext')
    return { ...actual, useAuth: vi.fn() }
})

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return { ...actual, useParams: () => ({ organisationId: 'org123' }) }
})

const useAuthMock = useAuth as unknown as Mock
const API_BASE_URL = 'http://localhost:5000/api'

describe('RolesPage - Integration Test', () => {
    const initialRoute = ['/organisations/org123/roles']

    beforeEach(() => {
        vi.clearAllMocks()
        resetMockData()
        useAuthMock.mockReturnValue({ userId: 'user-alice-id' })
        vi.spyOn(window, 'confirm').mockImplementation(() => true)
        vi.spyOn(window, 'alert').mockImplementation(() => { })
    })

    it('should show a loading state, then fetch and render the roles list', async () => {
        RenderWithClient(<RolesPage />, { initialEntries: initialRoute })

        expect(screen.getByText(/Loading roles.../i)).toBeInTheDocument()
        expect(await screen.findByText('Organisation Admin')).toBeInTheDocument()
        expect(screen.getByText('Viewer')).toBeInTheDocument()
    })

    it('should display an error message if fetching roles fails', async () => {
        server.use(
            http.get(`${API_BASE_URL}/organisations/:organisationId/roles`, () => {
                return new Response(null, { status: 500 })
            })
        )
        RenderWithClient(<RolesPage />, { initialEntries: initialRoute })
        expect(await screen.findByText(/Failed to load roles/i)).toBeInTheDocument()
    })

    describe('Permissions', () => {
        it('should show management buttons for a user with permissions', async () => {
            useAuthMock.mockReturnValue({ userId: 'user-alice-id' })
            RenderWithClient(<RolesPage />, { initialEntries: initialRoute })

            expect(await screen.findByRole('button', { name: /new role/i })).toBeInTheDocument()

            const adminRoleRow = (await screen.findByText('Organisation Admin')).closest('tr')!
            expect(within(adminRoleRow).getByRole('button', { name: /edit/i })).toBeInTheDocument()
            expect(within(adminRoleRow).getByRole('button', { name: /delete/i })).toBeInTheDocument()
        })

        it('should hide management buttons for a user without permissions', async () => {
            useAuthMock.mockReturnValue({ userId: 'user-viewer-id' })
            RenderWithClient(<RolesPage />, { initialEntries: initialRoute })

            await screen.findByText('Organisation Admin')

            expect(screen.queryByRole('button', { name: /new role/i })).not.toBeInTheDocument()

            const adminRoleRow = screen.getByText('Organisation Admin').closest('tr')!
            expect(within(adminRoleRow).queryByRole('button', { name: /edit/i })).not.toBeInTheDocument()
            expect(within(adminRoleRow).queryByRole('button', { name: /delete/i })).not.toBeInTheDocument()
        })
    })

    describe('Create Role Workflow', () => {
        it('should open the modal, create a new role, and add it to the list', async () => {
            const user = userEvent.setup()
            RenderWithClient(<RolesPage />, { initialEntries: initialRoute })

            await user.click(await screen.findByRole('button', { name: /new role/i }))
            const dialog = screen.getByRole('dialog')
            expect(within(dialog).getByRole('heading', { name: 'New Role' })).toBeInTheDocument()

            const nameInput = screen.getByPlaceholderText(/role name/i)
            const createProjectSwitch = within(dialog).getByText('Create Projects').closest('div')!.querySelector('button[role="switch"]')!
            const saveButton = screen.getByRole('button', { name: /save role/i })

            await user.type(nameInput, 'Product Manager')
            await user.click(createProjectSwitch)

            await user.click(saveButton)

            await waitFor(() => {
                expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
            })
            expect(await screen.findByText('Product Manager')).toBeInTheDocument()
        })

        it('should show validation alert if name is empty on submit', async () => {
            const user = userEvent.setup()
            RenderWithClient(<RolesPage />, { initialEntries: initialRoute })

            await user.click(await screen.findByRole('button', { name: /new role/i }))
            await user.click(screen.getByRole('button', { name: /save role/i }))

            expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/Role name is required/i))

            const dialog = screen.getByRole('dialog')
            expect(within(dialog).getByText('New Role')).toBeInTheDocument()
        })
    })

    describe('Update Role Workflow', () => {
        it('should open the modal with data, update the role, and reflect changes', async () => {
            const user = userEvent.setup()
            RenderWithClient(<RolesPage />, { initialEntries: initialRoute })

            const viewerRoleRow = (await screen.findByText('Viewer')).closest('tr')!
            await user.click(within(viewerRoleRow).getByRole('button', { name: /edit/i }))

            expect(await screen.findByText('Edit Role')).toBeInTheDocument()
            const nameInput = screen.getByPlaceholderText(/role name/i)
            expect(nameInput).toHaveValue('Viewer')

            const deleteTaskSwitch = within(screen.getByRole('dialog')).getByText('Delete Tasks').closest('div')!.querySelector('button[role="switch"]')!
            await user.clear(nameInput)
            await user.type(nameInput, 'Stakeholder')
            await user.click(deleteTaskSwitch)

            await user.click(screen.getByRole('button', { name: /save role/i }))

            await waitFor(() => {
                expect(screen.queryByText('Edit Role')).not.toBeInTheDocument()
            })
            expect(await screen.findByText('Stakeholder')).toBeInTheDocument()
            expect(screen.queryByText('Viewer')).not.toBeInTheDocument()
        })
    })

    describe('Delete Role Workflow', () => {
        it('should remove a role from the list after confirmation', async () => {
            const user = userEvent.setup()
            RenderWithClient(<RolesPage />, { initialEntries: initialRoute })

            const viewerRoleRow = (await screen.findByText('Viewer')).closest('tr')!
            await user.click(within(viewerRoleRow).getByRole('button', { name: /delete/i }))

            expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this role?')

            await waitFor(() => {
                expect(screen.queryByText('Viewer')).not.toBeInTheDocument()
            })
        })
    })
})
