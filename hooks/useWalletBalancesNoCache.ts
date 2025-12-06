import { useState, useEffect, useCallback } from 'react';
import { getUserBalances } from '@/app/actions/finance';

interface WalletBalances {
    walletBalance: number;
    coreBalance: number;
    reinvestPercentage: number;
}

export function useWalletBalancesNoCache(userId: string | null) {
    const [data, setData] = useState<WalletBalances>({
        walletBalance: 0,
        coreBalance: 0,
        reinvestPercentage: 100
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBalances = useCallback(async () => {
        if (!userId) {
            setError('No user ID');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const result = await getUserBalances(userId);
            if (result.success && result.data) {
                setData({
                    walletBalance: result.data.walletBalance,
                    coreBalance: result.data.coreBalance,
                    reinvestPercentage: result.data.reinvest
                });
            } else {
                setError(result.error || 'Failed to fetch balances');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    const refreshBalances = useCallback(() => {
        fetchBalances();
    }, [fetchBalances]);

    const setBalances = useCallback((newBalances: WalletBalances) => {
        setData(newBalances);
    }, []);

    // Fetch balances when userId changes
    useEffect(() => {
        if (userId) {
            fetchBalances();
        } else {
            setData({
                walletBalance: 0,
                coreBalance: 0,
                reinvestPercentage: 100
            });
            setError(null);
        }
    }, [userId, fetchBalances]);

    return {
        walletBalance: data.walletBalance,
        coreBalance: data.coreBalance,
        reinvestPercentage: data.reinvestPercentage,
        loading,
        error,
        setBalances,
        refreshBalances
    };
}