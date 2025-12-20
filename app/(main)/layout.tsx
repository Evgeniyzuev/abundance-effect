import BottomNav from '@/components/BottomNav';
import NotificationBell from '@/components/NotificationBell';
import Image from 'next/image';
import Link from 'next/link';

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col bg-ios-background">
            {/* Common Header */}
            <header className="fixed top-0 left-0 right-0 z-[40] bg-white/80 backdrop-blur-lg border-b border-gray-100 px-4 pt-safe">
                <div className="flex items-center justify-between h-12">
                    <Link href="/" className="flex items-center gap-2">
                        <Image src="/icon-192.png" alt="Logo" width={28} height={28} className="rounded-lg shadow-sm" />
                        <span className="font-bold text-gray-900 tracking-tight">Abundance</span>
                    </Link>
                    <NotificationBell />
                </div>
            </header>

            <main className="flex-1 p-0 overflow-hidden pt-12">
                {children}
            </main>
            <BottomNav />
        </div>
    );
}
