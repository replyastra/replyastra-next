// app/api/instagram/accounts/[id]/route.js
import { getAuthUser, unauth, forbid, fail } from "@/lib/authMiddleware";

export const runtime = "edge";

export async function DELETE(req, { params }) {
  const { user, supabase, error } = await getAuthUser();
  if (error) return unauth();

  const { id } = params;
  const { data: account } = await supabase.from("instagram_accounts").select("id").eq("id", id).eq("user_id", user.id).single();
  if (!account) return forbid("Account not found");

  await supabase.from("automations")
    .update({ status: "disabled_by_system", active: false, last_error: "Instagram account disconnected" })
    .eq("account_id", id).eq("user_id", user.id);

  await supabase.from("instagram_accounts").update({ status: "disconnected" }).eq("id", id).eq("user_id", user.id);
  return Response.json({ success: true });
}
