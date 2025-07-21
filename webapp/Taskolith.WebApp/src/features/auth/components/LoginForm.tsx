import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { InputField } from '@/components/ui/InputField';
import { Button } from '@/components/ui/Button';
import { useLogin } from '@/features/auth/hooks/useAuth';
import { type LoginCredentials } from '@/features/auth/types/auth';
import { loginScheme } from '@/features/auth/validators/loginSchema';

export function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<LoginCredentials>({
        resolver: zodResolver(loginScheme),
    });

    const { mutate: login, isPending, isError, error } = useLogin();

    const onSubmit: SubmitHandler<LoginCredentials> = (data) => {
        login(data, {
            onSuccess: () => {
                navigate('/dashboard');
            },
        });
    };

    const getErrorMessage = () => {
        if (error && !(error as any).response) {
            return 'Could not connect to the server. Please try again later.';
        }
        return 'Authentication failed. Please check your credentials.';
    };


    return (
        <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 shadow-lg p-8">
            <div className="text-center mb-8">
                <h2 className="text-gray-900 text-3xl font-bold">Welcome Back</h2>
                <p className="text-gray-600 mt-2">Log in to continue to your account.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <div>
                    <InputField id="username" type="text" placeholder="Username" {...register("username")} />
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

                {isError && (
                    <p className="text-red-500 text-xs text-center">
                        {getErrorMessage()}
                    </p>
                )}

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
