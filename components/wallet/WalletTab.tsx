"use client"

import { Plus, ArrowRight, Send, ArrowDown } from "lucide-react"
import { motion } from "framer-motion"

interface WalletTabProps {
    walletBalance: number
    onTopUp: () => void
    onTransfer: () => void
    onSend: () => void
    userId: string | null
}

export default function WalletTab({ walletBalance, onTopUp, onTransfer, onSend, userId }: WalletTabProps) {
    return (
        <div className="relative min-h-[calc(100vh-140px)] w-full overflow-hidden">
            {/* Background with gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 z-0">
                <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Content */}
            <div className="relative z-10 p-6 space-y-6">
                {/* Balance Card */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white shadow-xl"
                >
                    <p className="text-sm opacity-80 font-medium mb-2">Wallet Balance</p>
                    <h1 className="text-4xl font-bold">${walletBalance.toFixed(2)}</h1>
                </motion.div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4">
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        onClick={onTopUp}
                        disabled={!userId}
                        className="bg-white/15 backdrop-blur-md border border-white/30 rounded-2xl p-6 text-white hover:bg-white/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                        <div className="flex flex-col items-center space-y-3">
                            <div className="bg-blue-500/30 p-3 rounded-full">
                                <Plus className="h-6 w-6" />
                            </div>
                            <span className="text-sm font-semibold">Top Up</span>
                        </div>
                    </motion.button>

                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        onClick={onTransfer}
                        disabled={!userId}
                        className="bg-white/15 backdrop-blur-md border border-white/30 rounded-2xl p-6 text-white hover:bg-white/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                        <div className="flex flex-col items-center space-y-3">
                            <div className="bg-green-500/30 p-3 rounded-full">
                                <ArrowRight className="h-6 w-6" />
                            </div>
                            <span className="text-sm font-semibold">To Core</span>
                        </div>
                    </motion.button>

                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        onClick={onSend}
                        disabled={!userId}
                        className="bg-white/15 backdrop-blur-md border border-white/30 rounded-2xl p-6 text-white hover:bg-white/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                        <div className="flex flex-col items-center space-y-3">
                            <div className="bg-purple-500/30 p-3 rounded-full">
                                <Send className="h-6 w-6" />
                            </div>
                            <span className="text-sm font-semibold">Send</span>
                        </div>
                    </motion.button>

                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        disabled
                        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white/50 cursor-not-allowed shadow-lg"
                    >
                        <div className="flex flex-col items-center space-y-3">
                            <div className="bg-orange-500/20 p-3 rounded-full">
                                <ArrowDown className="h-6 w-6" />
                            </div>
                            <span className="text-sm font-semibold">Receive</span>
                        </div>
                    </motion.button>
                </div>
            </div>
        </div>
    )
}
