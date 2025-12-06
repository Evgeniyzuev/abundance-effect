import { NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const amountUsd = Number(body.amountUsd)

    if (!amountUsd || isNaN(amountUsd) || amountUsd <= 0) {
      return NextResponse.json({ status: 'error', data: { message: 'Invalid amount' } }, { status: 400 })
    }

    // Get server supabase client (reads session cookie) to identify user
    const supabase = await createServerClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ status: 'error', data: { message: 'Unauthorized' } }, { status: 401 })
    }

    const sessionId = `plisio_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`

    // Insert Plisio invoice record in Supabase so callback handler can match it
    const order_name = `wallet_topup_${user.id}_${sessionId}`
    await supabase.from('plisio_invoices').insert({
      user_id: user.id,
      order_number: sessionId,
      order_name: order_name,
      amount_usd: amountUsd,
      status: 'new',
      raw_data: null
    })

    const apiKey = process.env.PLISIO_API_KEY
    const callbackUrl = process.env.PLISIO_CALLBACK_URL

    if (!apiKey || !callbackUrl) {
      return NextResponse.json({ status: 'error', data: { message: 'Plisio not configured on server' } }, { status: 500 })
    }

    const successCallback = process.env.PLISIO_SUCCESS_URL || ''
    const failCallback = process.env.PLISIO_FAIL_URL || ''

    const params = new URLSearchParams({
      api_key: apiKey,
      source_currency: 'USD',
      source_amount: String(amountUsd),
      order_number: sessionId,
      order_name: order_name,
      callback_url: `${callbackUrl}?json=true`,
      success_callback_url: successCallback ? `${successCallback}?json=true` : '',
      fail_callback_url: failCallback ? `${failCallback}?json=true` : '',
      redirect_to_invoice: '0'
    })

    const plisioRes = await fetch(`https://api.plisio.net/api/v1/invoices/new?${params.toString()}`)
    const plisioJson = await plisioRes.json()

    // If Plisio returned error, forward detailed message so frontend can show it
    if (!plisioJson || plisioJson.status !== 'success') {
      console.error('Plisio create-invoice error response:', JSON.stringify(plisioJson))
      return NextResponse.json({ status: 'error', data: plisioJson?.data || plisioJson, session_id: sessionId }, { status: 400 })
    }

    // Return Plisio response along with our session id so frontend can poll status
    return NextResponse.json({
      status: plisioJson.status,
      data: plisioJson.data,
      session_id: sessionId
    })
  } catch (error: any) {
    console.error('create-invoice error', error)
    return NextResponse.json({ status: 'error', data: { message: error?.message || 'Server error' } }, { status: 500 })
  }
}
