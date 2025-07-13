import { AuthForm } from '../components/AuthForm';
import { AuthLayout } from '../layout/AuthLayout';

export default function SignupPage() {
    return (
        <AuthLayout>
            <AuthForm mode="signup" />
        </AuthLayout>
    );
}
