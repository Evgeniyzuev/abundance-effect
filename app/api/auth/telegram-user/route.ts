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

        console.log('📡 Incoming Telegram auth data:', {
            telegramUser: telegramUser,
            initDataLength: initData?.length || 0,
            photo_url: telegramUser?.photo_url,
            allFields: Object.keys(telegramUser || {})
        });

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

        let authUser;
        let authUserId;

        try {
            const { data, error } = await supabaseAdmin.auth.admin.createUser({
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
            if (error) throw error;
            authUser = data.user;
            authUserId = data.user.id;
        } catch (error: any) {
            if (error.message?.includes('already been registered') || error.code === 'email_exists') {
                console.log('User already registered in Auth, recovering...');
                const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
                    type: 'magiclink',
                    email: email
                });

                if (linkError || !linkData.user) {
                    console.error('Error finding existing user:', linkError);
                    return NextResponse.json({ error: 'Failed to recover existing user' }, { status: 500 });
                }

                authUserId = linkData.user.id;

                // Update password
                const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(authUserId, {
                    password: password,
                    user_metadata: {
                        telegram_id: telegramId,
                        username: telegramUser.username,
                        first_name: telegramUser.first_name,
                        last_name: telegramUser.last_name,
                        avatar_url: telegramUser.photo_url
                    }
                });

                if (updateError) {
                    console.error('Error updating recovered user:', updateError);
                    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
                }
            } else {
                throw error;
            }
        }

        // 3. Wait a bit for the trigger to create the user record
        await new Promise(resolve => setTimeout(resolve, 500));

        // 4. Fetch or Create the public user record
        let { data: newUser, error: dbError } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('id', authUserId)
            .maybeSingle();

        if (!newUser) {
            // Trigger didn't fire or user was recovered. Manually insert.
            console.log('Creating public user record manually...');
            const { data: insertedUser, error: insertError } = await supabaseAdmin
                .from('users')
                .insert({
                    id: authUserId,
                    telegram_id: telegramId,
                    username: telegramUser.username,
                    first_name: telegramUser.first_name,
                    last_name: telegramUser.last_name,
                    avatar_url: telegramUser.photo_url,
                    email: email
                })
                .select()
                .single();

            if (insertError) {
                console.error('Error inserting public user:', insertError);
                return NextResponse.json({ error: 'User creation failed' }, { status: 500 });
            }
            newUser = insertedUser;
        }

        return NextResponse.json({
            success: true,
            user: newUser,
            auth_user_id: authUserId,
            password: password
        });

    } catch (error: any) {
        console.error('Auth error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
