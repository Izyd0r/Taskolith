import { describe, it, expect } from 'vitest';
import { signupScheme } from '../../validators/signupSchema';

const validData = {
    username: 'testuser',
    firstname: 'FirstNameX',
    lastname: 'LastNameX',
    email: 'test@example.com',
    password: 'Password123!',
    confirmPassword: 'Password123!',
};

describe('signupScheme', () => {
    it('should validate successfully with correct data', () => {
        const result = signupScheme.safeParse(validData);
        expect(result.success).toBe(true);
    });

    describe('username', () => {
        it('should fail if too short', () => {
            const result = signupScheme.safeParse({ ...validData, username: 'ab' });
            expect(result.success).toBe(false);
            expect(result.success && result.data).toBe(false);
            if (!result.success) {
                expect(result.error.flatten().fieldErrors.username).toContain(
                    'Username must be at least 3 characters long',
                );
            }
        });

        it('should fail if empty', () => {
            const result = signupScheme.safeParse({ ...validData, username: '' });
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.flatten().fieldErrors.username).toContain('Username is required');
            }
        });
    });

    describe('firstname', () => {
        it('should fail if empty', () => {
            const result = signupScheme.safeParse({ ...validData, firstname: '' });
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.flatten().fieldErrors.firstname).toContain('First name is required');
            }
        });
    });

    describe('lastname', () => {
        it('should fail if empty', () => {
            const result = signupScheme.safeParse({ ...validData, lastname: '' });
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.flatten().fieldErrors.lastname).toContain('Last name is required');
            }
        });
    });

    describe('email', () => {
        it('should fail for invalid formats', () => {
            const invalidEmails = ['invalid', 'test@', 'foo@.com', 'bar..baz@domain.com'];
            for (const email of invalidEmails) {
                const result = signupScheme.safeParse({ ...validData, email });
                expect(result.success).toBe(false);
            }
        });
    });

    describe('password', () => {
        it('should fail if missing uppercase', () => {
            const result = signupScheme.safeParse({
                ...validData,
                password: 'password123!',
                confirmPassword: 'password123!',
            });
            expect(result.success).toBe(false);
        });

        it('should fail if missing lowercase', () => {
            const result = signupScheme.safeParse({
                ...validData,
                password: 'PASSWORD123!',
                confirmPassword: 'PASSWORD123!',
            });
            expect(result.success).toBe(false);
        });

        it('should fail if missing number', () => {
            const result = signupScheme.safeParse({
                ...validData,
                password: 'Password!!!',
                confirmPassword: 'Password!!!',
            });
            expect(result.success).toBe(false);
        });

        it('should fail if missing symbol', () => {
            const result = signupScheme.safeParse({
                ...validData,
                password: 'Password123',
                confirmPassword: 'Password123',
            });
            expect(result.success).toBe(false);
        });

        it('should fail if password and confirmPassword do not match', () => {
            const result = signupScheme.safeParse({
                ...validData,
                confirmPassword: 'Different123!',
            });
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.flatten().fieldErrors.confirmPassword).toContain('Password do not match');
            }
        });
    });
});

