"use client"

import { Plus, ArrowUp, ArrowDown, ArrowRightLeft, Send, Sparkles, Wallet, ScanLine, MoreHorizontal, ArrowLeftRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { useLanguage } from "@/context/LanguageContext"
import { TonConnectButton } from '@tonconnect/ui-react'
import WalletHistory from "./WalletHistory"
import WalletAssetRow from "./WalletAssetRow"

interface WalletTabProps {
    walletBalance: number
    onTopUp: () => void
    onTransfer: () => void
    onSend: () => void
    onWithdraw: () => void
    userId: string | null
    loading?: boolean
    error?: string | null
}

const MOCK_ASSETS = [
    { id: 'usdt', name: 'Dollars', symbol: 'USDT', price: 1.00, change: 0.01, balance: 153.17, color: '#22c55e' }, // Green
    { id: 'ton', name: 'Toncoin', symbol: 'TON', price: 2.15, change: 2.96, balance: 144.876, color: '#0098EA' }, // Blue
    { id: 'btc', name: 'Bitcoin', symbol: 'BTC', price: 96890.00, change: -1.23, balance: 0.01104, color: '#F7931A' }, // Orange
    { id: 'eth', name: 'Ethereum', symbol: 'ETH', price: 3500.00, change: 0.54, balance: 0.45, color: '#627EEA' }, // Purple-Blue
    { id: 'gold', name: 'Gold', symbol: 'XAU', price: 2045.50, change: 0.07, balance: 0.05, color: '#FFD700' }, // Gold
]

export default function WalletTab({ walletBalance, onTopUp, onTransfer, onSend, onWithdraw, userId, loading, error }: WalletTabProps) {
    const { t } = useLanguage()
    const [activeTab, setActiveTab] = useState<'crypto' | 'ton'>('crypto')

    // Handlers for new buttons
    const handleTransfer = () => {
        alert(t('common.coming_soon') || "Internal transfers coming soon!")
    }

    const handleExchange = () => {
        alert(t('common.coming_soon') || "Exchange feature coming soon!")
    }

    // Auto refresh page on unauthorized error
    useEffect(() => {
        if (error === 'Unauthorized') {
            const timer = setTimeout(() => window.location.reload(), 2000)
            return () => clearTimeout(timer)
        }
    }, [error])

    return (
        <div className="w-full bg-[#F2F2F7] min-h-screen pb-24">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-[#F2F2F7]/95 backdrop-blur-md pt-4 pb-2 px-4">
                <div className="flex justify-between items-center mb-4">
                    <button className="text-blue-500 font-medium text-lg">Close</button>
                    <div className="flex items-center space-x-1">
                        <span className="font-semibold text-lg">Wallet</span>
                        <div className="bg-blue-500 rounded-full p-0.5">
                            <span className="text-white text-[10px] font-bold px-1">✓</span>
                        </div>
                    </div>
                    <button className="text-blue-500">
                        <MoreHorizontal className="w-6 h-6" />
                    </button>
                </div>

                {/* Segmented Control */}
                <div className="flex justify-center mb-6">
                    <div className="bg-gray-200/80 p-0.5 rounded-lg flex space-x-1">
                        <button
                            onClick={() => setActiveTab('crypto')}
                            className={`px-6 py-1.5 rounded-md text-sm font-semibold transition-all ${activeTab === 'crypto' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}
                        >
                            Crypto
                        </button>
                        <button
                            onClick={() => setActiveTab('ton')}
                            className={`px-6 py-1.5 rounded-md text-sm font-semibold transition-all ${activeTab === 'ton' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}
                        >
                            TON Space
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Balance */}
            <div className="flex flex-col items-center justify-center py-6 space-y-1">
                <p className="text-gray-400 text-sm font-medium tracking-wide">Total Balance</p>
                <h1 className="text-5xl font-bold text-black tracking-tight flex items-start">
                    <span className="text-3xl mt-1 text-gray-400 mr-1">$</span>
                    {loading ? "..." : walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h1>
            </div>

            {/* Action Buttons Grid */}
            <div className="grid grid-cols-4 gap-3 px-4 mb-8">
                {/* Transfer (New) */}
                <div className="flex flex-col items-center space-y-2">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleTransfer}
                        className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20"
                    >
                        <Send className="h-6 w-6 -ml-0.5 mt-0.5" />
                    </motion.button>
                    <span className="text-[11px] font-medium text-blue-500">Transfer</span>
                </div>

                {/* Deposit (Old TopUp) */}
                <div className="flex flex-col items-center space-y-2">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={onTopUp}
                        className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20"
                    >
                        <Plus className="h-7 w-7" />
                    </motion.button>
                    <span className="text-[11px] font-medium text-blue-500">Deposit</span>
                </div>

                {/* Withdraw (Old Send) */}
                <div className="flex flex-col items-center space-y-2">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={onSend}
                        className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20"
                    >
                        <ArrowUp className="h-7 w-7" />
                    </motion.button>
                    <span className="text-[11px] font-medium text-blue-500">Withdraw</span>
                </div>

                {/* Exchange (New) */}
                <div className="flex flex-col items-center space-y-2">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleExchange}
                        className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20"
                    >
                        <ArrowLeftRight className="h-6 w-6" />
                    </motion.button>
                    <span className="text-[11px] font-medium text-blue-500">Exchange</span>
                </div>
            </div>

            {/* Core Button (Distinct) */}
            <div className="px-4 mb-6">
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={onTransfer}
                    className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-4 flex items-center justify-between shadow-lg text-white"
                >
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                            <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="font-bold text-lg">Abundance Core</span>
                            <span className="text-white/80 text-xs">Tap to stash cash & grow</span>
                        </div>
                    </div>
                    <div className="bg-white/20 rounded-full p-1">
                        <ArrowUp className="h-5 w-5 rotate-45" />
                    </div>
                </motion.button>
            </div>

            {/* Assets List */}
            <div className="bg-white rounded-t-3xl min-h-[300px] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-10">
                <div className="p-4 flex justify-between items-center border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800">Assets</h2>
                    <span className="text-sm text-gray-400">Total: $1,212.91</span>
                </div>

                <div className="flex flex-col">
                    {/* Dynamic Mock Assets */}
                    {MOCK_ASSETS.map((asset) => (
                        <WalletAssetRow
                            key={asset.id}
                            name={asset.name}
                            symbol={asset.symbol}
                            price={asset.price}
                            balance={asset.balance}
                            change24h={asset.change}
                            color={asset.color}
                        />
                    ))}

                    <button className="w-full py-4 text-center text-blue-500 font-medium text-sm hover:bg-gray-50 transition-colors">
                        More assets ▾
                    </button>
                </div>
            </div>

            {/* History Section (Old functionality) */}
            {userId && (
                <div className="mt-4 px-4">
                    <h3 className="text-gray-500 font-medium mb-2 pl-2">Recent Activity</h3>
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                        <WalletHistory userId={userId} />
                    </div>
                </div>
            )}
        </div>
    )
}
