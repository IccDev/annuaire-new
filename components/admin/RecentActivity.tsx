import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Activity, UserPlus, UserCheck, Settings, Clock } from "lucide-react";
import prisma from "@/lib/prisma";

async function getRecentActivity() {

  const recentUsers = await prisma.user.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    }
  });

  const activities = recentUsers.map(user => ({
    id: user.id,
    type: 'user_registered',
    user: user.name || 'Utilisateur',
    email: user.email,
    role: user.role,
    time: user.createdAt,
    description: 'Nouvel utilisateur inscrit'
  }));

  return activities;
}

function getActivityIcon(type: string) {
  switch (type) {
    case 'user_registered':
      return UserPlus;
    case 'role_changed':
      return UserCheck;
    case 'invitation_sent':
      return Settings;
    default:
      return Activity;
  }
}

function getActivityColor(type: string) {
  switch (type) {
    case 'user_registered':
      return 'from-slate-500 to-slate-600';
    case 'role_changed':
      return 'from-slate-600 to-slate-700';
    case 'invitation_sent':
      return 'from-slate-400 to-slate-500';
    default:
      return 'from-slate-500 to-slate-600';
  }
}

function formatTimeAgo(date: Date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor(diff / (1000 * 60));

  if (hours > 24) {
    return `${Math.floor(hours / 24)}j`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return 'Maintenant';
  }
}

export default async function RecentActivity() {
  const activities = await getRecentActivity();

  return (
    <Card className="border-0 shadow-xl shadow-slate-500/5 bg-white/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <div>
          <CardTitle className="text-base font-semibold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
            Activité récente
          </CardTitle>
          <CardDescription className="text-slate-500 mt-1">
            Dernières actions sur la plateforme
          </CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          {/* <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center">
            <Activity className="w-4 h-4 text-white" />
          </div> */}
          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
            Live
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = getActivityIcon(activity.type);
            const colorClass = getActivityColor(activity.type);

            return (
              <div key={activity.id} className="group flex items-start space-x-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-amber-50/30 transition-all duration-300 hover:scale-[1.01]">
                {index < activities.length - 1 && (
                  <div className="absolute left-[52px] mt-12 w-0.5 h-8 bg-gradient-to-b from-emerald-200 to-transparent" />
                )}


                <div className={`relative w-10 h-10 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-lg flex-shrink-0`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8 ring-2 ring-white shadow-md">
                        <AvatarImage src="/images/avatar.png" alt={activity.user} />
                        <AvatarFallback className="bg-gradient-to-br from-slate-400 to-slate-500 text-white text-sm">
                          {activity.user.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{activity.user}</p>
                        <p className="text-xs text-slate-500">{activity.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <Badge
                        className={
                          activity.role === 'ADMIN'
                            ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0'
                            : activity.role === 'REFERENT'
                              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                        }
                      >
                        {activity.role}
                      </Badge>
                      <div className="flex items-center space-x-1 text-xs text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimeAgo(activity.time)}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 mt-2">{activity.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-emerald-100/50 text-center">
          <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium hover:underline transition-colors duration-200">
            Voir toute l'activité
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
