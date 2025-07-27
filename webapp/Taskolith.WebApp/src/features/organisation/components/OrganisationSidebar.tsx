import {
    Home,
    FolderKanban,
    Users,
    CalendarClock,
    ShieldCheck,
    Mail,
    Settings,
} from 'lucide-react'
import SidebarLayout from '@/components/sidebar/SidebarLayout'
import SidebarItem from '@/components/sidebar/SidebarItem'

const OrganisationSidebar = () => {
    return (
        <SidebarLayout
            bottomItem={
                <SidebarItem label="Go Back" to="/dashboard" icon={<Home size={24} />} delay={400} />
            }
        >
            <SidebarItem label="Projects" to="projects" icon={<FolderKanban size={24} />} delay={150} />
            <SidebarItem label="Members" to="members" icon={<Users size={24} />} delay={200} />
            <SidebarItem label="Schedule" to="schedule" icon={<CalendarClock size={24} />} delay={250} />
            <SidebarItem label="Roles" to="roles" icon={<ShieldCheck size={24} />} delay={300} />
            <SidebarItem label="Invites" to="invites" icon={<Mail size={24} />} delay={350} />
            <SidebarItem label="Edit Org" to="settings" icon={<Settings size={24} />} delay={400} />
        </SidebarLayout>
    );
};

export default OrganisationSidebar
