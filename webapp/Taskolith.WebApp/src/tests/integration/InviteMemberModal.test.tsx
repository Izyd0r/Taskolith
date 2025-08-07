import React from 'react'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { http } from 'msw'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { InviteMemberModal } from '@/features/organisation/components/InviteMemberModal'
import RenderWithClient from '@/tests/integration/utils/RenderWithClient'
import { server, resetMockData } from '@/tests/testServer'

window.alert = vi.fn()

describe('InviteMemberModal', () => {
    const organisationId = 'org123'
    const onOpenChangeMock = vi.fn()

    beforeEach(() => {
        resetMockData()
        vi.clearAllMocks()
    })

    it('should render all fields and actions correctly', () => {
        RenderWithClient(
            <InviteMemberModal open={true} onOpenChange={onOpenChangeMock} organisationId={organisationId} />
        )

        expect(screen.getByText('Invite New Member')).toBeInTheDocument()
        expect(screen.getByPlaceholderText("Enter member's email")).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Invitation expiry date')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /send invitation/i })).toBeInTheDocument()
    })

    it('should show a validation error if the email field is empty on submit', async () => {
        RenderWithClient(
            <InviteMemberModal open={true} onOpenChange={onOpenChangeMock} organisationId={organisationId} />
        )

        fireEvent.click(screen.getByRole('button', { name: /send invitation/i }))

        expect(await screen.findByText('Email is required.')).toBeInTheDocument()
        expect(onOpenChangeMock).not.toHaveBeenCalled()
    })

    it('should show a validation error if the expiry date is empty on submit', async () => {
        RenderWithClient(
            <InviteMemberModal open={true} onOpenChange={onOpenChangeMock} organisationId={organisationId} />
        )

        fireEvent.change(screen.getByPlaceholderText("Enter member's email"), { target: { value: 'test@example.com' } })
        fireEvent.click(screen.getByRole('button', { name: /send invitation/i }))

        expect(await screen.findByText('Expiry date is required.')).toBeInTheDocument()
        expect(onOpenChangeMock).not.toHaveBeenCalled()
    })

    it('should successfully send an invitation and close the modal', async () => {
        RenderWithClient(
            <InviteMemberModal open={true} onOpenChange={onOpenChangeMock} organisationId={organisationId} />
        )

        fireEvent.change(screen.getByPlaceholderText("Enter member's email"), { target: { value: 'new.member@example.com' } })
        fireEvent.change(screen.getByPlaceholderText('Invitation expiry date'), { target: { value: '2025-10-20' } })
        fireEvent.click(screen.getByRole('button', { name: /send invitation/i }))

        expect(screen.getByText('Sending...')).toBeInTheDocument()

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('Invitation sent successfully!')
            expect(onOpenChangeMock).toHaveBeenCalledWith(false)
        })

        expect(screen.queryByText('Sending...')).not.toBeInTheDocument()
    })

    it('should display a specific server error message on failure', async () => {
        server.use(
            http.post(`http://localhost:5000/api/organisations/:organisationId/invitations`, () => {
                return new Response(JSON.stringify({ message: 'This member has already been invited.' }), { status: 409 })
            })
        )

        RenderWithClient(
            <InviteMemberModal open={true} onOpenChange={onOpenChangeMock} organisationId={organisationId} />
        )

        fireEvent.change(screen.getByPlaceholderText("Enter member's email"), { target: { value: 'already.invited@example.com' } })
        fireEvent.change(screen.getByPlaceholderText('Invitation expiry date'), { target: { value: '2025-11-01' } })
        fireEvent.click(screen.getByRole('button', { name: /send invitation/i }))

        expect(await screen.findByText('This member has already been invited.')).toBeInTheDocument()
        expect(onOpenChangeMock).not.toHaveBeenCalled()
    })

    it('should close the modal when the cancel button is clicked', () => {
        RenderWithClient(
            <InviteMemberModal open={true} onOpenChange={onOpenChangeMock} organisationId={organisationId} />
        )

        fireEvent.click(screen.getByRole('button', { name: /cancel/i }))

        expect(onOpenChangeMock).toHaveBeenCalledWith(false)
        expect(window.alert).not.toHaveBeenCalled()
    })
})
