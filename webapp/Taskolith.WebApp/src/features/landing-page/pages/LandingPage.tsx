import { LandingLayout } from '@/features/landing-page/layout/LandingLayout';
import { Features } from '@/features/landing-page/components/Features';
import { TechStack } from '@/features/landing-page/components/TechStack';
import { CTA } from '@/features/landing-page/components/CTA';
import { Hero } from '@/features/landing-page/components/Hero';

export default function LandingPage() {
    return (
        <LandingLayout>
            <main className="flex-1">
                <Hero />
                <Features />
                <TechStack />
                <CTA />
            </main>
        </LandingLayout>
    );
}
