"use client"

import React from 'react'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTonPrice } from '@/context/TonPriceContext'

interface WithdrawModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (newBalance: number) => void
  userId: string
  currentBalance: number
}

const CURRENCIES = [
  { id: 'BTC', label: 'Bitcoin (BTC)' },
  { id: 'ETH', label: 'Ethereum (ETH)' },
  { id: 'USDT', label: 'Tether (USDT)' },
  { id: 'USDC', label: 'USDC' },
  { id: 'TON', label: 'Toncoin (TON)' }
]

export default function WithdrawModal({ isOpen, onClose, onSuccess, userId, currentBalance }: WithdrawModalProps) {
  const [currency, setCurrency] = useState('BTC')
  const [amount, setAmount] = useState('')
  const [to, setTo] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { tonPrice } = useTonPrice()

  const handleWithdraw = async () => {
    setError(null)
    const cryptoAmount = parseFloat(amount)
    if (isNaN(cryptoAmount) || cryptoAmount <= 0) {
      setError('Enter a valid amount')
      return
    }
    if (!to) { setError('Enter destination address'); return }

    try {
      setIsSubmitting(true)
      const res = await fetch('/api/plisio/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currency, amount: cryptoAmount, to })
      })
      const json = await res.json()
      if (!res.ok || json?.status === 'error') {
        setError(json?.message || JSON.stringify(json?.data) || 'Withdraw failed')
        return
      }

      // On success, trigger balance refresh
      onSuccess(0)
      onClose()
    } catch (e: any) {
      setError(e?.message || 'Server error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Withdraw</DialogTitle>
          <DialogDescription>Withdraw funds to external crypto address using Plisio</DialogDescription>
        </DialogHeader>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div className="space-y-2">
            <Label>Currency</Label>
            <select className="w-full p-2 border rounded" value={currency} onChange={(e) => setCurrency(e.target.value)}>
              {CURRENCIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Amount (crypto)</Label>
            <Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.001" />
          </div>

          <div className="space-y-2">
            <Label>Destination address</Label>
            <Input value={to} onChange={(e) => setTo(e.target.value)} placeholder="Address" />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
            <Button onClick={handleWithdraw} disabled={isSubmitting}>{isSubmitting ? 'Processing...' : 'Withdraw'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
