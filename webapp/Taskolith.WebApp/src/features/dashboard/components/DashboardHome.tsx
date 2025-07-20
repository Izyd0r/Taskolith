import React from 'react';

const DashboardHome: React.FC = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">My Projects</h2>
            {/* My Projects list goes here */}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">My Organizations</h2>
            {/* My Organizations list goes here */}
        </div>
    </div>
);

export default DashboardHome;
