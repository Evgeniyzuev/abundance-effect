import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PendingNotification {
  id: string
  user_id: string
  telegram_id: string
  message_type: 'daily_interest'
  message_data: {
    interest_amount: number
    date: string
  }
  retry_count: number
}

// Telegram bot configuration
const BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN') ?? ''

/**
 * Send message via Telegram Bot API
 */
async function sendTelegramMessage(chatId: string, text: string): Promise<{ success: boolean; error?: string }> {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`
  const params = new URLSearchParams({
    chat_id: chatId,
    text: text,
    parse_mode: 'HTML'
  })

  try {
    const response = await fetch(`${url}?${params}`)
    const data = await response.json()

    if (!data.ok) {
      throw new Error(`Telegram API error: ${data.description}`)
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Process pending notifications in batches
 */
async function processNotifications(supabase: any) {
  console.log('Processing queued notifications...')

  const maxRetries = 3
  const batchSize = 50

  try {
    // Get pending notifications with low retry count
    const { data: notifications, error: fetchError } = await supabase
      .from('pending_notifications')
      .select('*')
      .eq('status', 'pending')
      .lt('retry_count', maxRetries)
      .order('created_at', { ascending: true })
      .limit(batchSize)

    if (fetchError) throw fetchError

    if (!notifications || notifications.length === 0) {
      console.log('No pending notifications to process')
      return { processed: 0, sent: 0, failed: 0 }
    }

    console.log(`Processing ${notifications.length} notifications...`)

    let sent = 0
    let failed = 0

    for (const notification of notifications as PendingNotification[]) {
      try {
        let messageText = ''

        // Build message based on type
        if (notification.message_type === 'daily_interest') {
          const { interest_amount } = notification.message_data

          // Get current balance from users table
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('aicore_balance')
            .eq('id', notification.user_id)
            .single()

          if (userError || !userData) {
            throw new Error(`Failed to get user balance: ${userError?.message}`)
          }

          const current_balance = userData.aicore_balance || 0

          // Format with proper precision and $ signs
          messageText = `Daily Interest earned: $<code>${interest_amount.toFixed(8)}</code>
Current Core balance: $<code>${current_balance.toFixed(8)}</code>

New challenges and rewards: <a href="https://t.me/AbundanceEffectBot/Abundance">GO!</a>`
        }

        if (!messageText) {
          throw new Error(`Unsupported message type: ${notification.message_type}`)
        }

        // Send message
        const result = await sendTelegramMessage(notification.telegram_id, messageText)

        if (result.success) {
          // Mark as sent
          await supabase
            .from('pending_notifications')
            .update({
              status: 'sent',
              processed_at: new Date().toISOString()
            })
            .eq('id', notification.id)

          sent++
          console.log(`Sent notification to user ${notification.user_id} (${notification.telegram_id})`)
        } else {
          // Increment retry count or mark as failed
          const newRetryCount = notification.retry_count + 1
          const updateData: any = {
            retry_count: newRetryCount,
            error_message: result.error
          }

          if (newRetryCount >= maxRetries) {
            updateData.status = 'failed'
            updateData.processed_at = new Date().toISOString()
          }

          await supabase
            .from('pending_notifications')
            .update(updateData)
            .eq('id', notification.id)

          failed++
          console.log(`Failed to send notification to user ${notification.user_id} (${notification.telegram_id}): ${result.error}`)
        }

      } catch (error) {
        console.error(`Error processing notification ${notification.id}:`, error)

        // Increment retry count
        const newRetryCount = notification.retry_count + 1
        const updateData: any = {
          retry_count: newRetryCount,
          error_message: error instanceof Error ? error.message : 'Unknown error'
        }

        if (newRetryCount >= maxRetries) {
          updateData.status = 'failed'
          updateData.processed_at = new Date().toISOString()
        }

        await supabase
          .from('pending_notifications')
          .update(updateData)
          .eq('id', notification.id)

        failed++
      }
    }

    console.log(`Notifications processing complete. Sent: ${sent}, Failed: ${failed}`)

    return {
      processed: notifications.length,
      sent,
      failed
    }

  } catch (error) {
    console.error('Error processing notifications:', error)
    throw error
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const result = await processNotifications(supabase)

    return new Response(
      JSON.stringify({
        message: 'Notifications processed',
        ...result
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in send-notifications function:', error)

    return new Response(
      JSON.stringify({
        error: error.message || 'Internal server error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
