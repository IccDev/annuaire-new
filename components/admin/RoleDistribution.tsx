"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { Users, Crown, UserCheck } from "lucide-react";
import { useEffect, useState } from "react";

interface RoleData {
  name: string;
  value: number;
  color: string;
  icon: any;
}

const chartConfig = {
  value: {
    label: "Nombre",
  },
  Utilisateurs: {
    label: "Utilisateurs",
    color: "#3b82f6",
  },
  Référents: {
    label: "Référents", 
    color: "#10b981",
  },
  Admins: {
    label: "Admins",
    color: "#f59e0b",
  },
} satisfies ChartConfig;

export default function RoleDistribution() {
  const [roleData, setRoleData] = useState<RoleData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoleData();
  }, []);

  const fetchRoleData = async () => {
    try {
      const response = await fetch('/api/admin/role-distribution');
      if (response.ok) {
        const data = await response.json();
        const formattedData = [
          { name: "Utilisateurs", value: data.users, color: "#3b82f6", icon: Users },
          { name: "Référents", value: data.referents, color: "#10b981", icon: UserCheck },
          { name: "Admins", value: data.admins, color: "#f59e0b", icon: Crown },
        ].filter(item => item.value > 0);
        setRoleData(formattedData);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la répartition des rôles:', error);

      setRoleData([
        { name: "Utilisateurs", value: 1, color: "#3b82f6", icon: Users }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-xl shadow-slate-500/5 bg-white/80 backdrop-blur-sm">
        <div className="h-80 flex items-center justify-center">
          <div className="animate-pulse text-slate-500">Chargement...</div>
        </div>
      </Card>
    );
  }
  return (
    <Card className="border-0 shadow-xl shadow-slate-500/5 bg-white/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-semibold bg-gradient-to-r from-emerald-700 to-teal-900 bg-clip-text text-transparent">
            Répartition des rôles
          </CardTitle>
          <CardDescription className="text-slate-500 mt-1">
            Distribution des utilisateurs par rôle
          </CardDescription>
        </div>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center">
          <Users className="w-4 h-4 text-white" />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex items-center justify-center">
            <ChartContainer
              config={chartConfig}
              className="w-full h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {roleData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                      />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    content={<ChartTooltipContent />} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          <div className="space-y-4">
            {roleData.map((role, index) => {
              const Icon = role.icon;
              return (
                <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-white/80 to-slate-50/50 border border-slate-100/50 hover:shadow-md transition-all">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-semibold shadow-lg"
                      style={{ backgroundColor: role.color }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-slate-700">{role.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-slate-800">{role.value}</div>
                    <div className="text-xs text-slate-500">
                      {role.name === "Utilisateurs" ? "" : 
                       role.name === "Référents" ? "" : ""}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
