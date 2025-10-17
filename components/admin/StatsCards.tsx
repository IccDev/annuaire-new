import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, TrendingUp, Activity, ArrowUp, ArrowDown, FileText } from "lucide-react";
import prisma from "@/lib/prisma";

async function getProfilesStats() {
  try {
    const users = await prisma.user.findMany({
      select: { email: true },
    });

    const checkProfilePromises = users.map(async (user) => {
      try {
        const res = await fetch(
          `http://84.234.16.224:4042/annuaire/query/user_by_email`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ email: user.email }),
            signal: AbortSignal.timeout(5000),
          }
        );

        const data = await res.json();
        return data.data.length > 0;
      } catch (error) {
        return false;
      }
    });

    const results = await Promise.all(checkProfilePromises);
    return results.filter(Boolean).length;
  } catch (error) {
    console.error("Erreur calcul profils:", error);
    return 0;
  }
}

async function getStats() {
  const [
    totalUsers,
    totalReferents,
    usersThisMonth,
    usersLastMonth,
    profilesCompleted
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: { in: ['REFERENT', 'ADMIN'] } } }),
    prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    }),
    prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    }),
    getProfilesStats()
  ]);

  const growth = usersLastMonth > 0 
    ? ((usersThisMonth - usersLastMonth) / usersLastMonth * 100).toFixed(1)
    : "0";

  return {
    totalUsers,
    totalReferents,
    usersThisMonth,
    growth: parseFloat(growth),
    profilesCompleted
  };
}

export default async function StatsCards() {
  const stats = await getStats();

  const cards = [
    {
      title: "Total utilisateurs",
      value: stats.totalUsers.toString(),
      description: "Membres inscrits",
      icon: Users,
      gradient: "bg-slate-900",
      bgGradient: "from-blue-50 to-blue-100/50",
      iconBg: "bg-blue-500",
      trend: null
    },
    {
      title: "Fiches professionnelles", 
      value: stats.profilesCompleted.toString(),
      description: "Profils complétés",
      icon: FileText,
      gradient: "bg-slate-900",
      bgGradient: "from-orange-50 to-amber-100/50", 
      iconBg: "bg-orange-600",
      trend: null
    },
    {
      title: "Référents actifs", 
      value: stats.totalReferents.toString(),
      description: "Référents et admins",
      icon: UserCheck,
      gradient: "bg-slate-900",
      bgGradient: "from-emerald-50 to-emerald-100/50", 
      iconBg: "bg-emerald-600",
      trend: null
    },
    {
      title: "Activité",
      value: stats.usersThisMonth.toString(),
      description: "Nouveaux ce mois",
      icon: Activity,
      gradient: "bg-slate-900",
      bgGradient: "from-violet-50 to-purple-100/50",
      iconBg: "bg-violet-700",
      trend: null
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const TrendIcon = card.trend === "up" ? ArrowUp : card.trend === "down" ? ArrowDown : null;
        
        return (
          <Card key={index} className={`relative overflow-hidden border-0 shadow-xl shadow-slate-500/5 hover:shadow-2xl hover:shadow-slate-500/10 transition-all duration-500 hover:scale-[1.02] bg-gradient-to-br ${card.bgGradient}`}>
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-10 translate-x-10" />
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-8 -translate-x-8" />
            
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-slate-600">
                {card.title}
              </CardTitle>
              {/* <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center shadow-lg`}>
                <Icon className="w-5 h-5 text-white" />
              </div> */}
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="flex items-end space-x-2">
                <div className={`text-3xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
                  {card.value}
                </div>
                {TrendIcon && (
                  <div className={`flex items-center space-x-1 ${card.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    <TrendIcon className="w-4 h-4" />
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{card.description}</p>
                {card.trend && (
                  <Badge 
                    className={`${
                      card.trend === 'up' 
                        ? 'bg-green-100 text-green-700 border-green-200' 
                        : 'bg-red-100 text-red-700 border-red-200'
                    } text-xs`}
                  >
                    {card.trend === 'up' ? 'Hausse' : 'Baisse'}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
