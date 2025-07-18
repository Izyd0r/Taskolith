import { SignupForm } from '@/features/auth/components/SignupForm';
import { AuthLayout } from '@/features/auth/layout/AuthLayout';

export default function SignupPage() {
    return (
        <AuthLayout>
            <SignupForm />
        </AuthLayout>
    );
}
