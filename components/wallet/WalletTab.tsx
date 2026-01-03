"use client"

import { Plus, ArrowUp, ArrowDown, ArrowRightLeft, Send, Sparkles, Wallet, ScanLine, MoreHorizontal, ArrowLeftRight, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { useLanguage } from "@/context/LanguageContext"
import { TonConnectButton } from '@tonconnect/ui-react'
import WalletHistory from "./WalletHistory"
import WalletAssetRow from "./WalletAssetRow"

interface WalletTabProps {
    walletBalance: number
    onTopUp: () => void
    onCoreTransfer: () => void
    onP2PTransfer: () => void
    onSend: () => void
    onWithdraw: () => void
    userId: string | null
    loading?: boolean
    error?: string | null
}

const BASE_ASSETS = [
    { id: 'usdt', name: 'Dollars', symbol: 'USDT', price: 1.00, change: 0.00, balance: 0, color: '#22c55e' }, // Green
    { id: 'ton', name: 'Toncoin', symbol: 'TON', price: 2.15, change: 0.00, balance: 0, color: '#0098EA' }, // Blue
    { id: 'btc', name: 'Bitcoin', symbol: 'BTC', price: 96890.00, change: 0.00, balance: 0, color: '#F7931A' }, // Orange
    { id: 'eth', name: 'Ethereum', symbol: 'ETH', price: 3500.00, change: 0.00, balance: 0, color: '#627EEA' }, // Purple-Blue
    { id: 'gold', name: 'Gold', symbol: 'XAU', price: 2045.50, change: 0.00, balance: 0, color: '#FFD700' }, // Gold
]

export default function WalletTab({ walletBalance, onTopUp, onCoreTransfer, onP2PTransfer, onSend, onWithdraw, userId, loading, error }: WalletTabProps) {
    const { t } = useLanguage()

    const [showAllAssets, setShowAllAssets] = useState(false)

    // Handlers for new buttons
    const handleTransfer = () => {
        onP2PTransfer()
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

    // Update assets with real balance for USDT
    const currentAssets = BASE_ASSETS.map(asset => {
        if (asset.id === 'usdt') {
            return { ...asset, balance: walletBalance }
        }
        return asset
    })

    const visibleAssets = showAllAssets ? currentAssets : [currentAssets[0]]

    return (
        <div className="w-full bg-[#F2F2F7] min-h-screen pb-24">


            {/* Main Balance */}
            <div className="flex flex-col items-center justify-center py-8 space-y-1">
                <h1 className="text-5xl font-bold text-black tracking-tight flex items-start">
                    <span className="text-3xl mt-2 text-gray-400 mr-1">$</span>
                    {loading ? "..." : walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h1>
            </div>

            {/* Action Buttons Grid */}
            <div className="grid grid-cols-4 gap-3 px-4 mb-8">
                {/* Transfer (New) */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleTransfer}
                    className="bg-white rounded-2xl py-3 flex flex-col items-center justify-center shadow-sm space-y-2 h-[88px]"
                >
                    <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white">
                        <Send className="h-4 w-4 -ml-0.5 mt-0.5" />
                    </div>
                    <span className="text-[11px] font-medium text-blue-500">Transfer</span>
                </motion.button>

                {/* Deposit (Old TopUp) */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={onTopUp}
                    className="bg-white rounded-2xl py-3 flex flex-col items-center justify-center shadow-sm space-y-2 h-[88px]"
                >
                    <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white">
                        <Plus className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-medium text-blue-500">Deposit</span>
                </motion.button>

                {/* Withdraw (Old Send) */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={onSend}
                    className="bg-white rounded-2xl py-3 flex flex-col items-center justify-center shadow-sm space-y-2 h-[88px]"
                >
                    <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white">
                        <ArrowUp className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-medium text-blue-500">Withdraw</span>
                </motion.button>

                {/* Exchange (New) */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleExchange}
                    className="bg-white rounded-2xl py-3 flex flex-col items-center justify-center shadow-sm space-y-2 h-[88px]"
                >
                    <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white">
                        <ArrowLeftRight className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-medium text-blue-500">Exchange</span>
                </motion.button>
            </div>

            {/* Core Button (Distinct) */}
            <div className="px-4 mb-6">
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={onCoreTransfer}
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
                    {/* <span className="text-sm text-gray-400">Total: ${walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span> */}
                </div>

                <div className="flex flex-col">
                    {/* Dynamic Mock Assets */}
                    {visibleAssets.map((asset) => (
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

                    <button
                        onClick={() => setShowAllAssets(!showAllAssets)}
                        className="w-full py-4 flex items-center justify-center text-blue-500 font-medium text-sm hover:bg-gray-50 transition-colors space-x-1"
                    >
                        <span>{showAllAssets ? 'Less assets' : 'More assets'}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${showAllAssets ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>

            {/* History Section (Old functionality) - Only visible on Wallet tab? Or both? */}
            {/* For now, keep it at bottom */}
            {userId && (
                <div className="mt-4 px-4 bg-transparent">
                    <h3 className="text-gray-500 font-medium mb-2 pl-2">Recent Activity</h3>
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                        <WalletHistory userId={userId} />
                    </div>
                </div>
            )}
        </div>
    )
}
