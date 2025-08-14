import React from 'react'
import { render } from '@testing-library/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/features/auth/context/AuthContext'
import createTestQueryClient from '@/tests/integration/utils/createTestQueryDefault'
import { MemoryRouter } from 'react-router-dom'

const RenderWithClient = (
    ui: React.ReactNode,
    { isLoggedIn = false, initialEntries = ['/'] } = {}
) => {
    const queryClient = createTestQueryClient()
    const user = isLoggedIn ? 'test-user' : null
    const token = isLoggedIn ? 'fake-token' : null

    return render(
        <MemoryRouter initialEntries={initialEntries}>
            <QueryClientProvider client={queryClient}>
                <AuthProvider initialUsername={user} initialToken={token}>
                    {ui}
                </AuthProvider>
            </QueryClientProvider>
        </MemoryRouter>
    )
}

export default RenderWithClient
