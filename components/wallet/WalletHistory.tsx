import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { useLanguage } from "@/context/LanguageContext"

interface WalletOperation {
    id: string
    user_id: string
    amount: number
    type: 'topup' | 'transfer' | 'debit' | 'send'
    description: string | null
    status: 'pending' | 'completed' | 'failed'
    created_at: string
}

interface WalletHistoryProps {
    userId: string
}

export default function WalletHistory({ userId }: WalletHistoryProps) {
    const { t } = useLanguage()
    const [isExpanded, setIsExpanded] = useState(false)
    const [operations, setOperations] = useState<WalletOperation[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const supabase = createClient()

    const loadOperations = async () => {
        if (!isExpanded) return

        setIsLoading(true)
        try {
            const { data, error } = await supabase
                .from('wallet_operations')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(50)

            if (error) {
                console.error('Error loading wallet operations:', error)
                throw error
            }

            setOperations(data || [])
        } catch (error) {
            console.error('Error loading wallet operations:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadOperations()
    }, [isExpanded])

    const toggleExpand = () => {
        setIsExpanded(!isExpanded)
    }

    const getOperationIcon = (type: string) => {
        switch (type) {
            case 'topup':
                return '💰'
            case 'transfer':
                return '↔️'
            case 'debit':
                return '➖'
            case 'send':
                return '📤'
            default:
                return '📝'
        }
    }

    const getOperationLabel = (type: string) => {
        switch (type) {
            case 'topup':
                return 'Wallet Topup'
            case 'transfer':
                return 'Transfer to Core'
            case 'debit':
                return 'Debit'
            case 'send':
                return 'Send'
            default:
                return 'Operation'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return '⏳'
            case 'completed':
                return '✅'
            case 'failed':
                return '❌'
            default:
                return '❓'
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending':
                return 'Pending'
            case 'completed':
                return 'Completed'
            case 'failed':
                return 'Failed'
            default:
                return 'Unknown'
        }
    }

    return (
        <div className="space-y-2">
            <button
                onClick={toggleExpand}
                className="w-full flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl text-gray-900 hover:bg-gray-50 transition-all shadow-sm"
            >
                <span className="font-semibold text-sm">Wallet History</span>
                {isExpanded ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
            </button>

            {isExpanded && (
                <div className="space-y-2">
                    {isLoading ? (
                        <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-xl border border-gray-100 text-sm">
                            {t('common.loading')}
                        </div>
                    ) : operations.length === 0 ? (
                        <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-xl border border-gray-100 text-sm">
                            {t('wallet.no_operations')}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {operations.map((op) => (
                                <div
                                    key={op.id}
                                    className={`flex items-center justify-between p-3 bg-white border rounded-xl shadow-sm ${
                                        op.status === 'pending' ? 'border-blue-200 bg-blue-50' : 'border-gray-100'
                                    }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="relative">
                                            <span className="text-xl">{getOperationIcon(op.type)}</span>
                                            <span className="absolute -top-1 -right-1 text-xs">{getStatusIcon(op.status)}</span>
                                        </div>
                                        <div>
                                            <div className="font-semibold text-sm text-gray-900">{getOperationLabel(op.type)}</div>
                                            <div className="text-xs text-gray-500">
                                                {new Date(op.created_at).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                            <div className="text-xs text-gray-400">{getStatusLabel(op.status)}</div>
                                        </div>
                                    </div>
                                    <div className={`font-bold text-sm ${op.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {op.amount >= 0 ? '+' : ''}${op.amount.toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
