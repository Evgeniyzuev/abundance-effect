'use server'

import { createClient } from '@/utils/supabase/server'
import { AvatarSettings } from '@/types'
import { revalidatePath } from 'next/cache'

export type ActionResponse<T = any> = {
    success: boolean
    data?: T
    error?: string
}

/**
 * Fetch avatar settings for the current user
 */
export async function getAvatarSettingsAction(): Promise<ActionResponse<AvatarSettings>> {
    try {
        const supabase = await createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            return { success: false, error: 'Unauthorized' }
        }

        const { data, error } = await supabase
            .from('avatar_settings')
            .select('*')
            .eq('user_id', user.id)
            .single()

        if (error) {
            // If not found, it might be the first time. 
            // The trigger should have created it if there was a balance increase,
            // but for a new user we might need to return default or empty.
            if (error.code === 'PGRST116') {
                return { success: true, data: null as any }
            }
            throw error
        }

        return { success: true, data: data as AvatarSettings }
    } catch (error: any) {
        console.error('Error fetching avatar settings:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Update avatar settings (base type, style, photo)
 */
export async function updateAvatarSettingsAction(settings: Partial<AvatarSettings>): Promise<ActionResponse<AvatarSettings>> {
    try {
        const supabase = await createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            return { success: false, error: 'Unauthorized' }
        }

        const { data, error } = await supabase
            .from('avatar_settings')
            .upsert({
                ...settings,
                user_id: user.id,
                updated_at: new Date().toISOString()
            })
            .select()
            .single()

        if (error) throw error

        revalidatePath('/ai')
        return { success: true, data: data as AvatarSettings }
    } catch (error: any) {
        console.error('Error updating avatar settings:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Spend virtual avatar wallet (for generation etc.)
 */
export async function spendAvatarWalletAction(amount: number): Promise<ActionResponse<boolean>> {
    try {
        const supabase = await createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            return { success: false, error: 'Unauthorized' }
        }

        const { data, error } = await supabase.rpc('spend_avatar_wallet', {
            p_user_id: user.id,
            p_amount: amount
        })

        if (error) throw error

        if (!data) {
            return { success: false, error: 'Insufficient virtual funds' }
        }

        revalidatePath('/ai')
        return { success: true, data: true }
    } catch (error: any) {
        console.error('Error spending avatar wallet:', error)
        return { success: false, error: error.message }
    }
}

import { GoogleGenerativeAI } from '@google/generative-ai'
import { AvatarVision } from '@/types'

const genAI = process.env.GOOGLE_GENERATIVE_AI_KEY
    ? new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_KEY)
    : null;

/**
 * Fetch avatar visions (gallery) for current user
 */
export async function getAvatarVisionsAction(): Promise<ActionResponse<AvatarVision[]>> {
    try {
        const supabase = await createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            return { success: false, error: 'Unauthorized' }
        }

        const { data, error } = await supabase
            .from('avatar_visions')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (error) throw error

        return { success: true, data: data as AvatarVision[] }
    } catch (error: any) {
        console.error('Error fetching avatar visions:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Update vision image URL (for cloud sync)
 */
export async function updateVisionUrlAction(visionId: string, imageUrl: string): Promise<ActionResponse<boolean>> {
    try {
        const supabase = await createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            return { success: false, error: 'Unauthorized' }
        }

        const { error } = await supabase
            .from('avatar_visions')
            .update({ image_url: imageUrl })
            .eq('id', visionId)
            .eq('user_id', user.id);

        if (error) throw error;

        revalidatePath('/ai');
        return { success: true, data: true };
    } catch (error: any) {
        console.error('Error updating vision URL:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Delete an avatar vision
 */
export async function deleteAvatarVisionAction(visionId: string): Promise<ActionResponse<boolean>> {
    try {
        const supabase = await createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            return { success: false, error: 'Unauthorized' }
        }

        const { error } = await supabase
            .from('avatar_visions')
            .delete()
            .eq('id', visionId)
            .eq('user_id', user.id);

        if (error) throw error;

        revalidatePath('/ai');
        return { success: true, data: true };
    } catch (error: any) {
        console.error('Error deleting avatar vision:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Refine prompt for vision (preview only, no cost)
 */
export async function refineVisionPromptAction(wishId?: string, customDescription?: string): Promise<ActionResponse<string>> {
    try {
        if (!genAI) {
            return { success: false, error: 'AI Generator not configured' }
        }

        const supabase = await createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            return { success: false, error: 'Unauthorized' }
        }

        const [settingsResult, wishResult] = await Promise.all([
            supabase.from('avatar_settings').select('*').eq('user_id', user.id).single(),
            wishId ? supabase.from('user_wishes').select('*').eq('id', wishId).single() : Promise.resolve({ data: null })
        ]);

        const settings = settingsResult.data;
        const wish = wishResult.data;
        const style = settings?.style || 'realistic';
        const baseType = settings?.base_type || 'man';
        const baseTitle = wish?.title || customDescription || 'My Bright Future';

        const promptRequest = `
            Task: Create a highly detailed Stable Diffusion prompt (English) to visualize a person's wish for the future.
            
            Context:
            - Wish/Goal: "${baseTitle}"
            - Person Type: "${baseType}"
            - Visual Style: "${style}" (Options: realistic, cyberpunk, pixar, anime)
            
            Instructions:
            - Describe a successful, happy ${baseType} enjoying their achieved goal: "${baseTitle}".
            - The scene should be vibrant, inspiring, and full of "Abundance".
            - Include specific lighting, environment, and architectural details matching the "${style}" style.
            - Focus on the high-quality details, 8k, masterpiece, cinematic.
            - If style is 'cyberpunk', add neon lights and futuristic tech.
            - If style is 'pixar', add 3D cartoon charm and expressive emotions.
            - If style is 'anime', add hand-drawn aesthetic and dramatic atmosphere.
            - Return ONLY the final prompt text without any explanations or quotes.
        `;

        let refinedPrompt = '';
        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const result = await model.generateContent(promptRequest);
            refinedPrompt = result.response.text().trim();
        } catch (e) {
            // Groq fallback
            const groqKey = process.env.GROQ_API_KEY;
            if (groqKey) {
                try {
                    const Groq = (await import('groq-sdk')).default;
                    const groq = new Groq({ apiKey: groqKey });
                    const completion = await groq.chat.completions.create({
                        messages: [{ role: 'user', content: promptRequest }],
                        model: 'llama-3.3-70b-versatile',
                    });
                    refinedPrompt = completion.choices[0]?.message?.content?.trim() || '';
                } catch (er) {
                    console.error('Groq fallback error', er);
                }
            }
        }

        if (!refinedPrompt) {
            refinedPrompt = `A high-quality ${style} style visualization of ${baseTitle}, vibrant colors, abundance aesthetic, cinematic lighting, 8k.`;
        }

        return { success: true, data: refinedPrompt };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Generate Vision Image
 */
export async function generateVisionImageAction(
    wishId?: string,
    customDescription?: string,
    predefinedPrompt?: string
): Promise<ActionResponse<AvatarVision>> {
    try {
        const supabase = await createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
            return { success: false, error: 'Unauthorized' }
        }

        // 2. Fetch context
        const [settingsResult, wishResult] = await Promise.all([
            supabase.from('avatar_settings').select('*').eq('user_id', user.id).single(),
            wishId ? supabase.from('user_wishes').select('*').eq('id', wishId).single() : Promise.resolve({ data: null })
        ]);

        if (settingsResult.error) throw new Error('Settings not found');
        const settings = settingsResult.data;
        const wish = wishResult.data;

        // 3. Dynamic Cost Calculation (Min 100 FW)
        // Check if this wish was already visualized to allow 100 FW regeneration
        let isRegen = false;
        if (wishId) {
            const { count } = await supabase
                .from('avatar_visions')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .eq('wish_id', wishId);
            isRegen = (count ?? 0) > 0;
        }

        const cleanCostStr = wish?.estimated_cost?.replace(/[^0-9.]/g, '') || '0';
        const rawCost = parseFloat(cleanCostStr);
        const COST = isRegen ? 100 : (rawCost > 0 ? Math.max(100, Math.ceil(rawCost)) : 100);

        if (settings.avatar_wallet < COST) {
            return { success: false, error: `Insufficient virtual funds ($${COST.toLocaleString()} FW required)` }
        }

        // 4. Use or Generate Prompt
        let refinedPrompt = predefinedPrompt;
        if (!refinedPrompt) {
            const refineRes = await refineVisionPromptAction(wishId, customDescription);
            if (!refineRes.success || !refineRes.data) throw new Error(refineRes.error || 'Failed to generate prompt');
            refinedPrompt = refineRes.data;
        }

        // 5. Pollinations URL
        const seed = Math.floor(Math.random() * 1000000);
        const encodedPrompt = encodeURIComponent(refinedPrompt);
        const pollinationsKey = process.env.POLINATIONS_API_KEY;
        const imageModel = settings.preferred_image_model || 'flux';

        const imageUrl = `https://gen.pollinations.ai/image/${encodedPrompt}?width=1024&height=1024&nologo=true&enhance=false&seed=${seed}&model=${imageModel}${pollinationsKey ? `&key=${pollinationsKey}` : ''}`;

        // 6. Deduct and Save
        const spendResult = await supabase.rpc('spend_avatar_wallet', { p_user_id: user.id, p_amount: COST });
        if (spendResult.error || !spendResult.data) throw new Error('Payment failed');

        const { data: visionData, error: visionError } = await supabase
            .from('avatar_visions')
            .insert({
                user_id: user.id,
                wish_id: wishId || null,
                prompt: wish?.title || customDescription || 'My Future',
                refined_prompt: refinedPrompt,
                image_url: imageUrl
            })
            .select()
            .single();

        if (visionError) throw visionError;

        revalidatePath('/ai');
        return { success: true, data: visionData as AvatarVision };

    } catch (error: any) {
        return { success: false, error: error.message }
    }
}
