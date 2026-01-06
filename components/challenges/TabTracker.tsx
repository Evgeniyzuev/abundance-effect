'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { storage, STORAGE_KEYS } from '@/utils/storage';

const TRACKED_TABS = ['/goals', '/challenges', '/ai', '/wallet', '/social'];

export default function TabTracker() {
    const pathname = usePathname();

    useEffect(() => {
        // If challenge is already marked as complete in this browser, do nothing
        if (storage.get(STORAGE_KEYS.CHALLENGE_APP_TESTING_COMPLETE)) return;

        const currentTab = TRACKED_TABS.find(tab => pathname.startsWith(tab));
        if (currentTab) {
            const visited = storage.get<string[]>(STORAGE_KEYS.VISITED_TABS) || [];
            if (!visited.includes(currentTab)) {
                const newVisited = [...visited, currentTab];
                storage.set(STORAGE_KEYS.VISITED_TABS, newVisited);

                // If all 5 tabs visited, we can potentially stop tracking in future sessions
                if (newVisited.length >= TRACKED_TABS.length) {
                    // We don't mark as COMPLETE here yet because user needs to submit the form,
                    // but we have all 5, so we could stop.
                }
            }
        }
    }, [pathname]);

    return null; // This component has no UI
}
