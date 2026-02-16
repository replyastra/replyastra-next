// app/api/automations/[id]/route.js
import { getAuthUser, unauth, forbid, fail } from "@/lib/authMiddleware";

export const runtime = "edge";

export async function PATCH(req, { params }) {
  const { user, supabase, error } = await getAuthUser();
  if (error) return unauth();

  const { id } = params;
  const body = await req.json();
  const { active } = body;

  const { data: existing } = await supabase.from("automations").select("id,status").eq("id", id).eq("user_id", user.id).single();
  if (!existing) return forbid("Automation not found");
  if (existing.status === "disabled_by_system") return forbid("This automation was disabled by the system.");

  const { data, error: updateErr } = await supabase
    .from("automations")
    .update({ active, status: active ? "active" : "paused_by_user" })
    .eq("id", id).eq("user_id", user.id)
    .select().single();

  if (updateErr) return fail();
  return Response.json({ automation: data });
}

export async function DELETE(req, { params }) {
  const { user, supabase, error } = await getAuthUser();
  if (error) return unauth();

  const { id } = params;
  const { error: deleteErr } = await supabase.from("automations").delete().eq("id", id).eq("user_id", user.id);
  if (deleteErr) return fail();
  return Response.json({ success: true });
}
