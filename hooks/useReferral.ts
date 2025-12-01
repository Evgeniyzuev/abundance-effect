'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { storage, STORAGE_KEYS } from '@/utils/storage';

export function useReferral() {
    const searchParams = useSearchParams();
    const [referralCode, setReferralCode] = useState<string | null>(null);

    useEffect(() => {
        // 1. Check Telegram WebApp start_param
        let code = null;

        if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.initDataUnsafe?.start_param) {
            code = (window as any).Telegram.WebApp.initDataUnsafe.start_param;
        }

        // 2. Check URL search param 'ref'
        if (!code) {
            code = searchParams.get('ref');
        }

        // 3. Save to storage if found
        if (code) {
            storage.set(STORAGE_KEYS.REFERRAL_CODE, code);
            setReferralCode(code);
        } else {
            // 4. Retrieve from storage if not in current URL/param
            const stored = storage.get<string>(STORAGE_KEYS.REFERRAL_CODE);
            if (stored) {
                setReferralCode(stored);
            }
        }
    }, [searchParams]);

    return referralCode;
}
