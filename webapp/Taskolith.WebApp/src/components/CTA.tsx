import { Button } from '@/components/ui/Button';

export function CTA() {
    return (
        <section className="w-full py-16 md:py-24 bg-second-background">
            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto bg-gray-800 rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-2xl border border-gray-700">

                    <div className="absolute top-0 left-0 w-full h-full bg-[url('/path-to-stone-texture.png')] opacity-5"></div>
                    <div className="absolute -top-1 -right-1 w-16 h-16 border-t-2 border-r-2 border-gray-600 rounded-tr-2xl opacity-50"></div>
                    <div className="absolute -bottom-1 -left-1 w-16 h-16 border-b-2 border-l-2 border-gray-600 rounded-bl-2xl opacity-50"></div>

                    <div className="relative text-center z-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-third-font-color mb-4">
                            Stop Chiseling, Start Building.
                        </h2>
                        <p className="text-xl text-third-font-color mb-8 max-w-2xl mx-auto">
                            Your workflow is evolving. Your tools should too. Leave the stone age of disorganization behind and join the future of project management.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                            <Button
                                size="lg"
                                variant="default"
                                className="w-full sm:w-auto"
                            >
                                Get Started—It's Free
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
