'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import WalletTab from '@/components/wallet/WalletTab';
import CoreTab from '@/components/wallet/CoreTab';
import TopUpModal from '@/components/wallet/TopUpModal';
import TransferModal from '@/components/wallet/TransferModal';

export default function WalletPage() {
    const { user, refreshUser } = useUser();
    const [activeTab, setActiveTab] = useState<"wallet" | "core">("wallet");
    const [walletBalance, setWalletBalance] = useState(0);
    const [coreBalance, setCoreBalance] = useState(0);
    const [reinvestPercentage, setReinvestPercentage] = useState(100);
    const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

    // Update local state when user changes
    useEffect(() => {
        if (user) {
            setWalletBalance(user.wallet_balance || 0);
            setCoreBalance(user.aicore_balance || 0);
            setReinvestPercentage(user.reinvest_setup || 100);
        }
    }, [user]);

    const handleTopUpSuccess = async (newBalance: number) => {
        setWalletBalance(newBalance);
        await refreshUser();
    };

    const handleTransferSuccess = async (newWalletBalance: number, newCoreBalance: number) => {
        setWalletBalance(newWalletBalance);
        setCoreBalance(newCoreBalance);
        await refreshUser();
    };

    const handleReinvestUpdate = (newPercentage: number) => {
        setReinvestPercentage(newPercentage);
    };

    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* Tabs */}
            <div className="flex bg-white border-b border-gray-100 sticky top-0 z-10">
                <button
                    className={`flex-1 py-3 text-center font-semibold text-base relative ${activeTab === "wallet" ? "text-purple-600 border-b-2 border-purple-600" : "text-gray-500"
                        }`}
                    onClick={() => setActiveTab("wallet")}
                >
                    Wallet
                </button>
                <button
                    className={`flex-1 py-3 text-center font-semibold text-base relative ${activeTab === "core" ? "text-purple-600 border-b-2 border-purple-600" : "text-gray-500"
                        }`}
                    onClick={() => setActiveTab("core")}
                >
                    Core
                </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto">
                {activeTab === "wallet" ? (
                    <WalletTab
                        walletBalance={walletBalance}
                        onTopUp={() => setIsTopUpModalOpen(true)}
                        onTransfer={() => setIsTransferModalOpen(true)}
                        onSend={() => {/* TODO: Implement send modal */ }}
                        userId={user?.id || null}
                    />
                ) : (
                    <CoreTab
                        coreBalance={coreBalance}
                        reinvestPercentage={reinvestPercentage}
                        userId={user?.id || null}
                        onTransfer={() => setIsTransferModalOpen(true)}
                        onReinvestUpdate={handleReinvestUpdate}
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
                </>
            )}
        </div>
    );
}
