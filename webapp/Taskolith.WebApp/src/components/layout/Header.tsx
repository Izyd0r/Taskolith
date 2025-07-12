import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Menu, X } from 'lucide-react';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <a href="/" className="text-2xl font-bold tracking-widest text-gray-900">
                    Taskolith
                </a>

                <nav className="hidden items-center space-x-2 md:flex">
                    <Button variant="outline" className="text-main-font-color">
                        <a href="/login">Login</a>
                    </Button>
                    <Button>
                        <a href="/signup">Get Started</a>
                    </Button>
                </nav>

                <div className="md:hidden">
                    <Button variant="default" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X className="text-third-font-color" size={24} /> : <Menu className="text-third-font-color" size={24} />}
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-lg border-t border-gray-200">
                    <nav className="flex flex-col space-y-4 p-4">
                        <a href="/login" className="text-lg text-second-font-color hover:text-blue-600">Login</a>
                        <a href="/signup" className="text-lg text-second-font-color hover:text-blue-600">Sign Up</a>
                    </nav>
                </div>
            )}
        </header>
    );
}
