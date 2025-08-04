import { setupServer } from 'msw/node'
import { http } from 'msw'
import { type LoginCredentials, type SignupCredentials } from '@/features/auth/types/auth'
import { CreateOrganisationScheme } from '@/features/dashboard/validators/CreateOrganisationScheme'
import { randomUUID } from 'crypto'
import { z } from 'zod'
import { type CreateProjectRequest } from '@/features/organisation/types/CreateProjectRequest'
import { type Project } from '@/features/organisation/types/Project'
import { Permission } from '@/features/organisation/types/Permission';
import { type GetOrganisationMembersResponse } from '@/features/organisation/types/GetOrganisationMembersResponse'

const mockApiMembersResponse: GetOrganisationMembersResponse[] = [
    {
        member: {
            memberId: 'mem-alice',
            userId: 'user-alice-id',
            organisationId: 'org123',
            username: 'Alice',
            email: 'alice@example.com',
            roles: [],
        },
        roles: [
            { id: 'role1', organisationId: 'org123', name: 'Organisation Admin', permissions: Permission.InviteMember | Permission.KickMember },
        ],
    },
    {
        member: {
            memberId: 'mem-bob',
            userId: 'user-bob-id',
            organisationId: 'org123',
            username: 'Bob',
            email: 'bob@example.com',
            roles: [],
        },
        roles: [
            { id: 'role2', organisationId: 'org123', name: 'Developer', permissions: Permission.CreateTask }
        ],
    },
    {
        member: {
            memberId: 'mem3',
            userId: 'user3',
            organisationId: 'org123',
            username: 'Charlie',
            email: 'charlie@example.com',
            roles: [],
        },
        roles: [
            { id: 'role3', organisationId: 'org123', name: 'Viewer', permissions: Permission.Public }
        ],
    },
];

let liveMockData: GetOrganisationMembersResponse[] = JSON.parse(JSON.stringify(mockApiMembersResponse));

export const resetMockData = () => {
    liveMockData = JSON.parse(JSON.stringify(mockApiMembersResponse));
}

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
    }),
    http.post('http://localhost:5000/api/auth/register', async ({ request }) => {
        const body = await request.json() as SignupCredentials
        if (body?.username === 'user1' &&
            body?.firstname === 'Jan' &&
            body?.lastname === 'Kowalski' &&
            body?.email === 'email@mail.com' &&
            body?.password === 'StrongPass123!' &&
            body?.confirmPassword === 'StrongPass123!'
        ) {
            return new Response(JSON.stringify({
                userId: randomUUID(),
                username: 'user1',
                firstname: 'Jan',
                lastname: 'Kowalski',
                email: 'email@mail.com',
                token: 'abc123',
                refreshToken: 'abc1234',
            }), {
                status: 201,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        return new Response(JSON.stringify({ message: 'Invalid credentials' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        })
    }),
    http.post('http://localhost:5000/api/organisations', async ({ request }) => {
        try {
            const json = await request.json()
            const body = CreateOrganisationScheme.parse(json)
            return new Response(null, { status: 201 })
        } catch (err) {
            if (err instanceof z.ZodError) {
                return new Response(
                    JSON.stringify({ errors: err.message }),
                    { status: 400, headers: { 'Content-Type': 'application/json' } }
                )
            }
        }
        return new Response('Internal Server Error', { status: 500 })
    }),
    http.get('http://localhost:5000/api/organisations/user', async () => {
        try {
            const mockData = [
                {
                    organisationId: 'c4c03394-bd10-4c3f-9a02-bda4e3fbf55f',
                    organisationName: 'Org One',
                },
                {
                    organisationId: '1e201439-3dcd-428f-92b8-9ba1eb8c605e',
                    organisationName: 'Org Two',
                },
            ]

            return Response.json(mockData, { status: 200 })
        } catch (err: any) {
            return new Response(
                JSON.stringify({ errors: err.message }),
                {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' },
                }
            )
        }
    }),
    http.get('http://localhost:5000/api/organisations/:organisationId/members', () => {
        return Response.json(liveMockData, { status: 200 });
    }),
    http.delete('http://localhost:5000/api/organisations/:organisationId/members/:memberId', ({ params }) => {
        const { memberId } = params;
        liveMockData = liveMockData.filter(item => item.member.memberId !== memberId);
        return new Response(null, { status: 204 });
    }),
    http.post('http://localhost:5000/api/organisations/:organisationId/projects', async ({ request, params }) => {
        const body = await request.json() as CreateProjectRequest
        const { organisationId } = params

        if (!body.name || !organisationId) {
            return new Response(
                JSON.stringify({ message: 'Invalid data' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            )
        }
        return new Response(JSON.stringify({
            ProjectId: crypto.randomUUID()
        }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            })
    }),
    http.get('http://localhost:5000/api/organisations/:organisationId/projects', async ({ params }) => {
        const { organisationId } = params
        const mockProjects: Project[] = [
            {
                projectId: crypto.randomUUID(),
                projectName: 'Website Redesign',
                projectDescription: 'Revamp the marketing site for Q3 launch.',
            },
            {
                projectId: crypto.randomUUID(),
                projectName: 'Internal Dashboard',
                projectDescription: 'Create an internal dashboard for tracking tasks.',
            },
        ]
        return Response.json(mockProjects, {
            status: 200,
        })
    })
)
