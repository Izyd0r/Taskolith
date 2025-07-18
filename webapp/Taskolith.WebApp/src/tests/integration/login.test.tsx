import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest';

const createTestQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    })

describe('Login integration', () => {
    it('should login with correct credentials', async () => {
        const queryClient = createTestQueryClient()

        render(
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <LoginForm />
                </BrowserRouter>
            </QueryClientProvider>
        )

        const emailInput = screen.getByPlaceholderText(/username/i)
        const passwordInput = screen.getByPlaceholderText(/password/i)
        const submitBtn = screen.getByRole('button', { name: /log in/i })

        await userEvent.type(emailInput, 'user1')
        await userEvent.type(passwordInput, 'StrongPass123!')
        await userEvent.click(submitBtn)

        expect(await screen.findByText(/welcome/i)).toBeInTheDocument()
    })

    it('should show error for invalid credentials', async () => {
        const queryClient = createTestQueryClient()

        render(
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <LoginForm />
                </BrowserRouter>
            </QueryClientProvider>
        )

        await userEvent.type(screen.getByPlaceholderText(/username/i), 'invalid')
        await userEvent.type(screen.getByPlaceholderText(/password/i), 'Wrong123!')
        await userEvent.click(screen.getByRole('button', { name: /log in/i }))

        expect(await screen.findByText(/Authentication failed. Please check credentials./i)).toBeInTheDocument()
    })
})

