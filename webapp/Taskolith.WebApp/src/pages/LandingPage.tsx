import { LandingLayout } from '@/layout/LandingLayout';
import { Features } from '@/components/Features';
import { TechStack } from '@/components/TechStack';
import { CTA } from '@/components/CTA';
import { Hero } from '@/components/Hero';

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
