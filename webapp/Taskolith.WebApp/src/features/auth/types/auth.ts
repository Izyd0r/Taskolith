import { z } from 'zod';
import { loginScheme } from '@/features/auth/validators/loginSchema';
import { signupScheme } from '@/features/auth/validators/signupSchema';

export type SignupCredentials = z.infer<typeof signupScheme>
export type LoginCredentials = z.infer<typeof loginScheme>

export type LoginResponse = {
    username: string
    token: string
}

export type SignupResponse = {
    userId: string
    username: string
    firstName: string
    lastName: string
    email: string
    token: string
    refreshToken: string
}
