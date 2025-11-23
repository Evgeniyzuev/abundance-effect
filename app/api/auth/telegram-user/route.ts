import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Initialize Supabase Admin Client (requires SERVICE_ROLE_KEY)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { telegramUser, initData } = body;

        if (!telegramUser?.id) {
            return NextResponse.json({ error: 'Missing Telegram user data' }, { status: 400 });
        }

        const telegramId = telegramUser.id;

        // 1. Check if user already exists in public table
        const { data: existingUser } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('telegram_id', telegramId)
            .maybeSingle();

        if (existingUser) {
            // User exists, update password to allow login
            const password = crypto.randomBytes(16).toString('hex');

            const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
                existingUser.id,
                { password: password }
            );

            if (updateError) {
                console.error('Error updating user password:', updateError);
                return NextResponse.json({ error: 'Auth update error' }, { status: 500 });
            }

            return NextResponse.json({
                success: true,
                user: existingUser,
                auth_user_id: existingUser.id,
                password: password
            });
        }

        // 2. Create new Supabase Auth User
        const email = `telegram_${telegramId}@abundance-effect.app`;
        const password = crypto.randomBytes(16).toString('hex');

        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                telegram_id: telegramId,
                username: telegramUser.username,
                first_name: telegramUser.first_name,
                last_name: telegramUser.last_name,
                avatar_url: telegramUser.photo_url
            }
        });

        if (authError) throw authError;

        // 3. Wait a bit for the trigger to create the user record
        await new Promise(resolve => setTimeout(resolve, 500));

        // 4. Fetch the created user
        const { data: newUser, error: dbError } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('id', authUser.user.id)
            .single();

        if (dbError) {
            console.error('Error fetching created user:', dbError);
            // The trigger should have created it, but if not, we have a problem
            return NextResponse.json({ error: 'User creation failed' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            user: newUser,
            auth_user_id: authUser.user.id,
            password: password // Return password so client can sign in
        });

    } catch (error: any) {
        console.error('Auth error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
