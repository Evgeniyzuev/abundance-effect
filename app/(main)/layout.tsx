import BottomNav from '@/components/BottomNav';

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col bg-ios-background pb-14">
            <main className="flex-1 p-3">
                {children}
            </main>
            <BottomNav />
        </div>
    );
}
