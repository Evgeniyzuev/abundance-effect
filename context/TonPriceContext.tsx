"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface TonPriceContextType {
  tonPrice: number | null
  convertUsdToTon: (usdAmount: number) => number | null
  convertTonToUsd: (tonAmount: number) => number | null
  isLoading: boolean
  error: string | null
  refreshPrice: () => Promise<void>
}

const TonPriceContext = createContext<TonPriceContextType | undefined>(undefined)

interface TonPriceProviderProps {
  children: ReactNode
}

export function TonPriceProvider({ children }: TonPriceProviderProps) {
  const [tonPrice, setTonPrice] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTonPrice = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Using CoinGecko API for TON price in USD
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=usd')
      const data = await response.json()

      if (data['the-open-network']?.usd) {
        setTonPrice(data['the-open-network'].usd)
      } else {
        throw new Error('Invalid price data')
      }
    } catch (err) {
      console.error('Error fetching TON price:', err)
      setError('Failed to fetch TON price')
    } finally {
      setIsLoading(false)
    }
  }

  const convertUsdToTon = (usdAmount: number): number | null => {
    if (!tonPrice || usdAmount <= 0) return null
    return usdAmount / tonPrice
  }

  const convertTonToUsd = (tonAmount: number): number | null => {
    if (!tonPrice || tonAmount <= 0) return null
    return tonAmount * tonPrice
  }

  const refreshPrice = async () => {
    await fetchTonPrice()
  }

  useEffect(() => {
    fetchTonPrice()

    // Refresh price every 5 minutes
    const interval = setInterval(fetchTonPrice, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  const value: TonPriceContextType = {
    tonPrice,
    convertUsdToTon,
    convertTonToUsd,
    isLoading,
    error,
    refreshPrice
  }

  return (
    <TonPriceContext.Provider value={value}>
      {children}
    </TonPriceContext.Provider>
  )
}

export function useTonPrice() {
  const context = useContext(TonPriceContext)
  if (context === undefined) {
    throw new Error('useTonPrice must be used within a TonPriceProvider')
  }
  return context
}
