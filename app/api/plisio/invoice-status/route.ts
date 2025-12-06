import { NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/utils/supabase/server'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const sessionId = url.searchParams.get('sessionId')

    if (!sessionId) return NextResponse.json({ status: 'error', message: 'sessionId required' }, { status: 400 })

    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from('pending_deposits')
      .select('id, user_id, session_id, amount_usd, processed_transaction_hash, attempts, created_at, updated_at')
      .eq('session_id', sessionId)
      .single()

    if (error || !data) return NextResponse.json({ status: 'error', message: 'not found' }, { status: 404 })

    let status = 'waiting'
    if (data.processed_transaction_hash) status = 'completed'
    else if ((data.attempts || 0) >= 50) status = 'failed_or_expired'

    return NextResponse.json({ status: 'success', data: { status, ...data } })
  } catch (e: any) {
    console.error('invoice-status error', e)
    return NextResponse.json({ status: 'error', message: e?.message || 'Server error' }, { status: 500 })
  }
}
