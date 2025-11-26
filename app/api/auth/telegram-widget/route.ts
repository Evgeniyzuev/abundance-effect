import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id, first_name, last_name, username, photo_url, auth_date, hash, referrer_id } = body;

        if (!id || !hash) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Verify Telegram data
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        if (!botToken) {
            return NextResponse.json({ error: 'Bot token not configured' }, { status: 500 });
        }

        // Create data check string
        const dataCheckArr = [];
        for (const [key, value] of Object.entries(body)) {
            if (key !== 'hash' && key !== 'referrer_id' && value) {
                dataCheckArr.push(`${key}=${value}`);
            }
        }
        const dataCheckString = dataCheckArr.sort().join('\n');

        // Verify hash
        const secretKey = crypto.createHash('sha256').update(botToken).digest();
        const hmac = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

        if (hmac !== hash) {
            return NextResponse.json({ error: 'Invalid hash' }, { status: 403 });
        }

        // Check if user exists
        const { data: existingUser } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('telegram_id', id)
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

        // Create new user
        const email = `telegram_${id}@abundance-effect.app`;
        const password = crypto.randomBytes(16).toString('hex');

        let authUser;
        let authUserId;

        try {
            const { data, error } = await supabaseAdmin.auth.admin.createUser({
                email,
                password,
                email_confirm: true,
                user_metadata: {
                    telegram_id: id,
                    username,
                    first_name,
                    last_name,
                    avatar_url: photo_url,
                    referrer_id: referrer_id || null
                }
            });
            if (error) throw error;
            authUser = data.user;
            authUserId = data.user.id;
        } catch (error: any) {
            if (error.message?.includes('already been registered') || error.code === 'email_exists') {
                console.log('User already registered in Auth, recovering...');
                // User exists in Auth but maybe not in public table (or we missed it)
                // We need to get the User ID. We can use generateLink for this.
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
                        telegram_id: id,
                        username,
                        first_name,
                        last_name,
                        avatar_url: photo_url,
                        // Don't update referrer_id on recovery/login if already exists, but here we assume recovery
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

        // 3. Wait a bit for the trigger to create the user record (if it was a new user)
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
                    telegram_id: id,
                    username,
                    first_name,
                    last_name,
                    avatar_url: photo_url,
                    email: email,
                    referrer_id: referrer_id || null
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
        console.error('Telegram widget auth error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
