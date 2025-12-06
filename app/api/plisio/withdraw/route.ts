import { NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/utils/supabase/server'

type Body = {
  currency: string
  amount: number // crypto amount
  to: string
  feePlan?: string
}

const COINGECKO_MAP: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  USDT: 'tether',
  USDC: 'usd-coin',
  TON: 'toncoin'
}

export async function POST(req: Request) {
  try {
    const body: Body = await req.json()
    const { currency, amount, to, feePlan = 'normal' } = body

    if (!currency || !amount || !to) return NextResponse.json({ status: 'error', message: 'Missing params' }, { status: 400 })

    const supabase = await createServerClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) return NextResponse.json({ status: 'error', message: 'Unauthorized' }, { status: 401 })

    // Convert crypto amount to USD using CoinGecko simple price
    const cgId = COINGECKO_MAP[currency] || null
    let priceUsd = 1
    if (cgId) {
      const priceRes = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${cgId}&vs_currencies=usd`)
      if (!priceRes.ok) throw new Error('Failed to get price from CoinGecko')
      const priceJson = await priceRes.json()
      priceUsd = Number(priceJson[cgId]?.usd || 0)
      if (!priceUsd) priceUsd = 1
    }

    const usdRequired = Number((priceUsd * Number(amount)).toFixed(2))

    // Check user's wallet balance
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('wallet_balance')
      .eq('id', user.id)
      .single()

    if (fetchError) throw fetchError
    const currentBalance = Number(userData.wallet_balance || 0)
    if (currentBalance < usdRequired) return NextResponse.json({ status: 'error', message: 'Insufficient balance' }, { status: 400 })

    // Reserve funds: deduct immediately
    const newBalance = Number((currentBalance - usdRequired).toFixed(2))
    const { error: updateError } = await supabase.from('users').update({ wallet_balance: newBalance }).eq('id', user.id)
    if (updateError) throw updateError

    // Log withdraw request
    const { error: logError } = await supabase.from('wallet_operations').insert({
      user_id: user.id,
      amount: -usdRequired,
      type: 'withdraw_request',
      description: `Plisio withdraw request ${currency} ${amount} to ${to}`
    })

    if (logError) console.error('Failed to log withdraw request', logError)

    // Call Plisio withdraw endpoint
    const apiKey = process.env.PLISIO_API_KEY
    if (!apiKey) throw new Error('Plisio API key not configured')

    const params = new URLSearchParams({
      api_key: apiKey,
      currency,
      type: 'cash_out',
      to,
      amount: String(amount),
      feePlan
    })

    const plisioRes = await fetch(`https://api.plisio.net/api/v1/operations/withdraw?${params.toString()}`)
    const plisioJson = await plisioRes.json()

    if (plisioJson?.status !== 'success') {
      // rollback funds
      await supabase.from('users').update({ wallet_balance: currentBalance }).eq('id', user.id)
      await supabase.from('wallet_operations').insert({
        user_id: user.id,
        amount: 0,
        type: 'withdraw_failed',
        description: `Plisio withdraw failed: ${plisioJson?.data?.message || JSON.stringify(plisioJson)}`
      })
      return NextResponse.json({ status: 'error', data: plisioJson }, { status: 400 })
    }

    // success — log operation result
    await supabase.from('wallet_operations').insert({
      user_id: user.id,
      amount: -usdRequired,
      type: 'withdraw',
      description: `Plisio withdraw ${currency} ${amount} to ${to}`,
      transaction_hash: plisioJson?.data?.id || plisioJson?.data?.tx_url || null
    })

    return NextResponse.json({ status: 'success', data: plisioJson })
  } catch (e: any) {
    console.error('withdraw error', e)
    return NextResponse.json({ status: 'error', message: e?.message || 'Server error' }, { status: 500 })
  }
}
