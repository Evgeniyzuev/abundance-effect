# Supabase Configuration Guide

## Authentication URL Configuration

To ensure proper OAuth redirects in both development and production environments, you need to configure the following settings in your Supabase project:

### 1. Access Supabase Dashboard

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project: `tmwcjfgxxpmgdqqlhhuh`
3. Navigate to **Authentication** → **URL Configuration**

### 2. Configure URLs

#### Site URL
This is the main URL of your application. Set it to your production URL:

```
https://your-domain.vercel.app
```

**Important:** Replace `your-domain.vercel.app` with your actual Vercel deployment URL.

#### Redirect URLs
These are the allowed callback URLs after OAuth authentication. Add both development and production URLs:

```
http://localhost:3000/auth/callback
https://your-domain.vercel.app/auth/callback
```

**Note:** You can add multiple URLs separated by commas or new lines.

### 3. Google OAuth Provider Configuration

Make sure Google OAuth is enabled:

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Find **Google** and click to configure
3. Ensure it's **Enabled**
4. Verify your Google OAuth credentials are set:
   - Client ID
   - Client Secret

### 4. Troubleshooting

#### Issue: Redirects to localhost:3000 in production

**Cause:** The Site URL in Supabase is set to `http://localhost:3000`

**Solution:** 
1. Update Site URL to your production URL
2. Add production callback URL to Redirect URLs
3. Wait a few minutes for changes to propagate

#### Issue: "Invalid redirect URL" error

**Cause:** The callback URL is not in the allowed Redirect URLs list

**Solution:**
1. Add the callback URL to Redirect URLs in Supabase
2. Ensure the URL format matches exactly (including protocol: http/https)

### 5. Environment Variables

Ensure your `.env.local` file contains:

```env
NEXT_PUBLIC_SUPABASE_URL="https://tmwcjfgxxpmgdqqlhhuh.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

For production (Vercel), set these as environment variables in your Vercel project settings.

### 6. Vercel Deployment

After updating Supabase configuration:

1. Redeploy your Vercel application (or wait for automatic deployment)
2. Test the Google OAuth flow on your production URL
3. Verify you're redirected back to your production domain, not localhost

## Current Configuration

- **Supabase Project:** tmwcjfgxxpmgdqqlhhuh
- **Supabase URL:** https://tmwcjfgxxpmgdqqlhhuh.supabase.co
- **Callback Route:** /auth/callback
- **Supported Providers:** Google, Telegram (Widget)
