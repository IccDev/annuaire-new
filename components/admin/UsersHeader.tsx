"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Search, Filter } from "lucide-react";

interface UsersHeaderProps {
  totalUsers: number;
  onSearchChange: (search: string) => void;
  onRoleFilterChange: (role: string) => void;
}

export default function UsersHeader({ totalUsers, onSearchChange, onRoleFilterChange }: UsersHeaderProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onSearchChange(value);
  };

  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value);
    onRoleFilterChange(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-700 via-slate-600 to-slate-800 bg-clip-text text-transparent">
            Gestion des utilisateurs
          </h1>
          <p className="text-slate-600 mt-1 flex items-center space-x-2">
            <Users className="w-4 h-4 text-slate-500" />
            <span>{totalUsers} utilisateur{totalUsers > 1 ? 's' : ''} au total</span>
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 p-6 bg-white/80 backdrop-blur-sm rounded-xl border-0 shadow-lg shadow-slate-500/5">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Rechercher par nom, email..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 border-slate-200 focus:ring-slate-500 focus:border-slate-500"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
              <SelectTrigger className="w-40 border-slate-200">
                <SelectValue placeholder="Filtrer par rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                <SelectItem value="USER">Utilisateurs</SelectItem>
                <SelectItem value="REFERENT">Référents</SelectItem>
                <SelectItem value="ADMIN">Admins</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
