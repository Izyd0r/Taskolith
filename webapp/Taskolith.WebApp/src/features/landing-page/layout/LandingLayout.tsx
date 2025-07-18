import React from 'react';
import { Header } from '@/features/landing-page/components/Header';
import { Footer } from '@/features/landing-page/components/Footer';

export function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-second-font-color">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
