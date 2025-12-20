'use client';

import { Heart, FileText, CheckSquare, Map, TrendingUp } from 'lucide-react';

type Tab = 'wishboard' | 'notes' | 'tasks' | 'roadmap' | 'results';

interface TopNavProps {
    activeTab: Tab;
    onTabChange: (tab: Tab) => void;
}

export default function TopNav({ activeTab, onTabChange }: TopNavProps) {
    const tabs: { id: Tab; icon: any }[] = [
        { id: 'wishboard', icon: Heart },
        { id: 'notes', icon: FileText },
        { id: 'tasks', icon: CheckSquare },
        { id: 'roadmap', icon: Map },
        { id: 'results', icon: TrendingUp },
    ];

    return (
        <div className="fixed top-12 left-0 right-0 z-[30] bg-white/80 backdrop-blur-lg border-b border-gray-100">
            <div className="flex justify-around items-center h-12">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`flex items-center justify-center w-full h-full transition-colors ${isActive ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
