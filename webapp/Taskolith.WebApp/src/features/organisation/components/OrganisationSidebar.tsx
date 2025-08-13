import {
    Home,
    FolderKanban,
    Users,
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
            <SidebarItem label="Roles" to="roles" icon={<ShieldCheck size={24} />} delay={300} />
            <SidebarItem label="Pending Invites" to="invites" icon={<Mail size={24} />} delay={350} />
            <SidebarItem label="Organisation Settings" to="settings" icon={<Settings size={24} />} delay={400} />
        </SidebarLayout>
    );
};

export default OrganisationSidebar
