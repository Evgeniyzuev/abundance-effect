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

      // Use TON Center API to check transaction status
      const apiKey = process.env.NEXT_PUBLIC_MAINNET_TONCENTER_API_KEY
      if (!apiKey) {
        throw new Error('TON Center API key not configured')
      }

      // First, get transaction hash from BOC
      const getTxHashResponse = await fetch(`https://toncenter.com/api/v2/getTransaction?hash=${boc}&api_key=${apiKey}`)
      const txData = await getTxHashResponse.json()

      if (txData.ok && txData.result) {
        // Transaction exists and is confirmed
        setTransactionStatus('confirmed')
        return
      }

      // If not found immediately, wait and check again
      setTimeout(() => checkTransactionStatus(boc), 3000)
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
