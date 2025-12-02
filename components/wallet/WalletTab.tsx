"use client"

import { Plus, ArrowRight, Send, ArrowDown } from "lucide-react"
import { motion } from "framer-motion"
import { useLanguage } from "@/context/LanguageContext"
import { TonConnectButton } from '@tonconnect/ui-react'
import WalletHistory from "./WalletHistory"

interface WalletTabProps {
    walletBalance: number
    onTopUp: () => void
    onTransfer: () => void
    onSend: () => void
    userId: string | null
}

export default function WalletTab({ walletBalance, onTopUp, onTransfer, onSend, userId }: WalletTabProps) {
    const { t } = useLanguage()

    return (
        <div className="w-full bg-white min-h-full">
            {/* Balance Section */}
            <div className="flex flex-col items-center justify-center py-10 space-y-2">
                <p className="text-gray-500 text-sm font-medium">{t('wallet.wallet_balance')}</p>
                <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
                    ${walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h1>
            </div>

            {/* TON Connect Button */}
            <div className="px-6 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-900 mb-3">Connect TON Wallet</p>
                    <div className="flex justify-center">
                        <TonConnectButton />
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-4 gap-4 px-6 mb-8">
                <div className="flex flex-col items-center space-y-2">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={onTopUp}
                        disabled={!userId}
                        className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus className="h-6 w-6" />
                    </motion.button>
                    <span className="text-xs font-medium text-gray-600">{t('wallet.top_up')}</span>
                </div>

                <div className="flex flex-col items-center space-y-2">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={onTransfer}
                        disabled={!userId}
                        className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ArrowRight className="h-6 w-6" />
                    </motion.button>
                    <span className="text-xs font-medium text-gray-600">{t('wallet.transfer_to_core')}</span>
                </div>

                <div className="flex flex-col items-center space-y-2">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={onSend}
                        disabled={!userId}
                        className="w-14 h-14 rounded-full bg-purple-500 flex items-center justify-center text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="h-6 w-6" />
                    </motion.button>
                    <span className="text-xs font-medium text-gray-600">{t('wallet.send')}</span>
                </div>

                <div className="flex flex-col items-center space-y-2">
                    <button
                        disabled
                        className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 cursor-not-allowed"
                    >
                        <ArrowDown className="h-6 w-6" />
                    </button>
                    <span className="text-xs font-medium text-gray-400">{t('wallet.receive')}</span>
                </div>
            </div>

            {/* Wallet History */}
            {userId && (
                <div className="pt-4 border-t border-gray-100 p-6">
                    <WalletHistory userId={userId} />
                </div>
            )}
        </div>
    )
}
