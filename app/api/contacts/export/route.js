import { getAuthUser, unauth, forbid, fail } from "@/lib/authMiddleware";
import { getPlanContext } from "@/lib/planGuards";

export const runtime = "edge";

function toCsvValue(v) {
  if (v == null) return "";
  const s = String(v).replace(/"/g, '""');
  return `"${s}"`;
}

export async function GET() {
  const { user, profile, supabase, error } = await getAuthUser();
  if (error) return unauth();

  const { features } = getPlanContext(profile);
  if (!features.canExportContacts) {
    return forbid("Export is available on Starter and Pro plans.");
  }

  try {
    const { data, error: dbErr } = await supabase
      .from("contacts")
      .select("instagram_username,instagram_display_name,interaction_count,follows_you,you_follow,last_interaction_at,tags")
      .eq("owner_user_id", user.id)
      .order("last_interaction_at", { ascending: false });

    if (dbErr) return fail();

    const header = ["username", "display_name", "interaction_count", "follows_you", "you_follow", "last_interaction_at", "tags"];
    const rows = (data || []).map((r) => [
      r.instagram_username,
      r.instagram_display_name,
      r.interaction_count,
      r.follows_you,
      r.you_follow,
      r.last_interaction_at,
      (r.tags || []).join("|"),
    ]);

    const csv = [header, ...rows].map((row) => row.map(toCsvValue).join(",")).join("\n");

    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="replyastra-contacts.csv"',
      },
    });
  } catch {
    return fail();
  }
}
