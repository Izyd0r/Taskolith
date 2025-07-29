import { describe, it, expect } from 'vitest'
import { CreateProjectScheme } from '@/features/organisation/validators/CreateProjectScheme'

const validData = {
    name: 'Project Alpha',
    description: 'This is a valid project description.',
}

describe('CreateProjectScheme', () => {
    it('should validate successfully with correct data', () => {
        const result = CreateProjectScheme.safeParse(validData)
        expect(result.success).toBe(true)
    })

    describe('name field', () => {
        it('should fail if name is empty', () => {
            const result = CreateProjectScheme.safeParse({
                ...validData,
                name: '',
            })
            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.flatten().fieldErrors.name).toBeDefined()
            }
        })

        it('should fail if name is too short', () => {
            const result = CreateProjectScheme.safeParse({
                ...validData,
                name: 'ab',
            })
            expect(result.success).toBe(false)
        })

        it('should fail if name is too long', () => {
            const result = CreateProjectScheme.safeParse({
                ...validData,
                name: 'a'.repeat(51),
            })
            expect(result.success).toBe(false)
        })
    })

    describe('description field', () => {
        it('should fail if description is empty', () => {
            const result = CreateProjectScheme.safeParse({
                ...validData,
                description: '',
            })
            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.flatten().fieldErrors.description).toBeDefined()
            }
        })

        it('should fail if description is too short', () => {
            const result = CreateProjectScheme.safeParse({
                ...validData,
                description: 'ab',
            })
            expect(result.success).toBe(false)
        })

        it('should fail if description is too long', () => {
            const result = CreateProjectScheme.safeParse({
                ...validData,
                description: 'a'.repeat(101),
            })
            expect(result.success).toBe(false)
        })
    })
})
