import { NextResponse } from 'next/server'

// Plisio webhook receiver. Verifies HMAC SHA1 verify_hash and processes invoices.
export async function POST(req: Request) {
  try {
    const body = await req.json()

    const ipnType = body?.ipn_type
    const status = body?.status
    const verifyHash = body?.verify_hash
    const secretKey = process.env.PLISIO_API_KEY

    if (!verifyHash || !secretKey) {
      return new Response('Missing verify_hash or server secret', { status: 422 })
    }

    // Verify signature: remove verify_hash, stringify remaining object and HMAC-SHA1
    const ordered = { ...body }
    delete ordered.verify_hash

    // For Node crypto usage
    const crypto = await import('crypto')
    const payload = JSON.stringify(ordered)
    const hmac = crypto.createHmac('sha1', secretKey)
    hmac.update(payload)
    const expected = hmac.digest('hex')

    if (expected !== verifyHash) {
      return new Response('Invalid signature', { status: 401 })
    }

    if (ipnType === 'invoice') {
        // Handle completed
        if (status === 'completed') {
          // We need an admin Supabase client (service role) to credit user balances
          const { createClient: createSupabaseClient } = await import('@supabase/supabase-js')
          const supabaseAdmin = createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '')

          const orderNumber = body.order_number
          if (!orderNumber) {
            return new Response('Missing order_number', { status: 400 })
          }

          // Find pending_deposit by session_id (we used session_id as order_number)
          const { data: pending, error: pendingError } = await supabaseAdmin
            .from('pending_deposits')
            .select('*')
            .eq('session_id', orderNumber)
            .single()

          if (pendingError || !pending) {
            console.warn('Pending deposit not found for order:', orderNumber)
            return new Response('Not found', { status: 404 })
          }

          // Try to credit via RPC; if RPC fails, fallback to manual update
          try {
            const { error: rpcError } = await supabaseAdmin.rpc('top_up_wallet', {
              p_user_id: pending.user_id,
              p_amount: pending.amount_usd
            })

            if (rpcError) {
              const { data: userData, error: userError } = await supabaseAdmin
                .from('users')
                .select('wallet_balance')
                .eq('id', pending.user_id)
                .single()

              if (userError) throw userError

              const newBalance = (userData.wallet_balance || 0) + Number(pending.amount_usd)
              await supabaseAdmin.from('users').update({ wallet_balance: newBalance }).eq('id', pending.user_id)
            }

            // Mark pending_deposit processed with Plisio txn id
            await supabaseAdmin.from('pending_deposits').update({ processed_transaction_hash: body.txn_id, updated_at: new Date().toISOString() }).eq('id', pending.id)

            // Log wallet operation
            await supabaseAdmin.from('wallet_operations').insert({
              user_id: pending.user_id,
              amount: Number(pending.amount_usd),
              type: 'deposit',
              description: `Plisio deposit ${body.txn_id || ''}`
            })
          } catch (e) {
            console.error('Error processing Plisio completed invoice:', e)
            return new Response('Processing error', { status: 500 })
          }

        } else if (['expired', 'cancelled', 'error', 'failed'].includes(status)) {
          // Mark as not going to be processed: set attempts high so verify-deposits won't retry
          const { createClient: createSupabaseClient } = await import('@supabase/supabase-js')
          const supabaseAdmin = createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '')
          const orderNumber = body.order_number
          if (!orderNumber) return new Response('Missing order_number', { status: 400 })

          const { data: pending, error: pendingError } = await supabaseAdmin
            .from('pending_deposits')
            .select('*')
            .eq('session_id', orderNumber)
            .single()

          if (pending && !pendingError) {
            await supabaseAdmin.from('pending_deposits').update({ attempts: 50, updated_at: new Date().toISOString() }).eq('id', pending.id)
            await supabaseAdmin.from('wallet_operations').insert({
              user_id: pending.user_id,
              amount: 0,
              type: 'deposit_failed',
              description: `Plisio invoice ${status}: ${body.comment || ''}`
            })
          }
      } else {
        // Other statuses (new, pending, pending internal) - no immediate action
        console.log('Plisio invoice status update:', status)
      }
    }

    return new Response('OK', { status: 200 })
  } catch (e) {
    console.error('Plisio webhook handler error:', e)
    return new Response('Server error', { status: 500 })
  }
}
