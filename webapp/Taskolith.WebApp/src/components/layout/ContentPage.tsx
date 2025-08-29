import React, { useState, useRef, useEffect, useCallback } from 'react'

type ContentPageProps = {
    title: string
    topContent?: React.ReactNode
    children: React.ReactNode
}

export function ContentPage({ title, topContent, children }: ContentPageProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [showTopFade, setShowTopFade] = useState(false)
    const [showBottomFade, setShowBottomFade] = useState(false)

    const handleScroll = useCallback(() => {
        const el = scrollContainerRef.current
        if (el) {
            const hasScrolled = el.scrollTop > 0
            const isAtBottom = el.scrollHeight - el.scrollTop === el.clientHeight

            setShowTopFade(hasScrolled)
            setShowBottomFade(!isAtBottom)
        }
    }, [])

    useEffect(() => {
        const el = scrollContainerRef.current
        if (el) {
            const isScrollable = el.scrollHeight > el.clientHeight
            setShowBottomFade(isScrollable)

            el.addEventListener('scroll', handleScroll)

            return () => el.removeEventListener('scroll', handleScroll)
        }
    }, [children, handleScroll])

    return (
        <div className="p-6 h-full flex flex-col bg-gray-50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 flex-shrink-0 gap-4">
                <h1 className="text-2xl font-bold flex-shrink-0">{title}</h1>
                {topContent}
            </div>
            <div className="flex-grow min-h-0 relative">

                <div
                    className={`absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-gray-50 to-transparent transition-opacity duration-300 pointer-events-none ${showTopFade ? 'opacity-100' : 'opacity-0'
                        }`}
                />

                <div
                    ref={scrollContainerRef}
                    className="h-full overflow-y-auto"
                >
                    <div className="pr-2">
                        {children}
                    </div>
                </div>

                <div
                    className={`absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-50 to-transparent transition-opacity duration-300 pointer-events-none ${showBottomFade ? 'opacity-100' : 'opacity-0'
                        }`}
                />

            </div>
        </div>
    )
}
