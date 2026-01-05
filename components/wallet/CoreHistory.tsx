import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, ArrowUp } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"

interface CoreOperation {
    id: string
    user_id: string
    amount: number
    type: 'interest' | 'transfer' | 'reinvest' | 'referral_bonus'
    created_at: string
}

interface CoreHistoryProps {
    userId: string
}

export default function CoreHistory({ userId }: CoreHistoryProps) {
    const { t } = useLanguage()
    const [isExpanded, setIsExpanded] = useState(false)
    const [operations, setOperations] = useState<CoreOperation[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [hasLoadedOnce, setHasLoadedOnce] = useState(false)

    const loadOperations = async () => {
        if (!isExpanded || !userId) return

        setIsLoading(true)
        try {
            // Using server action for more reliable data fetching with re-auth handling
            const { getCoreOperations } = await import("@/app/actions/finance")
            const result = await getCoreOperations(userId)

            if (result.success && result.data) {
                setOperations(result.data)
                setHasLoadedOnce(true)
            } else {
                console.error('Error loading core operations:', result.error)
            }
        } catch (error) {
            console.error('Error loading core operations:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (isExpanded) {
            loadOperations()
        }
    }, [isExpanded, userId])

    const toggleExpand = () => {
        const nextState = !isExpanded
        if (nextState) {
            // Optional: clear operations on expand to show fresh loading
            // setOperations([]) 
        }
        setIsExpanded(nextState)
    }


    const getOperationIcon = (type: string) => {
        switch (type) {
            case 'interest':
                return '💰'
            case 'transfer':
                return '↔️'
            case 'reinvest':
                return '🔄'
            case 'referral_bonus':
                return '👥'
            default:
                return '📝'
        }
    }

    const getOperationLabel = (type: string) => {
        switch (type) {
            case 'interest':
                return t('wallet.interest_earned')
            case 'transfer':
                return t('wallet.transfer')
            case 'reinvest':
                return t('wallet.reinvest')
            case 'referral_bonus':
                return t('wallet.referral_bonus')
            default:
                return t('wallet.operation')
        }
    }

    return (
        <div className="space-y-2">
            <button
                onClick={toggleExpand}
                className="w-full flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl text-gray-900 hover:bg-gray-50 transition-all shadow-sm"
            >
                <span className="font-semibold text-sm">{t('wallet.core_history')}</span>
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
                            {operations.map((op) => {
                                const isTransferToCore = op.type === 'transfer';
                                return (
                                    <div
                                        key={op.id}
                                        className={`flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-sm ${isTransferToCore ? 'operation--transfer-to-core' : ''
                                            }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <span className="text-xl">{getOperationIcon(op.type)}</span>
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
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            {isTransferToCore && (
                                                <ArrowUp
                                                    className="h-3 w-3"
                                                    style={{ color: '#2563EB' }}
                                                    aria-label="Transfer to core - increased power"
                                                />
                                            )}
                                            <span
                                                className={`font-bold text-sm ${isTransferToCore
                                                    ? 'text-[#2563EB]'
                                                    : op.amount >= 0 ? 'text-green-600' : 'text-red-600'
                                                    }`}
                                                aria-label={`Amount: ${op.amount >= 0 ? '+' : ''}${op.amount.toFixed(8)}${isTransferToCore ? ' (Transfer to core)' : ''}`}
                                            >
                                                {op.amount >= 0 ? '+' : ''}{op.amount.toFixed(8)}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
