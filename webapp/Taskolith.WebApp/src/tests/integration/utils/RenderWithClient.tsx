import React from 'react'
import { render } from '@testing-library/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/features/auth/context/AuthContext'
import createTestQueryClient from '@/tests/integration/utils/createTestQueryDefault'

const RenderWithClient = (ui: React.ReactNode, { isLoggedIn = false } = {}) => {
    const queryClient = createTestQueryClient()
    const user = isLoggedIn ? 'test-user' : null
    const token = isLoggedIn ? 'fake-token' : null
    return render(
        <AuthProvider initialUsername={user} initialToken={token}>
            <QueryClientProvider client={queryClient}>
                {ui}
            </QueryClientProvider>
        </AuthProvider>
    )
}
export default RenderWithClient;
