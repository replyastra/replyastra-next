import { getAuthUser, unauth, forbid, fail } from "@/lib/authMiddleware";
import { getPlanContext } from "@/lib/planGuards";

export const runtime = "edge";

export async function POST(req) {
  const { user, profile, supabase, error } = await getAuthUser();
  if (error) return unauth();

  try {
    const { features, plan } = getPlanContext(profile);
    const body = await req.json();

    const instagram_username = (body.instagram_username || "").trim().toLowerCase();
    if (!instagram_username) {
      return Response.json({ error: "instagram_username is required" }, { status: 400 });
    }

    const now = new Date().toISOString();

    const { data: existing } = await supabase
      .from("contacts")
      .select("id,interaction_count")
      .eq("owner_user_id", user.id)
      .eq("instagram_username", instagram_username)
      .maybeSingle();

    if (existing) {
      const interactionCount = (existing.interaction_count || 0) + 1;
      let engagementScore = 0;
      if (plan === "pro") {
        engagementScore += 1;
        if (interactionCount > 1) engagementScore += 2;
        if (body.keyword_triggered) engagementScore += 3;
        const lastDays = Number(body.interaction_within_days || 0);
        if (lastDays > 0 && lastDays <= 7) engagementScore += 5;
      }

      const { data, error: updateErr } = await supabase
        .from("contacts")
        .update({
          interaction_count: interactionCount,
          follows_you: Boolean(body.follows_you),
          you_follow: Boolean(body.you_follow),
          last_interaction_at: now,
          updated_at: now,
          engagement_score: plan === "pro" ? engagementScore : 0,
        })
        .eq("id", existing.id)
        .eq("owner_user_id", user.id)
        .select()
        .single();

      if (updateErr) return fail();
      return Response.json({ contact: data, updated: true });
    }

    if (features.contactsLimit !== Infinity) {
      const { count } = await supabase
        .from("contacts")
        .select("*", { count: "exact", head: true })
        .eq("owner_user_id", user.id);

      if ((count || 0) >= features.contactsLimit) {
        return forbid("Lead preview limit reached.");
      }
    }

    let engagementScore = 0;
    if (plan === "pro") {
      engagementScore += 1;
      if (body.keyword_triggered) engagementScore += 3;
      const lastDays = Number(body.interaction_within_days || 0);
      if (lastDays > 0 && lastDays <= 7) engagementScore += 5;
    }

    const { data, error: insertErr } = await supabase
      .from("contacts")
      .insert([
        {
          owner_user_id: user.id,
          instagram_username,
          instagram_display_name: body.instagram_display_name || null,
          profile_picture_url: body.profile_picture_url || null,
          captured_via: body.captured_via || null,
          automation_id: body.automation_id || null,
          interaction_count: 1,
          engagement_score: plan === "pro" ? engagementScore : 0,
          tags: Array.isArray(body.tags) ? body.tags : [],
          follows_you: Boolean(body.follows_you),
          you_follow: Boolean(body.you_follow),
          last_interaction_at: now,
        },
      ])
      .select()
      .single();

    if (insertErr) return fail();
    return Response.json({ contact: data }, { status: 201 });
  } catch {
    return fail();
  }
}
