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
            <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 pt-safe">
                <div className="flex justify-around items-center h-12">
                    <button
                        onClick={() => setActiveTab("wallet")}
                        className={`flex items-center justify-center w-full h-full transition-all duration-300 ${activeTab === "wallet" ? "text-black" : "text-gray-300 hover:text-gray-500"
                            }`}
                    >
                        <Wallet size={24} strokeWidth={activeTab === "wallet" ? 2 : 1.5} />
                    </button>
                    <button
                        onClick={() => setActiveTab("core")}
                        className={`flex items-center justify-center w-full h-full transition-all duration-500 ${activeTab === "core" ? "text-blue-600" : "text-gray-300 hover:text-gray-500"
                            }`}
                    >
                        <motion.div
                            animate={activeTab === "core" ? {
                                rotate: 360,
                                scale: [1, 1.15, 1],
                                filter: [
                                    "drop-shadow(0 0 0px rgba(59, 130, 246, 0))",
                                    "drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))",
                                    "drop-shadow(0 0 0px rgba(59, 130, 246, 0))"
                                ]
                            } : { rotate: 0, scale: 1, filter: "none" }}
                            transition={activeTab === "core" ? {
                                rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                                filter: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                            } : { duration: 0.3 }}
                            className="flex items-center justify-center"
                        >
                            <Atom
                                size={24}
                                strokeWidth={activeTab === "core" ? 2.5 : 1.5}
                                className={activeTab === "core" ? "text-blue-500" : "text-inherit"}
                            />
                        </motion.div>
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto pt-14 pb-20">
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
