import { SignupForm } from '@/components/SignupForm';
import { AuthLayout } from '@/layout/AuthLayout';

export default function SignupPage() {
    return (
        <AuthLayout>
            <SignupForm />
        </AuthLayout>
    );
}
