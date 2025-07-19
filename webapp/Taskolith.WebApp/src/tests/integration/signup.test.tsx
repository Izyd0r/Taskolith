import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { renderSignupForm } from '@/tests/integration/utils/renderSignupForm'

describe('SignupForm Integration', () => {
    it('should submit form with valid credentials and show dashboard', async () => {
        renderSignupForm()

        const user = userEvent.setup()

        await user.type(screen.getByPlaceholderText(/Username/i), 'user1')
        await user.type(screen.getByPlaceholderText(/First name/i), 'Jan')
        await user.type(screen.getByPlaceholderText(/Last name/i), 'Kowalski')
        await user.type(screen.getByPlaceholderText(/Email address/i), 'email@mail.com')
        await user.type(screen.getByPlaceholderText(/^Password$/i), 'StrongPass123!')
        await user.type(screen.getByPlaceholderText(/^Confirm Password$/i), 'StrongPass123!')

        await user.click(screen.getByRole('button', { name: /^Create Account$/i }))

        await waitFor(() => {
            expect(screen.getByText('Dashboard')).toBeInTheDocument()
        })
    })

    it('should show validation errors for invalid input', async () => {
        renderSignupForm()

        const user = userEvent.setup()

        await user.type(screen.getByPlaceholderText(/Username/i), ' ')
        await user.type(screen.getByPlaceholderText(/First name/i), ' ')
        await user.type(screen.getByPlaceholderText(/Last name/i), ' ')
        await user.type(screen.getByPlaceholderText(/Email/i), 'Invalid-email')
        await user.type(screen.getByPlaceholderText(/^Password$/i), 'short')
        await user.type(screen.getByPlaceholderText(/^Confirm Password$/i), 'wrongpass')

        await user.click(screen.getByRole('button', { name: /^Create Account$/i }))

        await waitFor(() => {
            expect(screen.getByText(/Invalid email/i)).toBeInTheDocument()
            expect(screen.getByText(/^Password must be at least 8 characters long$/i)).toBeInTheDocument()
            expect(screen.getByText(/^Password do not match$/i)).toBeInTheDocument()

            expect(screen.getByText(/^Username is required$/i)).toBeInTheDocument()
            expect(screen.getByText(/^First name is required$/i)).toBeInTheDocument()
            expect(screen.getByText(/^Last name is required$/i)).toBeInTheDocument()
        })
    })

    it('should show API error on signup failure', async () => {
        renderSignupForm()

        const user = userEvent.setup()

        await user.type(screen.getByPlaceholderText(/Username/i), 'failuser')
        await user.type(screen.getByPlaceholderText(/First name/i), 'John')
        await user.type(screen.getByPlaceholderText(/Last name/i), 'Doe')
        await user.type(screen.getByPlaceholderText(/Email address/i), 'fail@mail.com')
        await user.type(screen.getByPlaceholderText(/^Password$/i), 'WrongPass123!')
        await user.type(screen.getByPlaceholderText(/^Confirm Password$/i), 'WrongPass123!')

        await user.click(screen.getByRole('button', { name: /^Create Account$/i }))

        await waitFor(() => {
            expect(screen.getByText(/an error occurred during sign up/i)).toBeInTheDocument()
        })
    })
})
