"use client"

import { Plus, ArrowRight, Send, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WalletTabProps {
    walletBalance: number
    onTopUp: () => void
    onTransfer: () => void
    onSend: () => void
    userId: string | null
}

export default function WalletTab({ walletBalance, onTopUp, onTransfer, onSend, userId }: WalletTabProps) {
    return (
        <div className="space-y-4 p-4">
            {/* Balance Card */}
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl p-6 text-white shadow-lg">
                <p className="text-sm opacity-90 font-medium mb-1">Wallet Balance</p>
                <h1 className="text-3xl font-bold">${walletBalance.toFixed(2)}</h1>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
                <Button
                    className="h-16 bg-white border-2 border-blue-100 hover:border-blue-200 hover:bg-blue-50 text-blue-700 font-semibold flex flex-col items-center justify-center space-y-1"
                    onClick={onTopUp}
                    disabled={!userId}
                >
                    <Plus className="h-5 w-5" />
                    <span className="text-xs">Top Up</span>
                </Button>

                <Button
                    className="h-16 bg-white border-2 border-green-100 hover:border-green-200 hover:bg-green-50 text-green-700 font-semibold flex flex-col items-center justify-center space-y-1"
                    onClick={onTransfer}
                    disabled={!userId}
                >
                    <ArrowRight className="h-5 w-5" />
                    <span className="text-xs">Transfer to Core</span>
                </Button>

                <Button
                    className="h-16 bg-white border-2 border-purple-100 hover:border-purple-200 hover:bg-purple-50 text-purple-700 font-semibold flex flex-col items-center justify-center space-y-1"
                    onClick={onSend}
                    disabled={!userId}
                >
                    <Send className="h-5 w-5" />
                    <span className="text-xs">Send</span>
                </Button>

                <Button
                    className="h-16 bg-white border-2 border-orange-100 hover:border-orange-200 hover:bg-orange-50 text-orange-700 font-semibold flex flex-col items-center justify-center space-y-1"
                    disabled
                >
                    <ArrowDown className="h-5 w-5" />
                    <span className="text-xs">Receive</span>
                </Button>
            </div>
        </div>
    )
}
