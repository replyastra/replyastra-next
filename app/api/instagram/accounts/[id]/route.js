// app/api/instagram/accounts/[id]/route.js

import { getAuthUser, unauthorized, forbidden, serverError } from "@/lib/authMiddleware";

// DELETE — disconnect Instagram account
export async function DELETE(req, { params }) {
  const { user, supabase, error } = await getAuthUser();
  if (error) return unauthorized();

  const { id } = params;

  // Verify ownership
  const { data: account } = await supabase
    .from("instagram_accounts")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!account) return forbidden("Account not found");

  // Pause all automations for this account
  await supabase
    .from("automations")
    .update({ status: "disabled_by_system", active: false, last_error: "Instagram account disconnected" })
    .eq("account_id", id)
    .eq("user_id", user.id);

  // Mark account as disconnected
  await supabase
    .from("instagram_accounts")
    .update({ status: "disconnected" })
    .eq("id", id)
    .eq("user_id", user.id);

  return Response.json({ success: true });
}
