import {
    Home,
    Kanban,
    Users,
    Settings,
} from 'lucide-react'
import SidebarLayout from '@/components/sidebar/SidebarLayout'
import SidebarItem from '@/components/sidebar/SidebarItem'
import { useParams, useNavigate } from 'react-router-dom'

const ProjectSidebar = () => {
    const navigate = useNavigate()
    const { organisationId } = useParams<{ organisationId: string }>()
    return (
        <SidebarLayout
            bottomItem={
                <SidebarItem label="Go Back" icon={<Home size={24} />} onClick={() => navigate(`/organisations/${organisationId}`)} delay={400} />
            }
        >
            <SidebarItem label="Kanban" to="kanban" icon={<Kanban size={24} />} delay={150} />
            <SidebarItem label="Assigned Members" to="members" icon={<Users size={24} />} delay={200} />
            <SidebarItem label="Project Settings" to="settings" icon={<Settings size={24} />} delay={400} />
        </SidebarLayout>
    );
};

export default ProjectSidebar
