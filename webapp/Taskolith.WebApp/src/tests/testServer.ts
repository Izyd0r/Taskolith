import { setupServer } from 'msw/node'
import { http } from 'msw'
import { type LoginCredentials } from '@/types/auth'

export const server = setupServer(
    http.post('http://localhost:5000/api/auth/login', async ({ request }) => {
        const body = await request.json() as LoginCredentials
        if (body?.username === 'user1' && body?.password === 'StrongPass123!') {
            return new Response(JSON.stringify({ token: 'abc123' }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        return new Response(JSON.stringify({ message: 'Invalid credentials' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        })
    })
) 
