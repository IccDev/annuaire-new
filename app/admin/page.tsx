import { Suspense } from "react";
import StatsCards from "@/components/admin/StatsCards";
import UserGrowthChart from "@/components/admin/UserGrowthChart";
import RoleDistribution from "@/components/admin/RoleDistribution";
import RecentActivity from "@/components/admin/RecentActivity";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-700 via-slate-600 to-slate-800 bg-clip-text text-transparent">
            Tableau de bord
          </h1>
          <p className="text-slate-600 mt-1 flex items-center space-x-2">
            {/* <TrendingUp className="w-4 h-4 text-slate-500" /> */}
            <span>Vue d'ensemble de la plateforme</span>
          </p>
        </div>
      </div>

      <Suspense fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      }>
        <StatsCards />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Suspense fallback={<Skeleton className="h-80 rounded-xl" />}>
          <UserGrowthChart />
        </Suspense>

        <Suspense fallback={<Skeleton className="h-80 rounded-xl" />}>
          <RoleDistribution />
        </Suspense>
      </div>

      <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
        <RecentActivity />
      </Suspense>
    </div>
  );
}
