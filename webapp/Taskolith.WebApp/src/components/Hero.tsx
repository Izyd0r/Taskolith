import { Button } from '@/components/ui/Button'

export function Hero() {
    return (
        <section className="relative overflow-hidden bg-gray-900 py-24 text-white sm:py-32">
            <div
                className="absolute -top-40 left-1/2 -z-10 h-[40rem] w-[80rem] -translate-x-1/2 transform-gpu blur-3xl"
                aria-hidden="true"
            >
                <div
                    className="aspect-[1097/845] w-full bg-gradient-to-r from-[#2563eb] to-[#3b82f6] opacity-20"
                    style={{
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    }}
                />
            </div>

            <div className="container relative z-10 mx-auto px-4 text-center">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                        Evolve Your Workflow from{' '}
                        <span className="bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
                            Chaos to Clarity
                        </span>
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-gray-300">
                        Taskolith helps your tribe crush goals with stone-age speed and modern simplicity.
                        Stop hunting for tasks and start building monuments to your productivity.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Button size="lg">
                            <a href="/signup">Claim Your Workspace</a>
                        </Button>
                        <Button variant="ghost">
                            <a href="#features">Learn More →</a>
                        </Button>
                    </div>
                </div>
            </div>
        </section >
    );
}
