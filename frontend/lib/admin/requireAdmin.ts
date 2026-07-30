import { createClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const adminId = process.env.ADMIN_USER_ID;

  if (!adminId || user.id !== adminId) {
    throw new Error("Forbidden");
  }

  return user;
}