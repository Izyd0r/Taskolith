import { z } from 'zod';
import { loginScheme } from '@/validators/loginSchema';
import { signupScheme } from '@/validators/signupSchema';

export type SignupCredentials = z.infer<typeof signupScheme>
export type LoginCredentials = z.infer<typeof loginScheme>
