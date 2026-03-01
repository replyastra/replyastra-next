import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

// Verify Webhook (Meta Challenge)
export async function GET(request) {
    const url = new URL(request.url);
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");

    const VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN || "replyastra_webhook_secret_2026";

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
        return new Response(challenge, { status: 200 });
    } else {
        return new Response("Forbidden", { status: 403 });
    }
}

// Handle Incoming Webhook Events
export async function POST(request) {
    const corsHeaders = { "Content-Type": "application/json" };

    try {
        // 1. Parse Paylaod
        const body = await request.json();

        // Log the payload for debugging (Cloudflare Tail)
        console.log("Incoming Meta Webhook:", JSON.stringify(body, null, 2));

        if (body.object === "instagram") {
            for (const entry of body.entry) {
                const igAccountId = entry.id; // The IG Account ID receiving the message

                for (const messagingEvent of entry.messaging) {
                    const senderId = messagingEvent.sender.id; // User sending the DM
                    const recipientId = messagingEvent.recipient.id; // Your IG Account ID

                    // Ignore echoes (messages we sent)
                    if (senderId === igAccountId) continue;

                    // 2. Extract Message Text
                    let messageText = "";
                    let messageType = "text";

                    if (messagingEvent.message) {
                        if (messagingEvent.message.text) {
                            messageText = messagingEvent.message.text;
                        } else if (messagingEvent.message.attachments) {
                            messageType = "attachment";
                            messageText = "[Attachment]";
                        }
                    }

                    if (!messageText && messageType !== "attachment") continue;

                    // 3. Delegate to Background Automation Engine Worker
                    // Because Meta requires a 200 OK within 20 seconds, we should ideally
                    // process complex AI operations in a background job. We'll trigger our edge execution here.
                    const ctx = getRequestContext();
                    if (ctx?.waitUntil) {
                        ctx.waitUntil(processAutomation(igAccountId, senderId, messageText, messageType));
                    } else {
                        await processAutomation(igAccountId, senderId, messageText, messageType);
                    }
                }
            }
            return new Response("EVENT_RECEIVED", { status: 200 });
        } else {
            return new Response("Not Found", { status: 404 });
        }

    } catch (error) {
        console.error("Webhook Error:", error);
        // Always return 200 to Meta so they don't retry incessantly on our internal errors
        return new Response("EVENT_RECEIVED_WITH_ERRORS", { status: 200 });
    }
}

