import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { createClient } from "@/utils/supabase/client"

interface CoreOperation {
    id: string
    user_id: string
    amount: number
    type: 'interest' | 'transfer' | 'reinvest'
    created_at: string
}

interface CoreHistoryProps {
    userId: string
}

export default function CoreHistory({ userId }: CoreHistoryProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [operations, setOperations] = useState<CoreOperation[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const supabase = createClient()

    const loadOperations = async () => {
        if (!isExpanded) return

        console.log('Loading operations for userId:', userId)
        setIsLoading(true)
        try {
            const { data, error } = await supabase
                .from('core_operations')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(50)

            if (error) {
                console.error('Error loading operations:', error)
                throw error
            }

            console.log('Loaded operations:', data)
            setOperations(data || [])
        } catch (error) {
            console.error('Error loading operations:', error)
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
            case 'interest':
                return '💰'
            case 'transfer':
                return '↔️'
            case 'reinvest':
                return '🔄'
            default:
                return '📝'
        }
    }

    const getOperationLabel = (type: string) => {
        switch (type) {
            case 'interest':
                return 'Interest Earned'
            case 'transfer':
                return 'Transfer'
            case 'reinvest':
                return 'Reinvest'
            default:
                return 'Operation'
        }
    }

    return (
        <div className="space-y-2">
            <button
                onClick={toggleExpand}
                className="w-full flex items-center justify-between p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white hover:bg-white/15 transition-all shadow-lg"
            >
                <span className="font-semibold">Core History</span>
                {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>

            {isExpanded && (
                <div className="space-y-2">
                    {isLoading ? (
                        <div className="text-center py-6 text-white/70 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                            Loading history...
                        </div>
                    ) : operations.length === 0 ? (
                        <div className="text-center py-6 text-white/70 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                            No operations yet
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {operations.map((op) => (
                                <div
                                    key={op.id}
                                    className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white shadow-lg"
                                >
                                    <div className="flex items-center space-x-3">
                                        <span className="text-2xl">{getOperationIcon(op.type)}</span>
                                        <div>
                                            <div className="font-semibold">{getOperationLabel(op.type)}</div>
                                            <div className="text-xs opacity-70">
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
                                    <div className={`font-bold text-lg ${op.amount >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                                        {op.amount >= 0 ? '+' : ''}{op.amount.toFixed(8)}
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
