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
    const envGet = (k: string) => {
      try {
        // Deno
        if (typeof (globalThis as any).Deno !== 'undefined' && (globalThis as any).Deno?.env?.get) return (globalThis as any).Deno.env.get(k)
      } catch {}
      try {
        // Node-like environments: access via globalThis to avoid TS 'process' name errors
        const proc = (globalThis as any).process
        if (proc && proc.env) return proc.env[k]
      } catch {}
      return undefined
    }

    const SUPABASE_URL = envGet('SUPABASE_URL') ?? ''
    const SUPABASE_SERVICE_ROLE_KEY = envGet('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const secretKey = envGet('PLISIO_API_KEY') ?? ''

    if (!SUPABASE_SERVICE_ROLE_KEY || !SUPABASE_URL) {
      console.error('Missing Supabase environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
      return new Response(JSON.stringify({ error: 'Missing SUPABASE_SERVICE_ROLE_KEY or SUPABASE_URL' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
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

    // If GET request - record debug ping and return 200 so Plisio dashboard can ping URL
    if (req.method === 'GET') {
      try {
        const headersObj: Record<string,string> = {}
        for (const [k,v] of req.headers.entries()) headersObj[k] = v
        await supabase.from('plisio_callbacks').insert({ invoice_id: null, payload: { query: Object.fromEntries(url.searchParams.entries()), method: 'GET' }, headers: headersObj })
      } catch (e) {
        console.warn('Failed to insert debug GET callback:', e)
      }
      return new Response('OK', { status: 200 })
    }

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

    // Persist the raw callback and capture its id for later diagnostics
    const { data: cbData, error: cbError } = await supabase.from('plisio_callbacks').insert({ invoice_id: invoiceId, payload: body, headers: headersObj }).select('id').maybeSingle()
    const callbackRowId = cbData?.id ?? null
    if (cbError) console.warn('Failed to insert plisio_callbacks row:', cbError)

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

        // Idempotency: if invoice already processed, return 200 (ignore duplicate webhook)
        if (invoice.status === 'completed') {
          console.info('Invoice already processed, skipping:', orderNumber)
          return new Response('OK', { status: 200 })
        }

        // Call RPC top_up_wallet if available (should be implemented idempotently server-side if possible)
        try {
          const { error: rpcError } = await supabase.rpc('top_up_wallet', { p_user_id: invoice.user_id, p_amount: invoice.amount_usd })
          if (rpcError) {
            // fallback to manual update
            const { data: userData } = await supabase.from('users').select('wallet_balance').eq('id', invoice.user_id).maybeSingle()
            const currentBalance = Number(userData?.wallet_balance || 0)
            const newBalance = Number((currentBalance + Number(invoice.amount_usd)).toFixed(2))
            await supabase.from('users').update({ wallet_balance: newBalance }).eq('id', invoice.user_id)
          }

          // Try to mark invoice processed only if it's not already completed (conditional update)
          const { data: updatedInvoice, error: invErr } = await supabase.from('plisio_invoices')
            .update({ txn_id: body.txn_id || null, status: 'completed', raw_data: body, updated_at: new Date().toISOString() })
            .eq('id', invoice.id)
            .neq('status', 'completed')
            .select('*')
            .maybeSingle()

          if (invErr) {
            console.error('Failed to update plisio_invoices:', invErr)
            // Attempt to record processing error
            try {
              if (callbackRowId) await supabase.from('plisio_callbacks').update({ headers: { ...headersObj, processing_error: String(invErr?.message ?? invErr) } }).eq('id', callbackRowId)
            } catch (uErr) {
              console.warn('Failed to update plisio_callbacks with invErr', uErr)
            }
            return new Response('Processing error', { status: 500 })
          }

          // If the conditional update returned no row, invoice was processed concurrently — stop here
          if (!updatedInvoice) {
            console.info('Invoice was processed concurrently, skipping op insert for:', orderNumber)
            return new Response('OK', { status: 200 })
          }

          // Log operation and check result so we can surface errors
          const { data: opData, error: opErr } = await supabase.from('wallet_operations').insert({ user_id: invoice.user_id, amount: invoice.amount_usd, type: 'topup', description: `Plisio topup ${body.txn_id || ''}` }).select('id').maybeSingle()
          if (opErr) {
            console.error('Failed to insert wallet_operations:', opErr)
            // Record processing error back to plisio_callbacks for diagnostics if possible
            try {
              if (callbackRowId) await supabase.from('plisio_callbacks').update({ headers: { ...headersObj, processing_error: String(opErr?.message ?? opErr) } }).eq('id', callbackRowId)
            } catch (uErr) {
              console.warn('Failed to update plisio_callbacks with processing error', uErr)
            }
            return new Response('Processing error', { status: 500 })
          }
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
