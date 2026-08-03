import { cache } from "react";

import { createClient } from "@/lib/supabase/server";

export const requireAdmin = cache(async () => {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized");
  }

  const adminId = process.env.ADMIN_USER_ID;

  if (!adminId || user.id !== adminId) {
    throw new Error("Forbidden");
  }

  return user;
});