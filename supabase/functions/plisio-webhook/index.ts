/**
 * Supabase Edge Function to receive Plisio callbacks and credit user balances.
 *
 * Expected env vars in Supabase function: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, PLISIO_API_KEY
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok')

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const secretKey = Deno.env.get('PLISIO_API_KEY') ?? ''
    const url = new URL(req.url)
    const jsonFlag = url.searchParams.get('json') === 'true'

    let body: any
    try {
      body = await req.json()
    } catch (e) {
      // If not JSON, try to parse text
      const text = await req.text()
      try { body = JSON.parse(text) } catch { body = {} }
    }

    // Save raw callback for debugging
    const headersObj: Record<string,string> = {}
    for (const [k,v] of req.headers.entries()) headersObj[k] = v

    // Try to find related invoice by order_number or txn_id
    const orderNumber = body.order_number || body.order_id || null
    let invoiceId: number | null = null
    if (orderNumber) {
      const { data: invoice } = await supabase
        .from('plisio_invoices')
        .select('id')
        .eq('order_number', orderNumber)
        .maybeSingle()
      if (invoice?.id) invoiceId = invoice.id
    }

    await supabase.from('plisio_callbacks').insert({ invoice_id: invoiceId, payload: body, headers: headersObj })

    // Validate verify_hash
    const verifyHash = body?.verify_hash
    if (!verifyHash || !secretKey) {
      // Accept and respond so Plisio gets 200 if you prefer, but here we'll validate
      console.warn('Missing verify_hash or PLISIO_API_KEY')
      return new Response('Missing verify_hash or server secret', { status: 422 })
    }

    const ordered = { ...body }
    delete ordered.verify_hash
    const payload = JSON.stringify(ordered)

    // Use Web Crypto API to compute HMAC-SHA1 (works in Deno)
    try {
      const encoder = new TextEncoder()
      const keyData = encoder.encode(secretKey)
      const cryptoKey = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-1' }, false, ['sign'])
      const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(payload))
      const signatureArray = Array.from(new Uint8Array(signatureBuffer))
      const expected = signatureArray.map(b => b.toString(16).padStart(2, '0')).join('')

      if (expected !== verifyHash) {
        console.warn('Plisio webhook signature mismatch')
        return new Response('Invalid signature', { status: 422 })
      }
    } catch (e) {
      console.error('Error computing HMAC via Web Crypto:', e)
      return new Response('Server error', { status: 500 })
    }

    const ipnType = body.ipn_type
    const status = body.status

    if (ipnType === 'invoice') {
      if (status === 'completed') {
        // credit user
        if (!orderNumber) return new Response('Missing order_number', { status: 400 })

        const { data: invoice } = await supabase
          .from('plisio_invoices')
          .select('*')
          .eq('order_number', orderNumber)
          .maybeSingle()

        if (!invoice) {
          console.warn('Invoice record not found for', orderNumber)
          return new Response('Invoice not found', { status: 404 })
        }

        // Call RPC top_up_wallet if available
        try {
          const { error: rpcError } = await supabase.rpc('top_up_wallet', { p_user_id: invoice.user_id, p_amount: invoice.amount_usd })
          if (rpcError) {
            // fallback to manual update
            const { data: userData } = await supabase.from('users').select('wallet_balance').eq('id', invoice.user_id).maybeSingle()
            const currentBalance = Number(userData?.wallet_balance || 0)
            const newBalance = Number((currentBalance + Number(invoice.amount_usd)).toFixed(2))
            await supabase.from('users').update({ wallet_balance: newBalance }).eq('id', invoice.user_id)
          }

          // mark invoice processed
          await supabase.from('plisio_invoices').update({ txn_id: body.txn_id || null, status: 'completed', raw_data: body, updated_at: new Date().toISOString() }).eq('id', invoice.id)

          // Log operation
          await supabase.from('wallet_operations').insert({ user_id: invoice.user_id, amount: invoice.amount_usd, type: 'deposit', description: `Plisio deposit ${body.txn_id || ''}` })
        } catch (e) {
          console.error('Error crediting user via Plisio webhook', e)
          return new Response('Processing error', { status: 500 })
        }

      } else if (['expired', 'cancelled', 'error', 'failed'].includes(status)) {
        // mark invoice failed
        if (orderNumber) {
          await supabase.from('plisio_invoices').update({ status: status, raw_data: body, updated_at: new Date().toISOString() }).eq('order_number', orderNumber)
        }
      }
    }

    return new Response('OK')
  } catch (err) {
    console.error('plisio-webhook function error', err)
    return new Response('Server error', { status: 500 })
  }
})
