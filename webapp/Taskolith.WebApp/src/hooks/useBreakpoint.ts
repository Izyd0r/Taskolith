import { useState, useEffect } from 'react'

const LG_BREAKPOINT = 1024

export const useBreakpoint = (breakpoint: number = LG_BREAKPOINT): boolean => {
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= breakpoint)

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= breakpoint)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [breakpoint])

    return isDesktop
};
