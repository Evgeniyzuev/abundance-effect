import BottomNav from '@/components/BottomNav';

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col bg-ios-background">
            <main className="flex-1 p-0 overflow-hidden">
                {children}
            </main>
            <BottomNav />
        </div>
    );
}

