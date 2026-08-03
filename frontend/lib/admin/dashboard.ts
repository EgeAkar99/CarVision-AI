import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

export type RecentUser = {
  id: string;
  email: string;
  createdAt: string;
};

export type RecentAnalysis = {
  id: string;
  brand: string;
  model: string;
  score: number;
  recommendation: string;
  createdAt: string;
};

export type AdminDashboardData = {
  totalUsers: number;
  totalAnalyses: number;
  todayAnalyses: number;
  activeUsers: number;
  recentUsers: RecentUser[];
  recentAnalyses: RecentAnalysis[];
};

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const supabase = createAdminClient();

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const activeSince = new Date();
  activeSince.setUTCDate(activeSince.getUTCDate() - 30);

  const [
    usersResult,
    totalAnalysesResult,
    todayAnalysesResult,
    recentAnalysesResult,
  ] = await Promise.all([
    supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    }),
    supabase
      .from("vehicle_analyses")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("vehicle_analyses")
      .select("*", { count: "exact", head: true })
      .gte("created_at", today.toISOString()),
    supabase
      .from("vehicle_analyses")
      .select(
        `
          id,
          vehicle_brand,
          vehicle_model,
          score,
          purchase_recommendation,
          created_at
        `
      )
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  if (usersResult.error) {
    throw new Error(
      `Kullanıcı istatistikleri alınamadı: ${usersResult.error.message}`
    );
  }

  if (totalAnalysesResult.error) {
    throw new Error(
      `Analiz istatistikleri alınamadı: ${totalAnalysesResult.error.message}`
    );
  }

  if (todayAnalysesResult.error) {
    throw new Error(
      `Bugünkü analizler alınamadı: ${todayAnalysesResult.error.message}`
    );
  }

  if (recentAnalysesResult.error) {
    throw new Error(
      `Son analizler alınamadı: ${recentAnalysesResult.error.message}`
    );
  }

  const users = usersResult.data.users;

  const activeUsers = users.filter((user) => {
    if (!user.last_sign_in_at) {
      return false;
    }

    return new Date(user.last_sign_in_at) >= activeSince;
  }).length;

  const recentUsers = [...users]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    )
    .slice(0, 5)
    .map((user) => ({
      id: user.id,
      email: user.email ?? "E-posta yok",
      createdAt: user.created_at,
    }));

  const recentAnalyses = (recentAnalysesResult.data ?? []).map(
    (analysis) => ({
      id: analysis.id,
      brand: analysis.vehicle_brand,
      model: analysis.vehicle_model,
      score: analysis.score,
      recommendation: analysis.purchase_recommendation,
      createdAt: analysis.created_at,
    })
  );

  return {
    totalUsers: usersResult.data.total,
    totalAnalyses: totalAnalysesResult.count ?? 0,
    todayAnalyses: todayAnalysesResult.count ?? 0,
    activeUsers,
    recentUsers,
    recentAnalyses,
  };
}
