'use client';

import { useState } from 'react';
import TopNav from '@/components/TopNav';
import Wishboard from '@/components/goals/Wishboard';
import Notes from '@/components/goals/Notes';
import Tasks from '@/components/goals/Tasks';
import Roadmap from '@/components/goals/Roadmap';
import Results from '@/components/goals/Results';

type Tab = 'wishboard' | 'notes' | 'tasks' | 'roadmap' | 'results';

export default function GoalsPage() {
    const [activeTab, setActiveTab] = useState<Tab>('wishboard');

    return (
        <div className="-m-4 min-h-screen bg-gray-50">
            <TopNav activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="pt-14">
                {activeTab === 'wishboard' && <Wishboard />}
                {activeTab === 'notes' && <Notes />}
                {activeTab === 'tasks' && <Tasks />}
                {activeTab === 'roadmap' && <Roadmap />}
                {activeTab === 'results' && <Results />}
            </div>
        </div>
    );
}
