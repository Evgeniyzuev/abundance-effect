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
                        className={`flex items-center justify-center w-full h-full transition-all duration-500 ${activeTab === "core" ? "text-blue-600" : "text-blue-400/60 hover:text-blue-500"
                            }`}
                    >
                        <motion.div
                            animate={{
                                rotate: 360,
                                scale: activeTab === "core" ? [1, 1.15, 1] : [1, 1.05, 1],
                                opacity: activeTab === "core" ? 1 : 0.8,
                                filter: activeTab === "core" ? [
                                    "drop-shadow(0 0 2px rgba(59, 130, 246, 0.4))",
                                    "drop-shadow(0 0 10px rgba(59, 130, 246, 0.8))",
                                    "drop-shadow(0 0 2px rgba(59, 130, 246, 0.4))"
                                ] : "drop-shadow(0 0 4px rgba(59, 130, 246, 0.15))"
                            }}
                            transition={{
                                rotate: { duration: activeTab === "core" ? 8 : 20, repeat: Infinity, ease: "linear" },
                                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                                filter: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                                opacity: { duration: 0.5 }
                            }}
                            className="flex items-center justify-center"
                        >
                            <Atom
                                size={24}
                                strokeWidth={activeTab === "core" ? 2.5 : 2}
                                className="text-blue-500"
                            />
                        </motion.div>
                    </button>
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
