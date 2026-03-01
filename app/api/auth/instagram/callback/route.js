import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

export async function GET(request) {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const userId = url.searchParams.get("state"); // Contains the user ID passed from the initial request
    const errorMsg = url.searchParams.get("error_message");

    // Base dashboard URL to redirect back to
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || url.origin;
    const dashboardUrl = `${BASE_URL}/dashboard`;

    if (errorMsg) {
        return Response.redirect(`${dashboardUrl}?error=${encodeURIComponent(errorMsg)}`, 302);
    }

    if (!code || !userId) {
        return Response.redirect(`${dashboardUrl}?error=missing_code_or_state`, 302);
    }

    const APP_ID = process.env.NEXT_PUBLIC_META_APP_ID || "";
    const APP_SECRET = process.env.META_APP_SECRET || "";
    const REDIRECT_URI = `${BASE_URL}/api/auth/instagram/callback`;

    try {
        // 1. Exchange code for short-lived access token
        const tokenRes = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?client_id=${APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&client_secret=${APP_SECRET}&code=${code}`);
        const tokenData = await tokenRes.json();

        if (tokenData.error) {
            console.error("Meta Token Error:", tokenData.error);
            return Response.redirect(`${dashboardUrl}?error=token_exchange_failed`, 302);
        }

        let accessToken = tokenData.access_token;

        // 2. Exchange short-lived token for long-lived token
        const longTokenRes = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${APP_ID}&client_secret=${APP_SECRET}&fb_exchange_token=${accessToken}`);
        const longTokenData = await longTokenRes.json();

        if (longTokenData.access_token) {
            accessToken = longTokenData.access_token;
        }

        // 3. Get Facebook Pages
        const pagesRes = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${accessToken}`);
        const pagesData = await pagesRes.json();

        if (!pagesData.data || pagesData.data.length === 0) {
            return Response.redirect(`${dashboardUrl}?error=no_facebook_pages_found`, 302);
        }

        const sbUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim().replace(/\/$/, "");
        const sbKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();

        let connectedCount = 0;

        // 4. For each page, find connected Instagram Business Account
        for (const page of pagesData.data) {
            const pageId = page.id;
            const pageToken = page.access_token; // Page access token
            const pageName = page.name;

            const igRes = await fetch(`https://graph.facebook.com/v19.0/${pageId}?fields=instagram_business_account&access_token=${pageToken}`);
            const igData = await igRes.json();

            if (igData.instagram_business_account) {
                const igAccountId = igData.instagram_business_account.id;

                // 5. Get Instagram Username
                const igProfileRes = await fetch(`https://graph.facebook.com/v19.0/${igAccountId}?fields=username&access_token=${pageToken}`);
                const igProfileData = await igProfileRes.json();

                const username = igProfileData.username || "Unknown";

                // 6. Save to Supabase using Service Role Key to bypass RLS for inserts
                await fetch(`${sbUrl}/rest/v1/instagram_accounts`, {
                    method: "POST",
                    headers: {
                        "apikey": sbKey,
                        "Authorization": `Bearer ${sbKey}`,
                        "Content-Type": "application/json",
                        "Prefer": "resolution=merge-duplicates"
                    },
                    body: JSON.stringify({
                        user_id: userId,
                        ig_account_id: igAccountId,
                        ig_username: username,
                        page_id: pageId,
                        page_name: pageName,
                        access_token: pageToken // Using page token since it's needed for messaging
                    })
                });

                connectedCount++;
            }
        }

        if (connectedCount === 0) {
            return Response.redirect(`${dashboardUrl}?error=no_instagram_accounts_found`, 302);
        }

        return Response.redirect(`${dashboardUrl}?account_connected=success`, 302);

    } catch (error) {
        console.error("Callback Error:", error);
        return Response.redirect(`${dashboardUrl}?error=internal_server_error`, 302);
    }
}
