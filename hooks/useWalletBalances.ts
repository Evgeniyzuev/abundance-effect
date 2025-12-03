import { useSyncData } from './useSyncData';
import { getUserBalances } from '@/app/actions/finance';
import { STORAGE_KEYS } from '@/utils/storage';

interface WalletBalances {
    walletBalance: number;
    coreBalance: number;
    reinvestPercentage: number;
}

const defaultBalances: WalletBalances = {
    walletBalance: 0,
    coreBalance: 0,
    reinvestPercentage: 100
};

export function useWalletBalances(userId: string | null) {
    // Only initialize useSyncData when userId is available
    const syncResult = userId ? useSyncData<WalletBalances>({
        key: STORAGE_KEYS.WALLET_BALANCES,
        fetcher: async () => {
            const result = await getUserBalances(userId);
            if (result.success && result.data) {
                return {
                    success: true,
                    data: {
                        walletBalance: result.data.walletBalance,
                        coreBalance: result.data.coreBalance,
                        reinvestPercentage: result.data.reinvest
                    }
                };
            }
            return { success: false, error: result.error };
        },
        initialValue: defaultBalances,
        skipCache: true
    }) : null;

    // Extract data from sync result or use defaults
    const data = syncResult?.data || defaultBalances;
    const setData = syncResult?.setData || (() => {});
    const refresh = syncResult?.refresh || (() => Promise.resolve());

    return {
        walletBalance: data.walletBalance,
        coreBalance: data.coreBalance,
        reinvestPercentage: data.reinvestPercentage,
        setBalances: setData,
        refreshBalances: refresh
    };
}
