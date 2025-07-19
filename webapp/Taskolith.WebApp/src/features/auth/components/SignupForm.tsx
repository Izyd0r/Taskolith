import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSignup } from '@/features/auth/hooks/useAuth';
import { InputField } from '@/components/ui/InputField';
import { Button } from '@/components/ui/Button';
import { signupScheme } from '@/features/auth/validators/signupSchema';
import type { SignupCredentials } from '@/features/auth/types/auth';

const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>;
const EyeOffIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></svg>;

export function SignupForm() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<SignupCredentials>({
        resolver: zodResolver(signupScheme),
    });

    const { mutate: signup, isPending, isError } = useSignup();

    const onSubmit: SubmitHandler<SignupCredentials> = (data) => {
        signup(data, {
            onSuccess: () => {
                navigate('/dashboard');
            },
        });
    };

    return (
        <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 shadow-lg p-8">
            <div className="text-center mb-8">
                <h2 className="text-gray-900 text-3xl font-bold">Create an Account</h2>
                <p className="text-gray-600 mt-2">Start your journey with us today.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <div>
                    <InputField id="username" placeholder="Username" {...register("username")} />
                    {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
                </div>
                <div>
                    <InputField id="firstname" placeholder="First name" {...register("firstname")} />
                    {errors.firstname && <p className="text-red-500 text-xs mt-1">{errors.firstname.message}</p>}
                </div>
                <div>
                    <InputField id="lastname" placeholder="Last name" {...register("lastname")} />
                    {errors.lastname && <p className="text-red-500 text-xs mt-1">{errors.lastname.message}</p>}
                </div>
                <div>
                    <InputField id="email" type="email" placeholder="Email address" {...register("email")} />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                    <InputField id="password" type={showPassword ? 'text' : 'password'} placeholder="Password" toggle={<button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}</button>} {...register("password")} />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>
                <div>
                    <InputField id="confirmPassword" type={showPassword ? 'text' : 'password'} placeholder="Confirm Password" {...register("confirmPassword")} />
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                </div>
                {isError && (<p className="text-red-500 text-xs text-center">An error occurred during sign up. Please try again.</p>)}

                <div className="pt-2">
                    <Button type="submit" className="w-full" size="lg" disabled={isPending}>
                        {isPending ? 'Processing...' : 'Create Account'}
                    </Button>
                </div>
            </form>

            <div className="text-center mt-6">
                <Link to="/login" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                    Already have an account? Log In
                </Link>
            </div>
        </div>
    );
}
