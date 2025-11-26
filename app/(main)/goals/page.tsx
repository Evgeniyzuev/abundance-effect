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
    const [resultsMenuOpen, setResultsMenuOpen] = useState(true);

    const handleTabChange = (tab: Tab) => {
        if (tab === 'results' && activeTab === 'results') {
            setResultsMenuOpen(!resultsMenuOpen);
        } else {
            setActiveTab(tab);
            if (tab === 'results') {
                setResultsMenuOpen(true);
            }
        }
    };

    return (
        <div className="-m-4 h-screen flex flex-col bg-gray-50 overflow-hidden">
            <TopNav activeTab={activeTab} onTabChange={handleTabChange} />

            <div className="flex-1 pt-14 overflow-hidden relative flex flex-col">
                <div className="flex-1 w-full overflow-y-auto overflow-x-hidden">
                    {activeTab === 'wishboard' && <Wishboard />}
                    {activeTab === 'notes' && <Notes />}
                    {activeTab === 'tasks' && <Tasks />}
                    {activeTab === 'roadmap' && <Roadmap />}
                    {activeTab === 'results' && <Results menuOpen={resultsMenuOpen} />}
                </div>
            </div>
        </div>
    );
}
