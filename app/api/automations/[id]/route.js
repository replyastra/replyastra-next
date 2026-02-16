// app/api/automations/[id]/route.js

import { getAuthUser, unauthorized, forbidden, serverError } from "@/lib/authMiddleware";

// PATCH — toggle active/paused
export async function PATCH(req, { params }) {
  const { user, supabase, error } = await getAuthUser();
  if (error) return unauthorized();

  const { id } = params;
  const body = await req.json();
  const { active } = body;

  // Verify ownership
  const { data: existing } = await supabase.from("automations").select("id, status").eq("id", id).eq("user_id", user.id).single();
  if (!existing) return forbidden("Automation not found");

  // Cannot toggle if disabled by system
  if (existing.status === "disabled_by_system") {
    return forbidden("This automation was disabled by the system. Please fix the issue first.");
  }

  const newStatus = active ? "active" : "paused_by_user";

  const { data, error: updateErr } = await supabase
    .from("automations")
    .update({ active, status: newStatus })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (updateErr) return serverError();
  return Response.json({ automation: data });
}

// DELETE — remove automation
export async function DELETE(req, { params }) {
  const { user, supabase, error } = await getAuthUser();
  if (error) return unauthorized();

  const { id } = params;

  const { error: deleteErr } = await supabase
    .from("automations")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (deleteErr) return serverError();
  return Response.json({ success: true });
}
