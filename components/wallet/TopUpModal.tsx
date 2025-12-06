"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createPendingDeposit, topUpWalletBalance } from "@/app/actions/finance"
import { useTonConnectUI } from '@tonconnect/ui-react'
import { Address, toNano, Cell } from '@ton/core'
import { useTransactionStatus } from '../../hooks/useTransactionStatus'
import { useTonPrice } from "@/context/TonPriceContext"
import { createClient } from "@/utils/supabase/client"

// Стабильный билд
// Обновим интерфейс TopUpModalProps
interface TopUpModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (newBalance: number) => void
  userId: string
}

// Обновим компонент TopUpModal
export default function TopUpModal({ isOpen, onClose, onSuccess, userId }: TopUpModalProps) {
  const [amount, setAmount] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [depositStatus, setDepositStatus] = useState<'idle' | 'waiting' | 'confirmed' | 'failed'>('idle')
  const [sessionId, setSessionId] = useState<string>("")
  const [plisioSessionId, setPlisioSessionId] = useState<string | null>(null)
  const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null)
  const [copyMessage, setCopyMessage] = useState<string | null>(null)
  const [tonConnectUI] = useTonConnectUI()
  const { startChecking } = useTransactionStatus() // Remove transactionStatus since we don't need it now
  const { convertUsdToTon, tonPrice } = useTonPrice()

  // Reset status when modal opens
  useEffect(() => {
    if (isOpen) {
      setDepositStatus('idle')
      setSessionId(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
      setError(null)
      setAmount("")
    }
  }, [isOpen])

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null
    async function pollStatus(session: string) {
      try {
        const res = await fetch(`/api/plisio/invoice-status?sessionId=${encodeURIComponent(session)}`)
        if (!res.ok) return
        const json = await res.json()
        const st = json?.data?.status
        if (st === 'completed') {
          setDepositStatus('confirmed')
          if (onSuccess) onSuccess(0)
          if (timer) clearInterval(timer)
        } else if (st === 'failed_or_expired') {
          setDepositStatus('failed')
          setError('Invoice expired or failed. You can renew the invoice.')
          if (timer) clearInterval(timer)
        }
      } catch (e) {
        console.error('pollStatus error', e)
      }
    }

    if (plisioSessionId) {
      // start polling every 5 seconds
      pollStatus(plisioSessionId)
      timer = setInterval(() => pollStatus(plisioSessionId), 5000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [plisioSessionId])

  const handleTonPayment = async () => {
    const numericAmount = parseFloat(amount)
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError("Please enter a valid amount greater than zero")
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)
      setDepositStatus('waiting')

      const tonAmount = convertUsdToTon(numericAmount)
      if (!tonAmount) {
        throw new Error("Unable to convert USD to TON. Please try again later.")
      }

      // Round to 9 decimal places to avoid precision issues
      const roundedTonAmount = Number(tonAmount.toFixed(9))
      const amountInNanotons = BigInt(Math.floor(Number(toNano(roundedTonAmount.toString()))))

      console.log('Preparing deposit:', {
        usdAmount: numericAmount,
        tonAmount: roundedTonAmount,
        amountInNanotons: amountInNanotons.toString(),
        destinationAddress: process.env.NEXT_PUBLIC_DESTINATION_ADDRESS,
        senderAddress: tonConnectUI.account?.address
      })

      if (!process.env.NEXT_PUBLIC_DESTINATION_ADDRESS) {
        throw new Error('Destination address is not configured')
      }

      if (!tonConnectUI.connected || !tonConnectUI.account?.address) {
        throw new Error('TON wallet is not connected')
      }

      // Convert sender address to friendly format for better readability
      const friendlySenderAddress = Address.parse(tonConnectUI.account.address).toString()

      // Create pending deposit first
      const depositResult = await createPendingDeposit({
        userId,
        amountUsd: numericAmount,
        senderAddress: friendlySenderAddress, // Use friendly format
        expectedTonValue: Number(amountInNanotons),
        sessionId
      })

      if (!depositResult.success) {
        throw new Error(depositResult.error || 'Failed to initiate deposit')
      }

      console.log('Pending deposit created, now sending TON transaction')

      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 60, // Valid for 60 seconds
        messages: [
          {
            address: process.env.NEXT_PUBLIC_DESTINATION_ADDRESS,
            amount: amountInNanotons.toString(),
            // No payload needed for simple transfers
          },
        ],
      }

      const result = await tonConnectUI.sendTransaction(transaction)
      console.log("TON transaction sent successfully:", result)

      if (!result?.boc) {
        throw new Error('Transaction was not sent successfully')
      }

      // Transaction sent successfully, pending deposit is waiting for blockchain confirmation
      console.log('Deposit initiated successfully, awaiting blockchain confirmation')

    } catch (error) {
      console.error("TON payment error:", error)
      setDepositStatus('failed')
      if (error instanceof Error) {
        if (error.message.includes('TON_CONNECT_SDK_ERROR')) {
          setError('Failed to send transaction. Please check your wallet connection and try again.')
        } else {
          setError(error.message)
        }
      } else {
        setError("Failed to process TON payment")
      }
    } finally {
      setIsSubmitting(false)
    }
  }



  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Top Up Wallet</DialogTitle>
          <DialogDescription>
            Add funds to your wallet to use for investments and transfers
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount in USD</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <Input
                id="amount"
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="pl-8"
              />
            </div>
            {amount && !isNaN(parseFloat(amount)) && tonPrice && (
              <p className="text-sm text-muted-foreground">
                ≈ {convertUsdToTon(parseFloat(amount))?.toFixed(4)} TON
              </p>
            )}
            {error && <p className="text-sm text-red-500">{error}</p>}
            {depositStatus === 'waiting' && (
              <p className="text-sm text-blue-500">Deposit initiated, awaiting blockchain confirmation...</p>
            )}
            {depositStatus === 'confirmed' && (
              <p className="text-sm text-green-500">Deposit confirmed and processed!</p>
            )}
            {depositStatus === 'failed' && (
              <div>
                <p className="text-sm text-red-500">Invoice expired or payment failed. You can renew the invoice or try another method.</p>
                <div className="mt-2">
                  <Button
                    variant="ghost"
                    onClick={async () => {
                      // Renew: create a new invoice using the same amount
                      try {
                        setIsSubmitting(true)
                        setError(null)
                        const numericAmount = parseFloat(amount)
                        if (isNaN(numericAmount) || numericAmount <= 0) {
                          setError('Please enter a valid amount to renew')
                          return
                        }
                        const res = await fetch('/api/plisio/create-invoice', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ amountUsd: numericAmount })
                        })
                        if (!res.ok) {
                          let errBody = null
                          try { errBody = await res.json() } catch { errBody = await res.text() }
                          const msg = errBody?.data?.message || errBody?.message || JSON.stringify(errBody)
                          throw new Error(msg || 'Failed to renew invoice')
                        }

                        const data = await res.json()
                        if (data?.status === 'error' || !data?.data) {
                          const errData = data?.data || data
                          const userMessage = errData?.message || errData?.name || JSON.stringify(errData)
                          throw new Error(userMessage)
                        }

                        const invoiceUrl = data?.data?.invoice_url
                        const returnedSession = data?.session_id || data?.data?.order_number || null
                        if (returnedSession) setPlisioSessionId(returnedSession)
                        if (!invoiceUrl) throw new Error('No invoice URL returned: ' + JSON.stringify(data))
                        // Open a blank tab synchronously to avoid iOS popup blockers, then redirect it
                        const win = window.open('', '_blank')
                        setInvoiceUrl(invoiceUrl)
                        try { if (win) win.location.href = invoiceUrl } catch (e) { console.warn('Redirect to invoice blocked', e) }
                        setDepositStatus('waiting')
                      } catch (e: any) {
                        setError(e?.message || 'Failed to renew invoice')
                      } finally {
                        setIsSubmitting(false)
                      }
                    }}
                  >
                    Renew invoice
                  </Button>
                </div>
              </div>
            )}
          </div>

          {tonConnectUI && (
            <Button
              variant="outline"
              className="flex items-center gap-2 w-full"
              onClick={handleTonPayment}
              disabled={!tonConnectUI.connected || isSubmitting}
            >
              <span className="text-lg">💎</span>
              Pay with TON
            </Button>
          )}

          <Button
            variant="outline"
            className="flex items-center gap-2 w-full"
            onClick={async () => {
              // Create a Plisio invoice on the server and open invoice URL
              try {
                setIsSubmitting(true)
                setError(null)

                const numericAmount = parseFloat(amount)
                if (isNaN(numericAmount) || numericAmount <= 0) {
                  setError('Please enter a valid amount greater than zero')
                  return
                }

                const res = await fetch('/api/plisio/create-invoice', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ amountUsd: numericAmount })
                })

                let data: any
                try {
                  data = await res.json()
                } catch (e) {
                  const text = await res.text()
                  throw new Error(text || 'Failed to create invoice')
                }

                // Prefer explicit error handling based on returned JSON
                if (!res.ok || data?.status === 'error' || !data?.data) {
                  // Try to extract meaningful message from Plisio error model
                  const errData = data?.data || data
                  let userMessage = 'Failed to create invoice'
                  if (errData?.message) userMessage = errData.message
                  else if (errData?.name) userMessage = `${errData.name}: ${errData.message || ''}`
                  else userMessage = JSON.stringify(errData)
                  throw new Error(userMessage)
                }

                // Plisio returns invoice_url in data.data.invoice_url
                const invoiceUrl = data?.data?.invoice_url
                const returnedSession = data?.session_id || data?.data?.order_number || null
                if (!invoiceUrl) {
                  // If Plisio returned success but no invoice_url, surface full response for debugging
                  throw new Error('No invoice URL returned: ' + JSON.stringify(data))
                }

                // Save session id for polling
                if (returnedSession) setPlisioSessionId(returnedSession)

                // Open a blank tab synchronously to avoid iOS popup blockers, then redirect it
                const win = window.open('', '_blank')
                setInvoiceUrl(invoiceUrl)
                try { if (win) win.location.href = invoiceUrl } catch (e) { console.warn('Redirect to invoice blocked', e) }
                // Set modal to waiting state until webhook confirms
                setDepositStatus('waiting')

              } catch (e: any) {
                console.error('Plisio create invoice error', e)
                setError(e?.message || 'Failed to create Plisio invoice')
              } finally {
                setIsSubmitting(false)
              }
            }}
            disabled={isSubmitting}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 12h18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 3v18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Pay with Plisio
          </Button>

          {/* Fallback UI: show open-link button and copy link if invoiceUrl is available */}
          {invoiceUrl && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">If the invoice didn't open, open it manually:</p>
              <div className="flex gap-2">
                <a href={invoiceUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline">Open invoice</Button>
                </a>
                <Button variant="outline" onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(invoiceUrl)
                    setCopyMessage('Link copied')
                    setTimeout(() => setCopyMessage(null), 3000)
                  } catch (e) {
                    setCopyMessage('Copy failed')
                    setTimeout(() => setCopyMessage(null), 3000)
                  }
                }}>Copy link</Button>
                {copyMessage && <span className="text-sm">{copyMessage}</span>}
              </div>
              <p className="text-xs text-muted-foreground">On some iOS in-app browsers, press 'Open in Safari' if the invoice doesn't load.</p>
            </div>
          )}

          <Button
            variant="outline"
            className="flex items-center gap-2 w-full"
            onClick={() => {/* TODO: Implement Google Pay */}}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" className="h-5 w-5">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google Pay
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-2 w-full"
            onClick={() => {/* TODO: Implement Apple Pay! */}}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" className="h-5 w-5">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.24 1.24-.36 1.7-.79 2.73zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" fill="#000000"/>
            </svg>
            Apple Pay
          </Button>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
