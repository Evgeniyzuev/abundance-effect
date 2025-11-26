'use client';

import { useState, useEffect } from 'react';
import { Wallet, Atom } from 'lucide-react';
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
            {/* Icon Tabs */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
                <div className="flex justify-around items-center h-12">
                    <button
                        onClick={() => setActiveTab("wallet")}
                        className={`flex items-center justify-center w-full h-full transition-colors ${activeTab === "wallet" ? "text-purple-600" : "text-gray-400 hover:text-gray-600"
                            }`}
                    >
                        <Wallet size={24} strokeWidth={activeTab === "wallet" ? 2.5 : 2} />
                    </button>
                    <button
                        onClick={() => setActiveTab("core")}
                        className={`flex items-center justify-center w-full h-full transition-colors ${activeTab === "core" ? "text-purple-600" : "text-gray-400 hover:text-gray-600"
                            }`}
                    >
                        <Atom size={24} strokeWidth={activeTab === "core" ? 2.5 : 2} />
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto pt-12">
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
