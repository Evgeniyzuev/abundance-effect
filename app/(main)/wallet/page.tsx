'use client';

import { useState, useEffect } from 'react';
import { Wallet, Atom } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { useWalletBalancesNoCache } from '@/hooks/useWalletBalancesNoCache';
import WalletTab from '@/components/wallet/WalletTab';
import CoreTab from '@/components/wallet/CoreTab';
import TopUpModal from '@/components/wallet/TopUpModal';
import TransferModal from '@/components/wallet/TransferModal';
import SendTonModal from '@/components/wallet/SendTonModal';
import WithdrawModal from '@/components/wallet/WithdrawModal';

export default function WalletPage() {
    const { user, refreshUser } = useUser();
    const { walletBalance, coreBalance, reinvestPercentage, loading, error, refreshBalances } = useWalletBalancesNoCache(user?.id || null);
    const [activeTab, setActiveTab] = useState<"wallet" | "core">("wallet");
    const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [isSendModalOpen, setIsSendModalOpen] = useState(false);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

    const handleTopUpSuccess = async (newBalance: number) => {
        await refreshBalances();
        await refreshUser();
    };

    const handleTransferSuccess = async (newWalletBalance: number, newCoreBalance: number) => {
        await refreshBalances();
        await refreshUser();
    };

    const handleReinvestUpdate = async (newPercentage: number) => {
        await refreshBalances();
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Icon Tabs */}
            <div className="fixed top-0 left-0 right-0 z-[30] bg-white border-b border-gray-100 pt-safe">
                <div className="flex justify-center items-center h-14 pb-2">
                    <div className="bg-gray-100 p-1 rounded-xl flex space-x-1 w-48 relative">
                        {/* Sliding Background (Optional, but simple active class is easier) */}
                        <button
                            onClick={() => setActiveTab("wallet")}
                            className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === "wallet" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-900"
                                }`}
                        >
                            Wallet
                        </button>
                        <button
                            onClick={() => setActiveTab("core")}
                            className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === "core" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-900"
                                }`}
                        >
                            Core
                        </button>
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto pt-safe pb-20">
                <div className="pt-12">

                    {activeTab === "wallet" ? (
                        <WalletTab
                            walletBalance={walletBalance}
                            onTopUp={() => setIsTopUpModalOpen(true)}
                            onTransfer={() => setIsTransferModalOpen(true)}
                            onSend={() => setIsSendModalOpen(true)}
                            onWithdraw={() => setIsWithdrawModalOpen(true)}
                            userId={user?.id || null}
                            loading={loading}
                            error={error}
                        />
                    ) : (
                        <CoreTab
                            coreBalance={coreBalance}
                            reinvestPercentage={reinvestPercentage}
                            userId={user?.id || null}
                            onTransfer={() => setIsTransferModalOpen(true)}
                            onReinvestUpdate={handleReinvestUpdate}
                            loading={loading}
                            error={error}
                        />
                    )}
                </div>
            </div>

            {/* Modals */}
            {user?.id && (
                <>
                    <TopUpModal
                        isOpen={isTopUpModalOpen}
                        onClose={() => setIsTopUpModalOpen(false)}
                        onSuccess={handleTopUpSuccess}
                        userId={user.id}
                    />

                    <TransferModal
                        isOpen={isTransferModalOpen}
                        onClose={() => setIsTransferModalOpen(false)}
                        currentWalletBalance={walletBalance}
                        onSuccess={handleTransferSuccess}
                        userId={user.id}
                    />

                    <SendTonModal
                        isOpen={isSendModalOpen}
                        onClose={() => setIsSendModalOpen(false)}
                        onSuccess={handleTopUpSuccess}
                        userId={user.id}
                        currentBalance={walletBalance}
                    />

                    <WithdrawModal
                        isOpen={isWithdrawModalOpen}
                        onClose={() => setIsWithdrawModalOpen(false)}
                        onSuccess={handleTopUpSuccess}
                        userId={user.id}
                        currentBalance={walletBalance}
                    />
                </>
            )}
        </div>
    );

}
