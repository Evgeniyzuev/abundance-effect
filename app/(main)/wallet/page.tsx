'use client';

import { useUser } from '@/context/UserContext';

export default function WalletPage() {
    const { user } = useUser();

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-ios-primary">Wallet</h1>

            <div className="ios-card p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <p className="text-blue-100 text-sm font-medium mb-1">Total Balance</p>
                <h2 className="text-3xl font-bold">${user?.wallet_balance || '0.00'}</h2>
            </div>

            <div className="ios-card p-6">
                <p className="text-ios-secondary text-sm font-medium mb-1">AI Core Balance</p>
                <h2 className="text-2xl font-bold text-ios-primary">{user?.aicore_balance || '0.0000'}</h2>
            </div>
        </div>
    );
}
