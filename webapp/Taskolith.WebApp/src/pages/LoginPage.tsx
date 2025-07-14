import { LoginForm } from '../components/LoginForm';
import { AuthLayout } from '../layout/AuthLayout';

export default function LoginPage() {
    return (
        <AuthLayout>
            <LoginForm />
        </AuthLayout>
    );
}
