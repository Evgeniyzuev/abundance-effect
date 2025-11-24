'use client';

import { useState } from 'react';
import TopNav from '@/components/TopNav';
import Wishboard from '@/components/goals/Wishboard';
import Notes from '@/components/goals/Notes';

type Tab = 'wishboard' | 'notes' | 'tasks' | 'roadmap' | 'results';

export default function GoalsPage() {
    const [activeTab, setActiveTab] = useState<Tab>('wishboard');

    return (
        <div className="-m-4 min-h-screen bg-gray-50">
            <TopNav activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="pt-14">
                {activeTab === 'wishboard' && <Wishboard />}
                {activeTab === 'notes' && <Notes />}
                {activeTab === 'tasks' && <div className="p-4 text-center text-gray-500">Tasks coming soon</div>}
                {activeTab === 'roadmap' && <div className="p-4 text-center text-gray-500">Roadmap coming soon</div>}
                {activeTab === 'results' && <div className="p-4 text-center text-gray-500">Results coming soon</div>}
            </div>
        </div>
    );
}
