import { describe, it, expect } from 'vitest';
import { CreateOrganisationScheme } from '@/features/dashboard/validators/CreateOrganisationScheme'

const validData = {
    name: "name"
};

describe('Create organisation scheme', () => {
    it('should validate successfully with correct data', () => {
        const result = CreateOrganisationScheme.safeParse(validData);
        expect(result.success).toBe(true);
    });

    describe('organisation name', () => {
        it('should fail if empty', () => {
            const result = CreateOrganisationScheme.safeParse({ ...validData, name: '' });
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.flatten().fieldErrors.name).toBeDefined();
            }
        });

        it('should fail if too long', () => {
            const result = CreateOrganisationScheme.safeParse({ ...validData, name: 'a'.repeat(101) });
            expect(result.success).toBe(false);
        });
    });
});
