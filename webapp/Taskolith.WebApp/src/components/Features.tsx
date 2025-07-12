import {
    UsersIcon,
    ClipboardListIcon,
    FeatherIcon,
    ZapIcon,
    CalendarCheckIcon,
    MessageSquareIcon,
} from 'lucide-react'

export function Features() {
    const mvpFeatures = [
        {
            icon: <FeatherIcon size={32} className="text-blue-500" />,
            title: 'Simple Interface',
            description: 'No fluff. Just focus and flow.',
        },
        {
            icon: <ZapIcon size={32} className="text-blue-500" />,
            title: 'Stone Age Speed',
            description: 'So fast, it’s prehistoric.',
        },
        {
            icon: <UsersIcon size={32} className="text-blue-500" />,
            title: 'Team Collaboration',
            description: 'Gather your tribe. Share tasks and work together like never before.',
        },
        {
            icon: <ClipboardListIcon size={32} className="text-blue-500" />,
            title: 'Organization Management',
            description: 'Create projects and assign tasks with prehistoric simplicity.',
        },
        {
            icon: <CalendarCheckIcon size={32} className="text-blue-500" />,
            title: 'Deadline Tracking',
            description: 'Never miss an important date. Set and track due dates with ease.',
        },
        {
            icon: <MessageSquareIcon size={32} className="text-blue-500" />,
            title: 'Focused Communication',
            description: 'Discuss specifics directly on tasks, keeping conversations in context.',
        },
    ]

    return (
        <section id="features" className="bg-second-background text-main-font-color py-20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4">
                        Empower Your Workflow with Taskolith
                    </h2>
                    <p className="text-xl text-second-font-color max-w-3xl mx-auto">
                        Simple yet powerful features carved in digital stone, making project management accessible to everyone.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {mvpFeatures.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-main-background p-6 rounded-lg shadow-md border border-gray-700 relative transform hover:-translate-y-1 transition-transform text-center"
                        >
                            <div className="mb-4 inline-block">{feature.icon}</div>
                            <h3 className="text-xl font-bold mb-2 text-main-font-color">
                                {feature.title}
                            </h3>
                            <p className="text-second-font-color">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
