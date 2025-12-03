import { useSyncData } from './useSyncData';
import { getUserBalances } from '@/app/actions/finance';
import { STORAGE_KEYS } from '@/utils/storage';

interface WalletBalances {
    walletBalance: number;
    coreBalance: number;
    reinvestPercentage: number;
}

export function useWalletBalances(userId: string | null) {
    const { data, setData, refresh } = useSyncData<WalletBalances>({
        key: STORAGE_KEYS.WALLET_BALANCES,
        fetcher: async () => {
            if (!userId) {
                return { success: false, error: 'No user ID' };
            }

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
        initialValue: {
            walletBalance: 0,
            coreBalance: 0,
            reinvestPercentage: 100
        }
    });

    return {
        walletBalance: data.walletBalance,
        coreBalance: data.coreBalance,
        reinvestPercentage: data.reinvestPercentage,
        setBalances: setData,
        refreshBalances: refresh
    };
}
