'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Trophy, Rocket } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function ChallengesProjectsNav() {
    const pathname = usePathname();
    const { t } = useLanguage();

    const tabs = [
        {
            id: 'challenges',
            path: '/challenges',
            icon: Trophy,
            label: t('challenges.title') || 'Challenges'
        },
        {
            id: 'projects',
            path: '/projects',
            icon: Rocket,
            label: t('projects.title') || 'Projects'
        }
    ];

    return (
        <div className="fixed top-0 left-0 right-0 z-[30] bg-white/80 backdrop-blur-lg border-b border-gray-100 pt-safe">
            <div className="flex justify-around items-center h-12">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = pathname === tab.path;

                    return (
                        <Link
                            key={tab.id}
                            href={tab.path}
                            className={`flex items-center justify-center w-full h-full transition-colors border-b-2 ${isActive
                                    ? 'text-blue-500 border-blue-500'
                                    : 'text-gray-400 border-transparent hover:text-gray-600'
                                }`}
                            title={tab.label}
                        >
                            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
