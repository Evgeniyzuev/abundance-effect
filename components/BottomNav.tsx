'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Target, CheckCircle2, Sparkles, Wallet, Users } from 'lucide-react';

export default function BottomNav() {
    const pathname = usePathname();

    const tabs: { href: string; icon: any; }[] = [
        { href: '/goals', icon: Target },
        { href: '/challenges', icon: CheckCircle2 },
        { href: '/ai', icon: Sparkles },
        { href: '/wallet', icon: Wallet },
        { href: '/social', icon: Users },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t border-gray-200 pb-safe">
            <div className="flex justify-around items-center h-14">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = pathname.startsWith(tab.href);

                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={`flex items-center justify-center w-full h-full transition-colors ${isActive ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            <Icon size={32} strokeWidth={isActive ? 2.5 : 2} />
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
