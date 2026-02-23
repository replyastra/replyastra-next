import { getAuthUser, unauth, fail } from "@/lib/authMiddleware";
import { getPlanContext } from "@/lib/planGuards";

export const runtime = "edge";

export async function GET(req) {
  const { user, profile, supabase, error } = await getAuthUser();
  if (error) return unauth();

  try {
    const { features, plan } = getPlanContext(profile);
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();

    let query = supabase
      .from("contacts")
      .select("id,instagram_username,instagram_display_name,profile_picture_url,captured_via,automation_id,interaction_count,engagement_score,tags,follows_you,you_follow,last_interaction_at,created_at,updated_at", { count: "exact" })
      .eq("owner_user_id", user.id)
      .order("last_interaction_at", { ascending: false });

    if (q) query = query.ilike("instagram_username", `%${q}%`);
    if (features.contactsLimit !== Infinity) query = query.limit(features.contactsLimit);

    const { data, count, error: dbErr } = await query;
    if (dbErr) return fail();

    const contacts = (data || []).map((c) => {
      if (!features.canSeeEngagementScore) {
        const { engagement_score, ...rest } = c;
        return rest;
      }
      return c;
    });

    return Response.json({
      contacts,
      total: count || contacts.length,
      plan,
      features,
      limitedPreview: features.contactsLimit !== Infinity,
    });
  } catch {
    return fail();
  }
}
