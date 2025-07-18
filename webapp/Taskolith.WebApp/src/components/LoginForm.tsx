import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '@/hooks/useAuth';
import { InputField } from '@/components/ui/InputField';
import { Button } from '@/components/ui/Button';
import { loginScheme } from '@/validators/loginSchema';
import type { LoginCredentials } from '@/types/auth';

const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>;
const EyeOffIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></svg>;

export function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<LoginCredentials>({
        resolver: zodResolver(loginScheme),
    });

    const { mutate: login, isPending, isError } = useLogin();

    const onSubmit: SubmitHandler<LoginCredentials> = (data) => {
        login(data, {
            onSuccess: () => {
                navigate('/dashboard');
            },
        });
    };


    return (
        <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 shadow-lg p-8">
            <div className="text-center mb-8">
                <h2 className="text-gray-900 text-3xl font-bold">Welcome Back</h2>
                <p className="text-gray-600 mt-2">Log in to continue to your account.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <div>
                    <InputField id="username" type="username" placeholder="Username" {...register("username")} />
                    {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
                </div>
                <div>
                    <InputField
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        toggle={<button id="eye-icon" type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}</button>}
                        {...register("password")}
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>
                {isError && (<p className="text-red-500 text-xs text-center">Authentication failed. Please check credentials.</p>)}

                <div className="pt-2">
                    <Button type="submit" className="w-full" size="lg" disabled={isPending}>
                        {isPending ? 'Processing...' : 'Log In'}
                    </Button>
                </div>
            </form>

            <div className="text-center mt-6">
                <Link to="/signup" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                    Don't have an account? Sign Up
                </Link>
            </div>
        </div>
    );
}
