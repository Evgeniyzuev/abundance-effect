import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const destinationAddress = Deno.env.get('NEXT_PUBLIC_DESTINATION_ADDRESS')
    const apiKey = Deno.env.get('NEXT_PUBLIC_MAINNET_TONCENTER_API_KEY')

    if (!destinationAddress || !apiKey) {
      throw new Error('Missing required environment variables')
    }

    // Get pending deposits with attempts limit
    const { data: pendingDeposits, error: fetchError } = await supabase
      .from('pending_deposits')
      .select('*')
      .is('processed_transaction_hash', null)
      .lt('attempts', 50)
      .order('created_at', { ascending: true })

    if (fetchError) {
      console.error('Error fetching pending deposits:', fetchError)
      throw fetchError
    }

    if (!pendingDeposits || pendingDeposits.length === 0) {
      console.log('No pending deposits to process')
      return new Response(JSON.stringify({ message: 'No pending deposits' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Get recent transactions for destination address
    const apiUrl = `https://toncenter.com/api/v2/getTransactions?address=${destinationAddress}&limit=20&api_key=${apiKey}`

    const apiResponse = await fetch(apiUrl)
    if (!apiResponse.ok) {
      throw new Error(`TON Center API error: ${apiResponse.status}`)
    }

    const apiData = await apiResponse.json()

    if (!apiData.ok || !apiData.result) {
      throw new Error('Invalid API response')
    }

    console.log(`Processing ${pendingDeposits.length} pending deposits, checking ${apiData.result.length} recent transactions`)

    // Process each pending deposit
    for (const deposit of pendingDeposits) {
      try {
        // Find matching transaction
        const matchingTx = apiData.result.find((tx: any) => {
          const txSource = tx.in_msg?.source || ''
          const txValue = parseInt(tx.in_msg?.value || '0')

          const sourceMatches = txSource.toLowerCase() === deposit.sender_address.toLowerCase()
          const valueMatches = txValue === deposit.expected_ton_value

          return sourceMatches && valueMatches
        })

        if (matchingTx) {
          console.log(`Found matching transaction for deposit ${deposit.id}`)

          // Credit the balance
          const { error: creditError } = await supabase.rpc('top_up_wallet', {
            p_user_id: deposit.user_id,
            p_amount: deposit.amount_usd
          })

          if (creditError) {
            console.error(`Error crediting balance for user ${deposit.user_id}:`, creditError)
            continue
          }

          // Log the operation
          const { error: logError } = await supabase
            .from('wallet_operations')
            .insert({
              user_id: deposit.user_id,
              amount: deposit.amount_usd,
              type: 'topup',
              description: 'TON wallet deposit confirmed',
              transaction_hash: matchingTx.transaction_id.hash
            })

          if (logError) {
            console.error('Error logging operation:', logError)
          }

          // Mark as processed
          const { error: updateError } = await supabase
            .from('pending_deposits')
            .update({
              processed_transaction_hash: matchingTx.transaction_id.hash,
              updated_at: new Date().toISOString()
            })
            .eq('id', deposit.id)

          if (updateError) {
            console.error(`Error updating deposit ${deposit.id}:`, updateError)
          }

          console.log(`Successfully processed deposit ${deposit.id} for user ${deposit.user_id}`)
        } else {
          // Increment attempts for deposits that weren't found
          const { error: attemptsError } = await supabase
            .from('pending_deposits')
            .update({
              attempts: (deposit.attempts || 0) + 1,
              updated_at: new Date().toISOString()
            })
            .eq('id', deposit.id)

          if (attemptsError) {
            console.error(`Error incrementing attempts for deposit ${deposit.id}:`, attemptsError)
          }
        }
      } catch (error) {
        console.error(`Error processing deposit ${deposit.id}:`, error)
      }
    }

    return new Response(JSON.stringify({
      message: `Processed ${pendingDeposits.length} pending deposits`,
      processed: pendingDeposits.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Function error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
