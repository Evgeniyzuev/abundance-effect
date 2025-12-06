/**
 * Supabase Edge Function to clean up old Plisio callbacks
 * Deletes all callbacks older than 7 days
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok')

  try {
    const envGet = (k: string) => {
      try {
        if (typeof (globalThis as any).Deno !== 'undefined' && (globalThis as any).Deno?.env?.get) return (globalThis as any).Deno.env.get(k)
      } catch {}
      try {
        const proc = (globalThis as any).process
        if (proc && proc.env) return proc.env[k]
      } catch {}
      return undefined
    }

    const SUPABASE_URL = envGet('SUPABASE_URL') ?? ''
    const SUPABASE_SERVICE_ROLE_KEY = envGet('SUPABASE_SERVICE_ROLE_KEY') ?? ''

    if (!SUPABASE_SERVICE_ROLE_KEY || !SUPABASE_URL) {
      console.error('Missing Supabase environment variables')
      return new Response(JSON.stringify({ error: 'Missing SUPABASE_SERVICE_ROLE_KEY or SUPABASE_URL' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
    }

    // Calculate date 7 days ago
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const cutoffDate = sevenDaysAgo.toISOString()

    // Delete old callbacks using fetch to Supabase REST API
    const deleteResponse = await fetch(`${SUPABASE_URL}/rest/v1/plisio_callbacks?received_at=lt.${cutoffDate}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_ROLE_KEY
      }
    })

    if (!deleteResponse.ok) {
      const errorText = await deleteResponse.text()
      console.error('Failed to delete callbacks:', errorText)
      return new Response(JSON.stringify({ 
        error: 'Failed to delete callbacks', 
        details: errorText,
        status: deleteResponse.status 
      }), { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      })
    }

    const deletedCount = deleteResponse.headers.get('content-range')?.split('/')[1] || 'unknown'
    
    console.log(`Cleaned up callbacks older than ${cutoffDate}, deleted count: ${deletedCount}`)

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Cleaned up callbacks older than ${cutoffDate}`,
      deletedCount: deletedCount,
      cutoffDate: cutoffDate
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (err: any) {
    console.error('cleanup-plisio-callbacks function error', err)
    return new Response(JSON.stringify({ 
      error: 'Server error', 
      message: err?.message || String(err) || 'Unknown error' 
    }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    })
  }
})