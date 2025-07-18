const IconPlaceholder = ({ className = '' }) => (
    <div
        className={`w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center ${className}`}
    >
        <svg
            className="w-8 h-8 text-second-font-color"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            ></path>
        </svg>
    </div>
)

export function TechStack() {
    const technologies = [
        { name: 'C# ASP.NET Core', icon: <IconPlaceholder /> },
        { name: 'Entity Framework', icon: <IconPlaceholder /> },
        { name: 'PostgreSQL', icon: <IconPlaceholder /> },
        { name: 'TypeScript', icon: <IconPlaceholder /> },
        { name: 'React', icon: <IconPlaceholder /> },
        { name: 'Vite', icon: <IconPlaceholder /> },
        { name: 'Tailwind CSS', icon: <IconPlaceholder /> },
        { name: 'Docker', icon: <IconPlaceholder /> },
    ]

    return (
        <section className="bg-main-background py-12 md:py-20">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-main-font-color text-3xl font-bold leading-tight tracking-tight">
                        Project Tech Stack
                    </h2>
                    <p className="text-second-font-color text-lg mt-4">
                        Taskolith is built on a robust and modern tech stack, ensuring
                        performance, scalability, and maintainability. Here’s a look at the
                        key technologies that power our platform.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto mt-12 text-center">
                    {technologies.map((tech) => (
                        <div
                            key={tech.name}
                            className="flex flex-col items-center p-4 bg-gray-50 rounded-xl border border-gray-200 transition-all hover:shadow-lg hover:border-blue-300"
                        >
                            {tech.icon}
                            <h3 className="text-sm font-semibold text-second-font-color mt-4">
                                {tech.name}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
