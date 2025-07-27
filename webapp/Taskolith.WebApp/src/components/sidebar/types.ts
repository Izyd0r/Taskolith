import { type ReactNode } from 'react'

export interface SidebarItemProps {
  label: string
  to?: string
  icon: ReactNode
  delay?: number
  isCollapsed?: boolean
  onClick?: () => void
}
