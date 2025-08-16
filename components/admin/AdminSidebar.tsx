"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  BarChart3, 
  Settings, 
  Menu,
  Sparkles,
  Crown,
  LogOut,
  Home
} from "lucide-react";
import { signOut } from "@/lib/auth-client";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AdminSidebarProps {
  user: User;
}

const navigation = [
  {
    name: "Vue d'ensemble",
    href: "/admin",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: "Utilisateurs",
    href: "/admin/users",
    icon: Users,
    badge: null,
  },
  {
    name: "Référents",
    href: "/admin/referents", 
    icon: UserCheck,
    badge: null,
  },
];

function SidebarContent({ user }: { user: User }) {
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/auth/login";
  };

  return (
    <div className="flex h-full flex-col bg-white/80 backdrop-blur-xl border-r border-slate-100/50 shadow-2xl shadow-slate-500/5">
      <div className="flex flex-col space-y-6 p-6 border-b border-slate-100/50">
        <div className="flex items-center space-x-3">
          <div className="relative">
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-slate-700 via-slate-600 to-slate-800 bg-clip-text text-transparent">
              Admin panel
            </h1>
            <p className="text-xs text-slate-500">Tableau de bord</p>
          </div>
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200/50">
          <Avatar className="w-10 h-10 ring-2 ring-slate-200">
            <AvatarImage src="/images/avatar.png" alt={user.name} />
            <AvatarFallback className="bg-gradient-to-br from-slate-500 to-slate-700 text-white font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
            <div className="flex items-center space-x-2">
              <Badge className="bg-gradient-to-r from-slate-600 to-slate-800 text-white text-xs px-2 py-0.5 hover:from-slate-700 hover:to-slate-900">
                Admin
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "group flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300",
                  isActive
                    ? "bg-gradient-to-r from-slate-600 to-slate-800 text-white shadow-lg shadow-slate-500/25 scale-[1.02]"
                    : "text-slate-600 hover:text-slate-900 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 hover:scale-[1.01]"
                )}
              >
                <div className="flex items-center space-x-3">
                  <Icon 
                    className={cn(
                      "w-5 h-5 transition-transform duration-300",
                      isActive ? "scale-110" : "group-hover:scale-105"
                    )} 
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <Badge 
                    className={cn(
                      "text-xs font-semibold",
                      isActive 
                        ? "bg-white/20 text-white border-white/20" 
                        : "bg-slate-100 text-slate-700 border-slate-200"
                    )}
                  >
                    {item.badge}
                  </Badge>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 space-y-2 border-t border-slate-100/50">
        <Link href="/user">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-slate-600 hover:text-slate-900 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100"
          >
            <Home className="mr-3 h-4 w-4" />
            Retour au profil
          </Button>
        </Link>
        <Button 
          onClick={handleLogout}
          variant="ghost" 
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Se déconnecter
        </Button>
      </div>
    </div>
  );
}

export default function AdminSidebar({ user }: AdminSidebarProps) {
  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="fixed top-4 right-4 z-50 lg:hidden bg-white/80 backdrop-blur-sm border border-slate-200 hover:bg-slate-50 shadow-lg"
          >
            <Menu className="h-5 w-5 text-slate-700" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-72 p-0">
          <SheetTitle className="sr-only">Menu de navigation admin</SheetTitle>
          <SidebarContent user={user} />
        </SheetContent>
      </Sheet>

      <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-72 lg:flex-col">
        <SidebarContent user={user} />
      </div>
    </>
  );
}
