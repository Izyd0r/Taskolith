import { Github, Linkedin } from 'lucide-react';

const SocialLink = ({ href, icon: Icon, 'aria-label': ariaLabel }) => (
    <a href={href} aria-label={ariaLabel} className="text-gray-500 hover:text-gray-900">
        <Icon size={20} />
    </a>
)

export function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 text-second-font-color">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div className="md:col-span-1">
                        <h2 className="text-2xl font-bold tracking-widest text-main-font-color mb-2">Taskolith</h2>
                        <p className="text-sm">Get Stuff Done, Stone Age Style.</p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
                        <ul className="space-y-2">
                            <li><a href="#features" className="hover:text-blue-600">Features</a></li>
                            <li><a href="/pricing" className="hover:text-blue-600">Pricing</a></li>
                            <li><a href="/changelog" className="hover:text-blue-600">Changelog</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
                        <ul className="space-y-2">
                            <li><a href="/about" className="hover:text-blue-600">About Us</a></li>
                            <li><a href="/contact" className="hover:text-blue-600">Contact</a></li>
                            <li><a href="/careers" className="hover:text-blue-600">Careers</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
                        <ul className="space-y-2">
                            <li><a href="/privacy" className="hover:text-blue-600">Privacy Policy</a></li>
                            <li><a href="/terms" className="hover:text-blue-600">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-sm">
                    <p className="text-gray-500">© {new Date().getFullYear()} Taskolith. All Rights Reserved.</p>

                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <SocialLink href="#" icon={Github} aria-label="GitHub" />
                        <SocialLink href="#" icon={Linkedin} aria-label="LinkedIn" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
