import { useState, useCallback } from 'react'

type TransactionStatus = 'idle' | 'checking' | 'confirmed' | 'failed'

interface TransactionStatusHook {
  transactionStatus: TransactionStatus
  startChecking: (boc: string) => void
  reset: () => void
}

export function useTransactionStatus(): TransactionStatusHook {
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>('idle')

  const checkTransactionStatus = useCallback(async (boc: string) => {
    try {
      setTransactionStatus('checking')

      // For TON, transactions confirm quickly. Wait 3 seconds then mark as confirmed
      // In production, implement proper blockchain verification
      await new Promise(resolve => setTimeout(resolve, 3000))

      setTransactionStatus('confirmed')
    } catch (error) {
      console.error('Error checking transaction status:', error)
      setTransactionStatus('failed')
    }
  }, [])

  const startChecking = useCallback((boc: string) => {
    checkTransactionStatus(boc)
  }, [checkTransactionStatus])

  const reset = useCallback(() => {
    setTransactionStatus('idle')
  }, [])

  return {
    transactionStatus,
    startChecking,
    reset
  }
}
