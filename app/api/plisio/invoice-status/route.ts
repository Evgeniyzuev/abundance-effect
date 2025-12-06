import { NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/utils/supabase/server'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const sessionId = url.searchParams.get('sessionId')

    if (!sessionId) return NextResponse.json({ status: 'error', message: 'sessionId required' }, { status: 400 })

    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from('plisio_invoices')
      .select('id, user_id, order_number, amount_usd, status, txn_id, created_at, updated_at')
      .eq('order_number', sessionId)
      .single()

    if (error || !data) return NextResponse.json({ status: 'error', message: 'not found' }, { status: 404 })

    let pollStatus = 'waiting'
    if (data.status === 'completed') pollStatus = 'completed'
    else if (['expired', 'cancelled', 'error', 'failed'].includes(data.status)) pollStatus = 'failed_or_expired'

    return NextResponse.json({ status: 'success', data: { poll_status: pollStatus, invoice_status: data.status, ...data } })
  } catch (e: any) {
    console.error('invoice-status error', e)
    return NextResponse.json({ status: 'error', message: e?.message || 'Server error' }, { status: 500 })
  }
}
