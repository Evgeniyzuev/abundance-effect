'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const REFERRAL_STORAGE_KEY = 'abundance_referral_code';

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
            localStorage.setItem(REFERRAL_STORAGE_KEY, code);
            setReferralCode(code);
        } else {
            // 4. Retrieve from storage if not in current URL/param
            const stored = localStorage.getItem(REFERRAL_STORAGE_KEY);
            if (stored) {
                setReferralCode(stored);
            }
        }
    }, [searchParams]);

    return referralCode;
}
