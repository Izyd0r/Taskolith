import { describe, it, expect } from 'vitest'
import { InviteMemberScheme } from '@/features/organisation/validators/InviteMemberScheme'

describe('InviteMemberScheme', () => {

    describe('email validation', () => {
        it('should pass with a valid email address', () => {
            const result = InviteMemberScheme.safeParse({
                email: 'test.user@example.com',
                dueDate: '2025-01-01T00:00:00.000Z'
            })
            expect(result.success).toBe(true)
        })

        it('should fail with a string that is not an email', () => {
            const result = InviteMemberScheme.safeParse({
                email: 'not-an-email',
                dueDate: '2025-01-01T00:00:00.000Z'
            })
            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Invalid email address')
            }
        })
    })

    describe('dueDate validation', () => {
        it('should pass with a valid ISO 8601 datetime string', () => {
            const result = InviteMemberScheme.safeParse({
                email: 'test@example.com',
                dueDate: '2025-12-31T10:00:00.000Z'
            })
            expect(result.success).toBe(true)
        })

        it('should fail with a non-ISO date format', () => {
            const result = InviteMemberScheme.safeParse({
                email: 'test@example.com',
                dueDate: 'December 31, 2025'
            })
            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Invalid datetime format')
            }
        })
    })

    describe('object structure validation', () => {
        it('should fail if email is missing', () => {
            const result = InviteMemberScheme.safeParse({
                dueDate: '2025-01-01T00:00:00.000Z'
            })
            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Invalid email address')
            }
        })

        it('should fail if dueDate is missing', () => {
            const result = InviteMemberScheme.safeParse({
                email: 'test@example.com'
            })
            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Invalid datetime format')
            }
        })

        it('should pass with a complete and valid object', () => {
            const validData = {
                email: 'jane.doe@example.co.uk',
                dueDate: '2026-03-15T23:59:59.000Z'
            }
            const result = InviteMemberScheme.safeParse(validData)
            expect(result.success).toBe(true)
            if (result.success) {
                expect(result.data).toEqual(validData)
            }
        })
    })
})
