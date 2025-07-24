import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import DashboardOrganisation from '@/features/dashboard/components/DashboardOrganisation'
import RenderWithClient from '@/tests/integration/utils/RenderWithClient'

describe('Create organisation Integration', () => {
    it('authenticated user should create organisation and return success', async () => {
        RenderWithClient(<DashboardOrganisation />, { isLoggedIn: true })
        const user = userEvent.setup()
        await user.type(screen.getByPlaceholderText(/Organisation Name/i), "Organisation Name")
        await user.click(screen.getByRole('button', { name: /Create/i }))
        await waitFor(() => {
            expect(screen.getByText('Organisation created!')).toBeInTheDocument()
        })

    })
})