// Temporary inline processing until we move to a dedicated queue/worker
async function processAutomation(igAccountId, senderId, messageText, messageType) {
    const sbUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim().replace(/\/$/, "");
    const sbKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();

    // 1. Get the ReplyAstra User linked to this IG Account
    const { data: accounts } = await fetch(`${sbUrl}/rest/v1/instagram_accounts?ig_account_id=eq.${igAccountId}&select=*`, {
        headers: { apikey: sbKey, Authorization: `Bearer ${sbKey}` }
    }).then(res => res.json());

    const account = accounts?.[0];
    if (!account) return;

    // 2. Contact Sync (Find or create)
    let senderUsername = senderId;
    try {
        const profileRes = await fetch(`https://graph.facebook.com/v19.0/${senderId}?fields=username&access_token=${account.access_token}`);
        if (profileRes.ok) {
            const profileData = await profileRes.json();
            if (profileData.username) senderUsername = profileData.username;
        }
    } catch (e) { }

    const contactRes = await fetch(`${sbUrl}/rest/v1/contacts`, {
        method: "POST",
        headers: { apikey: sbKey, Authorization: `Bearer ${sbKey}`, "Content-Type": "application/json", "Prefer": "return=representation,resolution=merge-duplicates" },
        body: JSON.stringify({
            owner_user_id: account.user_id,
            instagram_username: senderUsername,
            last_interaction_at: new Date().toISOString()
        })
    }).then(res => res.json());

    const contactId = contactRes?.[0]?.id || null;

    // 3. Fetch active automations for the user
    const { data: automations } = await fetch(`${sbUrl}/rest/v1/automations?user_id=eq.${account.user_id}&is_active=eq.true&select=*`, {
        headers: { apikey: sbKey, Authorization: `Bearer ${sbKey}` }
    }).then(res => res.json());

    let matchedAuto = null;
    let replyText = "";

    // Find matching automation
    if (automations && automations.length > 0) {
        const lowerMsg = messageText.toLowerCase();
        matchedAuto = automations.find(a => lowerMsg.includes((a.keyword || "").toLowerCase()));

        if (matchedAuto) {
            replyText = matchedAuto.response_message;

            // Increment hit count
            fetch(`${sbUrl}/rest/v1/automations?id=eq.${matchedAuto.id}`, {
                method: "PATCH",
                headers: { apikey: sbKey, Authorization: `Bearer ${sbKey}`, "Content-Type": "application/json" },
                body: JSON.stringify({ hit_count: (matchedAuto.hit_count || 0) + 1 })
            }).catch(() => { });
        }
    }

    let isAiGenerated = false;

    // 4. Fallback to AI Engine
    if (!matchedAuto) {
        console.log(`No exact match for message from ${senderUsername}. Bypassed to AI Engine queue.`);

        // Fetch user plan and settings
        const profileRes = await fetch(`${sbUrl}/rest/v1/profiles?id=eq.${account.user_id}&select=plan,plan_type`, {
            headers: { apikey: sbKey, Authorization: `Bearer ${sbKey}` }
        }).then(res => res.json()).catch(() => []);

        const plan = profileRes?.[0]?.plan_type || profileRes?.[0]?.plan || "free";

        if (plan === "starter" || plan === "pro") {
            const settingsRes = await fetch(`${sbUrl}/rest/v1/user_ai_settings?user_id=eq.${account.user_id}&select=*`, {
                headers: { apikey: sbKey, Authorization: `Bearer ${sbKey}` }
            }).then(res => res.json()).catch(() => []);

            const settings = settingsRes?.[0] || {};

            if (settings.auto_dm_reply) {
                const tone = settings.tone || "Friendly";
                const length = settings.reply_length || "Medium";
                const inst = settings.custom_instruction || "";

                const sysPrompt = `You are replying to an Instagram DM on behalf of an account. Keep it natural, instagram-friendly, and concise. Tone: ${tone}. Length: ${length}. ${inst ? `Custom Context: ${inst}` : ""}`;

                try {
                    const ctx = getRequestContext();
                    if (ctx?.env?.AI) {
                        const aiResult = await ctx.env.AI.run("@cf/meta/llama-3.2-3b-instruct", {
                            messages: [
                                { role: "system", content: sysPrompt },
                                { role: "user", content: messageText }
                            ],
                            max_tokens: length === "Long" ? 256 : length === "Short" ? 64 : 128
                        });

                        if (aiResult && aiResult.response) {
                            replyText = aiResult.response;
                            isAiGenerated = true;
                        }
                    } else {
                        console.error("No AI Binding found in env.");
                    }
                } catch (e) {
                    console.error("AI Generation failed inline:", e);
                }
            } else {
                console.log(`User ${account.user_id} does not have auto_dm_reply enabled.`);
            }
        } else {
            console.log(`User ${account.user_id} is on free plan, skipping AI.`);
        }
    }

    // 5. Dispatch Reply via Meta Graph API
    if (replyText) {
        const sendRes = await fetch(`https://graph.facebook.com/v19.0/${account.ig_account_id}/messages`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${account.access_token}` },
            body: JSON.stringify({
                recipient: { id: senderId },
                message: { text: replyText }
            })
        });

        let errorMsg = null;
        if (!sendRes.ok) {
            const errData = await sendRes.json();
            errorMsg = errData.error?.message || "Failed to send";
            console.error("Meta Dispatch Error:", errorMsg);
        }

        // 6. Log Transaction in dm_logs
        await fetch(`${sbUrl}/rest/v1/dm_logs`, {
            method: "POST",
            headers: { apikey: sbKey, Authorization: `Bearer ${sbKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: account.user_id,
                contact_id: contactId,
                automation_id: matchedAuto?.id || null,
                instagram_account_id: account.id,
                direction: "outbound",
                message_type: "text",
                message_text: replyText,
                status: sendRes.ok ? "delivered" : "failed",
                error_message: errorMsg,
                is_ai_generated: isAiGenerated
            })
        }).catch(() => { });

        // 7. Increment Monthly Limits
        if (sendRes.ok) {
            fetch(`${sbUrl}/rest/v1/profiles?id=eq.${account.user_id}&select=monthly_dm_count`, {
                headers: { apikey: sbKey, Authorization: `Bearer ${sbKey}` }
            }).then(r => r.json()).then(data => {
                if (data && data[0]) {
                    fetch(`${sbUrl}/rest/v1/profiles?id=eq.${account.user_id}`, {
                        method: "PATCH",
                        headers: { apikey: sbKey, Authorization: `Bearer ${sbKey}`, "Content-Type": "application/json" },
                        body: JSON.stringify({ monthly_dm_count: (data[0].monthly_dm_count || 0) + 1 })
                    }).catch(() => { });
                }
            }).catch(() => { });
        }
    }
}

