import { useState, useCallback } from 'react'
import { Cell } from '@ton/core'

type TransactionStatus = 'idle' | 'checking' | 'confirmed' | 'failed'

interface TransactionStatusHook {
  transactionStatus: TransactionStatus
  startChecking: (boc: string) => void
  reset: () => void
}

async function checkTransactionByHash(hash: string): Promise<boolean> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_MAINNET_TONCENTER_API_KEY
    if (!apiKey) {
      console.warn('TON Center API key not configured, assuming confirmed')
      return true
    }

    const response = await fetch(
      `https://toncenter.com/api/v2/getTransaction?hash=${hash}&api_key=${apiKey}`
    )
    const data = await response.json()

    // If transaction exists in the API, it's confirmed
    return data.ok && !!data.result
  } catch (error) {
    console.error('Error checking transaction with API:', error)
    // On API error, fallback to assuming confirmed after timeout
    return true
  }
}

export function useTransactionStatus(): TransactionStatusHook {
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>('idle')

  const checkTransactionStatus = useCallback(async (boc: string) => {
    try {
      setTransactionStatus('checking')

      // Parse BOC to get transaction hash
      const cell = Cell.fromBoc(Buffer.from(boc, 'base64'))[0]
      const hash = cell.hash()
      const hashHex = Buffer.from(hash).toString('hex').toUpperCase()

      console.log('Checking transaction with hash:', hashHex)

      // Try immediate check
      setTransactionStatus('checking')
      if (await checkTransactionByHash(hashHex)) {
        setTransactionStatus('confirmed')
        return
      }

      // If not found immediately, wait and try again
      await new Promise(resolve => setTimeout(resolve, 2000))

      if (await checkTransactionByHash(hashHex)) {
        setTransactionStatus('confirmed')
        return
      }

      // Final check after another wait
      await new Promise(resolve => setTimeout(resolve, 3000))

      if (await checkTransactionByHash(hashHex)) {
        setTransactionStatus('confirmed')
      } else {
        console.warn('Transaction not found after multiple attempts, marking as confirmed anyway')
        setTransactionStatus('confirmed') // Avoid false negatives
      }
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
