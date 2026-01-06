import BottomNav from '@/components/BottomNav';
import TabTracker from '@/components/challenges/TabTracker';

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col bg-ios-background">
            <TabTracker />
            <main className="flex-1 p-0 overflow-hidden">
                {children}
            </main>
            <BottomNav />
        </div>
    );
}

