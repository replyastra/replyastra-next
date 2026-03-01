import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

export async function GET(request) {
    return new Response("Method not allowed. Use POST.", { status: 405 });
}

export async function POST(request) {
    const corsHeaders = { "Content-Type": "application/json" };

    try {
        const { token } = await request.json();
        if (!token) {
            return new Response(JSON.stringify({ error: "Missing token" }), { status: 400, headers: corsHeaders });
        }

        const sbUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim().replace(/\/$/, "");
        const sbKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();

        // Verify token
        const authRes = await fetch(`${sbUrl}/auth/v1/user`, {
            headers: { apikey: sbKey, Authorization: `Bearer ${token}` },
        });

        if (!authRes.ok) {
            return new Response(JSON.stringify({ error: "Invalid session" }), { status: 401, headers: corsHeaders });
        }

        const user = await authRes.json();
        if (!user || !user.id) {
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404, headers: corsHeaders });
        }

        // Generate OAuth URL
        const APP_ID = process.env.NEXT_PUBLIC_META_APP_ID || "";
        // In production, you would configure NEXT_PUBLIC_BASE_URL (e.g., https://replyastra.online)
        const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || new URL(request.url).origin;
        const REDIRECT_URI = `${BASE_URL}/api/auth/instagram/callback`;

        // Scopes needed for DM automation and reading profile
        const scopes = [
            "instagram_basic",
            "instagram_manage_messages",
            "pages_show_list",
            "pages_read_engagement",
            "pages_manage_metadata"
        ].join(",");

        const oauthUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${APP_ID}&display=page&extras={"setup":{"channel":"IG_API_ONBOARDING"}}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(scopes)}&state=${user.id}`;

        return new Response(JSON.stringify({ url: oauthUrl }), { status: 200, headers: corsHeaders });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
    }
}

