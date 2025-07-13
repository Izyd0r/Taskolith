import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/Button';

const EyeIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const EyeOffIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
        <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
);

const InputField = ({ id, name, type = 'text', placeholder, toggle, ...props }) => {
    const inputClassName = `
        w-full px-4 py-3 bg-gray-200 text-second-font-color border border-gray-300 rounded-lg 
        focus:outline-none focus:ring-2 focus:ring-blue-500
        ${toggle ? 'pr-12' : ''} 
    `;

    return (
        <div className="relative">
            <label htmlFor={id} className="sr-only">{placeholder}</label>
            <input
                id={id}
                name={name}
                type={type}
                required
                className={inputClassName.trim()}
                placeholder={placeholder}
                {...props}
            />
            {toggle && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    {toggle}
                </div>
            )}
        </div>
    );
};

interface AuthFormProps {
    mode: 'login' | 'signup';
}

export function AuthForm({ mode }: AuthFormProps) {
    const isLogin = mode === 'login';
    const [showPassword, setShowPassword] = useState(false);

    const passwordToggle = (
        <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-500 hover:text-gray-700"
            aria-label={showPassword ? "Hide password" : "Show password"}
        >
            {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
        </button>
    );

    return (
        <div className="w-full max-w-md bg-gray-50 rounded-xl border border-gray-200 shadow-lg p-8">
            <div className="text-center mb-8">
                <h2 className="text-main-font-color text-3xl font-bold">
                    {isLogin ? 'Welcome Back' : 'Create an Account'}
                </h2>
                <p className="text-second-font-color mt-2">
                    {isLogin ? 'Log in to continue to Taskolith.' : 'Start managing your tasks today.'}
                </p>
            </div>

            <form className="space-y-6">
                {!isLogin && (
                    <>
                        <InputField id="username" name="username" placeholder="Username" autoComplete="off" />
                        <InputField id="firstname" name="firstname" placeholder="First name" autoComplete="given-name" />
                        <InputField id="lastname" name="lastname" placeholder="Last name" autoComplete="family-name" />
                    </>
                )}
                <InputField id="email" name="email" type="email" placeholder="Email address" autoComplete="email" />

                <InputField
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    toggle={passwordToggle}
                />

                {!isLogin && (
                    <InputField
                        id="confirm-password"
                        name="confirm-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Confirm Password"
                        autoComplete="new-password"
                        toggle={passwordToggle}
                    />
                )}

                <div>
                    <Button type="submit" className="w-full" size="lg">
                        {isLogin ? 'Log In' : 'Create Account'}
                    </Button>
                </div>
            </form>

            <div className="text-center mt-6">
                <Link to={isLogin ? '/signup' : '/login'} className="text-sm font-medium text-blue-600 hover:text-blue-700">
                    {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Log In'}
                </Link>
            </div>
        </div>
    );
}
