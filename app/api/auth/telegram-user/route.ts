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
        const { telegramUser, initData, referrerId } = body;

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

            // If referrerId is provided and user doesn't have one, update it
            if (referrerId && !existingUser.referrer_id) {
                console.log('Setting referrer_id for existing Telegram Mini App user:', existingUser.telegram_id, 'referrer:', referrerId);
                const { error: referrerUpdateError } = await supabaseAdmin
                    .from('users')
                    .update({ referrer_id: referrerId })
                    .eq('id', existingUser.id);

                if (referrerUpdateError) {
                    console.error('Error updating referrer_id for existing user:', referrerUpdateError);
                } else {
                    // Update the returned user object to reflect the change
                    existingUser.referrer_id = referrerId;
                }
            }

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
                    avatar_url: telegramUser.photo_url,
                    referrer_id: referrerId || null
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
                        avatar_url: telegramUser.photo_url,
                        referrer_id: referrerId || null
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
                    email: email,
                    referrer_id: referrerId ? referrerId : null
                })
                .select()
                .single();

            if (insertError) {
                console.error('Error inserting public user:', insertError);
                return NextResponse.json({ error: 'User creation failed' }, { status: 500 });
            }
            newUser = insertedUser;
        } else if (referrerId && !newUser.referrer_id) {
            // Trigger fired but didn't set referrer_id (because it wasn't in user_metadata initially)
            // Update the referrer_id now
            console.log('Updating referrer_id for user created by trigger:', newUser.telegram_id, 'referrer:', referrerId);
            const { error: updateError } = await supabaseAdmin
                .from('users')
                .update({ referrer_id: referrerId })
                .eq('id', authUserId);

            if (updateError) {
                console.error('Error updating referrer_id after trigger:', updateError);
            } else {
                newUser.referrer_id = referrerId;
            }
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
