import { z } from 'zod'
import { loginScheme } from '../validators/loginSchema'
import { signupScheme } from '../validators/signupSchema'

export type LoginCredentials = z.infer<typeof loginScheme>
export type SignupCredentials = z.infer<typeof signupScheme>

export type LoginResponse = {
    userId: string
    username: string
}

export type SignupResponse = {
    userId: string
    username: string
    firstName: string
    lastName: string
    email: string
}

export type AuthUser = {
    userId: string
    username: string
}
