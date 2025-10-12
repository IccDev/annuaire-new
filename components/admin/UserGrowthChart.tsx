"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Calendar, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

interface ChartData {
  month: string;
  users: number;
}

const chartConfig = {
  users: {
    label: "Utilisateurs",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function UserGrowthChart() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGrowthData();
  }, []);

  const fetchGrowthData = async () => {
    try {
      const response = await fetch('/api/admin/growth-chart');
      if (response.ok) {
        const data = await response.json();
        setChartData(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données de croissance:', error);
      setChartData([{ month: "Maintenant", users: 1 }]);
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
          <CardTitle className="text-base font-semibold bg-gradient-to-r from-indigo-700 to-blue-900 bg-clip-text text-transparent">
            Croissance des utilisateurs
          </CardTitle>
          <CardDescription className="text-slate-500 mt-1">
            Évolution mensuelle des inscriptions
          </CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-800 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-2">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <ChartTooltip
                cursor={{ stroke: '#4f46e5', strokeWidth: 2, strokeDasharray: '5 5' }}
                content={<ChartTooltipContent />}
              />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#4f46e5"
                strokeWidth={3}
                fill="url(#colorUsers)"
                dot={{ fill: '#4f46e5', strokeWidth: 2, stroke: '#ffffff', r: 4 }}
                activeDot={{ r: 6, stroke: '#4f46e5', strokeWidth: 2, fill: '#ffffff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100/50">
          {/* <div className="flex items-center space-x-2 text-sm text-slate-500">
            <Calendar className="w-4 h-4" />
            <span>Derniers 8 mois</span>
          </div> */}
          {/* <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
            <span className="text-sm text-indigo-600">+28% ce mois</span>
          </div> */}
        </div>
      </CardContent>
    </Card>
  );
}
