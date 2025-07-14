import { describe, it, expect } from 'vitest';
import { loginScheme } from '../../validators/loginSchema';

const validData = {
    username: 'validUser',
    password: 'StrongPass123!',
};

describe('loginScheme (username-based)', () => {
    it('should validate successfully with correct data', () => {
        const result = loginScheme.safeParse(validData);
        expect(result.success).toBe(true);
    });

    describe('username', () => {
        it('should fail if empty', () => {
            const result = loginScheme.safeParse({ ...validData, username: '' });
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.flatten().fieldErrors.username).toBeDefined();
            }
        });

        it('should fail if too short', () => {
            const result = loginScheme.safeParse({ ...validData, username: 'ab' });
            expect(result.success).toBe(false);
        });

        it('should fail if too long', () => {
            const result = loginScheme.safeParse({ ...validData, username: 'a'.repeat(30) });
            expect(result.success).toBe(false);
        });
    });

    describe('password', () => {
        it('should fail if empty', () => {
            const result = loginScheme.safeParse({ ...validData, password: '' });
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.flatten().fieldErrors.password).toContain('Password is required');
            }
        });

        it('should fail if too short', () => {
            const result = loginScheme.safeParse({ ...validData, password: 'Aa1!' });
            expect(result.success).toBe(false);
        });

        it('should fail if too long', () => {
            const longPassword = 'A'.repeat(101) + 'a1!';
            const result = loginScheme.safeParse({ ...validData, password: longPassword });
            expect(result.success).toBe(false);
        });

        it('should fail if missing uppercase letter', () => {
            const result = loginScheme.safeParse({ ...validData, password: 'password123!' });
            expect(result.success).toBe(false);
        });

        it('should fail if missing lowercase letter', () => {
            const result = loginScheme.safeParse({ ...validData, password: 'PASSWORD123!' });
            expect(result.success).toBe(false);
        });

        it('should fail if missing number', () => {
            const result = loginScheme.safeParse({ ...validData, password: 'Password!!!' });
            expect(result.success).toBe(false);
        });

        it('should fail if missing symbol', () => {
            const result = loginScheme.safeParse({ ...validData, password: 'Password123' });
            expect(result.success).toBe(false);
        });
    });
});

