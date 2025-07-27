import {
    LayoutDashboard,
    CheckSquare,
    Building,
    Mail,
    LogOut
} from 'lucide-react'
import SidebarLayout from '@/components/sidebar/SidebarLayout'
import SidebarItem from '@/components/sidebar/SidebarItem'
import { useLogout } from '@/features/auth/hooks/useLogout'

const DashboardSidebar = () => {
    const { mutate: logout } = useLogout()
    return (
        <SidebarLayout
            bottomItem={
                <SidebarItem label="Logout" icon={<LogOut size={24} />} onClick={() => logout()} delay={400} />
            }
        >
            <SidebarItem label="Dashboard" to="/dashboard" icon={<LayoutDashboard size={24} />} delay={100} />
            <SidebarItem label="My Tasks" to="/dashboard/tasks" icon={<CheckSquare size={24} />} delay={150} />
            <SidebarItem label="Create Org" to="/dashboard/create-organisation" icon={<Building size={24} />} delay={200} />
            <SidebarItem label="My Invites" to="/dashboard/invites" icon={<Mail size={24} />} delay={250} />
        </SidebarLayout>
    );
};

export default DashboardSidebar
