import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import ProjectTiles from '@/features/organisation/components/ProjectTiles'
import RenderWithClient from '@/tests/integration/utils/RenderWithClient'
import { vi, beforeEach, type Mock } from 'vitest'

import { useGetProjects } from '@/features/organisation/hooks/useGetProjects'
import { useCreateProject } from '@/features/organisation/hooks/useCreateProject'

vi.mock('@/features/organisation/hooks/useGetProjects')
vi.mock('@/features/organisation/hooks/useCreateProject')

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useParams: () => ({ organisationId: 'org123' }),
    };
});

const useGetProjectsMock = useGetProjects as Mock
const useCreateProjectMock = useCreateProject as Mock

describe('ProjectTiles', () => {
    const initialRoute = ['/organisations/org123/projects']

    beforeEach(() => {
        vi.clearAllMocks()
        useGetProjectsMock.mockReturnValue({
            data: [],
            isLoading: false,
        })
        useCreateProjectMock.mockReturnValue({
            mutate: vi.fn(),
            isPending: false,
        })
    })

    it('should display a loading message while fetching projects', () => {
        useGetProjectsMock.mockReturnValue({
            data: [],
            isLoading: true,
        });

        RenderWithClient(<ProjectTiles />, { initialEntries: initialRoute })

        expect(screen.getByText(/Loading projects.../i)).toBeInTheDocument()
    })

    it('should display a list of projects when data is loaded', () => {
        const mockProjects = [
            { projectId: 'proj1', projectName: 'Project Alpha', projectDescription: 'Description for Alpha' },
            { projectId: 'proj2', projectName: 'Project Beta', projectDescription: 'Description for Beta' },
        ];
        useGetProjectsMock.mockReturnValue({
            data: mockProjects,
            isLoading: false,
        });

        RenderWithClient(<ProjectTiles />, { initialEntries: initialRoute })

        expect(screen.getByText('Project Alpha')).toBeInTheDocument()
        expect(screen.getByText('Project Beta')).toBeInTheDocument()
    })

    it('should navigate to the kanban board when a project is clicked', async () => {
        const mockProjects = [
            { projectId: 'proj1', projectName: 'Project Alpha', projectDescription: 'Description for Alpha' },
        ]
        useGetProjectsMock.mockReturnValue({
            data: mockProjects,
            isLoading: false,
        })

        RenderWithClient(<ProjectTiles />, { initialEntries: initialRoute })
        const user = userEvent.setup()
        await user.click(screen.getByRole('button', { name: /go to kanban/i }))

        expect(mockNavigate).toHaveBeenCalledWith('/organisations/org123/projects/proj1')
    })

    describe('Project Creation', () => {
        const mockCreateProject = vi.fn()

        beforeEach(() => {
            useCreateProjectMock.mockReturnValue({
                mutate: mockCreateProject,
                isPending: false,
            })
        })

        it('should open the create project dialog', async () => {
            RenderWithClient(<ProjectTiles />, { initialEntries: initialRoute })
            const user = userEvent.setup()
            await user.click(screen.getByRole('button', { name: /create project/i }))
            expect(screen.getByText(/new project details/i)).toBeInTheDocument()
        })

        it('should show validation errors for empty fields', async () => {
            RenderWithClient(<ProjectTiles />, { initialEntries: initialRoute })
            const user = userEvent.setup();
            await user.click(screen.getByRole('button', { name: /create project/i }))
            await user.click(screen.getByRole('button', { name: /^Create$/i }))

            expect(screen.getAllByText(/Project description is required/i).length).toBeGreaterThan(0)
        })

        it('should successfully create a new project and close the dialog', async () => {
            mockCreateProject.mockImplementation((_variables, options) => {
                options.onSuccess()
            })

            RenderWithClient(<ProjectTiles />, { initialEntries: initialRoute })
            const user = userEvent.setup()

            await user.click(screen.getByRole('button', { name: /create project/i }))
            await user.type(screen.getByPlaceholderText(/project name/i), 'New Awesome Project')
            await user.type(screen.getByPlaceholderText(/project description/i), 'This is a description.')
            await user.click(screen.getByRole('button', { name: /^Create$/i }))

            await waitFor(() => {
                expect(screen.queryByText(/new project details/i)).not.toBeInTheDocument()
            })

            expect(mockCreateProject).toHaveBeenCalledWith(
                { name: 'New Awesome Project', description: 'This is a description.' },
                expect.any(Object)
            )
            expect(screen.getByText('Project created successfully!')).toBeInTheDocument()
        });
    });
});
