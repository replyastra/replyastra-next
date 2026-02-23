import { getAuthUser, unauth, forbid, fail } from "@/lib/authMiddleware";
import { getPlanContext } from "@/lib/planGuards";

export const runtime = "edge";

export async function PATCH(req, { params }) {
  const { user, profile, supabase, error } = await getAuthUser();
  if (error) return unauth();

  const { features } = getPlanContext(profile);
  if (!features.canTagContacts) {
    return forbid("Tagging is available on Starter and Pro plans.");
  }

  try {
    const body = await req.json();
    const tags = Array.isArray(body.tags) ? body.tags.slice(0, 20) : [];

    const { data, error: updateErr } = await supabase
      .from("contacts")
      .update({ tags, updated_at: new Date().toISOString() })
      .eq("id", params.id)
      .eq("owner_user_id", user.id)
      .select()
      .single();

    if (updateErr) return fail();
    return Response.json({ contact: data });
  } catch {
    return fail();
  }
}
