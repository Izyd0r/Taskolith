import React, { useState, useRef, useEffect, createContext, useContext, type ReactNode } from 'react'
import Portal from '@/components/ui/Portal'

interface Coords {
    top: number
    left: number
    width: number
}

interface MenuContextType {
    isOpen: boolean
    toggle: () => void
    close: () => void
    coords: Coords
    setCoords: (coords: Coords) => void
    buttonRef: React.RefObject<HTMLButtonElement | null>
}

const MenuContext = createContext<MenuContextType | null>(null)

const useMenu = () => {
    const context = useContext(MenuContext)
    if (!context) {
        throw new Error('useMenu must be used within a MenuProvider')
    }
    return context
}

const useOnClickOutside = (
    ref: React.RefObject<HTMLElement | null>,
    handler: (event: MouseEvent | TouchEvent) => void
) => {
    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            if (!ref.current || ref.current.contains(event.target as Node)) {
                return
            }
            handler(event)
        }
        document.addEventListener('mousedown', listener)
        document.addEventListener('touchstart', listener)
        return () => {
            document.removeEventListener('mousedown', listener)
            document.removeEventListener('touchstart', listener)
        }
    }, [ref, handler])
}

export const Menu: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [coords, setCoords] = useState<Coords>({ top: 0, left: 0, width: 0 })
    const menuRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)

    const toggle = () => setIsOpen(!isOpen)
    const close = () => setIsOpen(false)

    
    //useOnClickOutside(menuRef, close)

    const contextValue = { isOpen, toggle, close, coords, setCoords, buttonRef }

    return (
        <MenuContext.Provider value={contextValue}>
            <div ref={menuRef} className="relative inline-block text-left">
                {children}
            </div>
        </MenuContext.Provider>
    )
}

export const MenuButton: React.FC<{
    children: ReactNode
    className?: string
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}> = ({ children, className, onClick }) => {
    const { toggle, setCoords, buttonRef } = useMenu()

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (onClick) {
            onClick(event)
        }
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect()
            setCoords({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width
            })
        }
        toggle()
    }

    return (
        <button ref={buttonRef} type="button" onClick={handleClick} className={className}>
            {children}
        </button>
    )
}

export const MenuItems: React.FC<{ children: ReactNode, className?: string }> = ({ children, className }) => {
    const { isOpen, coords, close } = useMenu()
    const menuItemsRef = useRef<HTMLDivElement>(null)

    useOnClickOutside(menuItemsRef, close)

    if (!isOpen) return null

    return (
        <Portal>
            <div
                ref={menuItemsRef}
                className={className}
                style={{
                    position: 'absolute',
                    top: `${coords.top}px`,
                    left: `${coords.left}px`,
                    minWidth: `${coords.width}px`
                }}
            >
                {children}
            </div>
        </Portal>
    )
}

export const MenuItem: React.FC<{
    children: (props: { active: boolean }) => ReactNode
    onClick?: (event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => void
}> = ({ children, onClick }) => {
    const { close } = useMenu()
    const [active, setActive] = useState(false)

    const handleClick = (event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => {
        if (onClick) {
            onClick(event)
        }
        close()
    }

    return (
        <div
            role="button"
            tabIndex={0}
            onMouseEnter={() => setActive(true)}
            onMouseLeave={() => setActive(false)}
            onClick={handleClick}
            onKeyDown={(e) => e.key === 'Enter' && handleClick(e)}
            className="block w-full text-left"
        >
            {children({ active })}
        </div>
    )
}
