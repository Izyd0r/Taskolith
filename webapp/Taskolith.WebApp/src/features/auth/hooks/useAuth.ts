import { useMutation } from '@tanstack/react-query';
import * as authService from '@/features/auth/api/auth';

export const useLogin = () =>
    useMutation({
        mutationFn: authService.login,
    });

export const useSignup = () =>
    useMutation({
        mutationFn: authService.signup,
    });

