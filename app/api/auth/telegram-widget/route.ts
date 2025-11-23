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
        const { id, first_name, last_name, username, photo_url, auth_date, hash } = body;

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
            if (key !== 'hash' && value) {
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

        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                telegram_id: id,
                username,
                first_name,
                last_name,
                avatar_url: photo_url
            }
        });

        if (authError) throw authError;

        // Wait for trigger to create user
        await new Promise(resolve => setTimeout(resolve, 500));

        // Fetch created user
        const { data: newUser, error: dbError } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('id', authUser.user.id)
            .single();

        if (dbError) {
            console.error('Error fetching created user:', dbError);
            return NextResponse.json({ error: 'User creation failed' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            user: newUser,
            auth_user_id: authUser.user.id,
            password: password
        });

    } catch (error: any) {
        console.error('Telegram widget auth error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
