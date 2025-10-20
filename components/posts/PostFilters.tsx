"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { PostType } from "@/app/generated/prisma";
import { POST_TYPES } from "@/lib/constants/post-categories";
import { PostFilters as PostFiltersType } from "@/types/interfaces/post";

interface PostFiltersProps {
  filters: PostFiltersType;
  onFilterChange: (filters: PostFiltersType) => void;
}

export default function PostFilters({ filters, onFilterChange }: PostFiltersProps) {
  const handleTypeChange = (value: string) => {
    onFilterChange({
      ...filters,
      type: value === "all" ? undefined : (value as PostType),
    });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      location: e.target.value || undefined,
    });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = filters.type || filters.location;

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filtres</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 px-2"
          >
            <X className="h-4 w-4 mr-1" />
            Réinitialiser
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Type d'annonce</Label>
        <Select
          value={filters.type || "all"}
          onValueChange={handleTypeChange}
        >
          <SelectTrigger id="type">
            <SelectValue placeholder="Tous les types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            {POST_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Localisation</Label>
        <Input
          id="location"
          placeholder="Ville, région..."
          value={filters.location || ""}
          onChange={handleLocationChange}
        />
      </div>
    </div>
  );
}
