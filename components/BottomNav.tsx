'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Target, CheckCircle2, Sparkles, Wallet, Users } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { TranslationKey } from '@/utils/translations';

export default function BottomNav() {
    const pathname = usePathname();
    const { t } = useLanguage();

    const tabs: { name: string; href: string; icon: any; labelKey: TranslationKey }[] = [
        { name: 'Goals', href: '/goals', icon: Target, labelKey: 'nav.goals' },
        { name: 'Challenges', href: '/challenges', icon: CheckCircle2, labelKey: 'nav.challenges' },
        { name: 'Ai', href: '/ai', icon: Sparkles, labelKey: 'nav.ai' },
        { name: 'Wallet', href: '/wallet', icon: Wallet, labelKey: 'nav.wallet' },
        { name: 'Social', href: '/social', icon: Users, labelKey: 'nav.social' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t border-gray-200 pb-safe">
            <div className="flex justify-around items-center h-16">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = pathname.startsWith(tab.href);

                    return (
                        <Link
                            key={tab.name}
                            href={tab.href}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-medium">{t(tab.labelKey)}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
