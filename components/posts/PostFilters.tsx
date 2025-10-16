"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { PostType } from "@/app/generated/prisma";
import { POST_CATEGORIES, POST_TYPES } from "@/lib/constants/post-categories";
import { PostFilters as PostFiltersType } from "@/types/interfaces/post";

interface PostFiltersProps {
  filters: PostFiltersType;
  onFilterChange: (filters: PostFiltersType) => void;
}

export default function PostFilters({ filters, onFilterChange }: PostFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search || "");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ ...filters, search: searchInput });
  };

  const handleTypeChange = (value: string) => {
    onFilterChange({
      ...filters,
      type: value === "all" ? undefined : (value as PostType),
    });
  };

  const handleCategoryChange = (value: string) => {
    onFilterChange({
      ...filters,
      category: value === "all" ? undefined : value,
    });
  };

  const handleLocationChange = (value: string) => {
    onFilterChange({
      ...filters,
      location: value || undefined,
    });
  };

  const clearFilters = () => {
    setSearchInput("");
    onFilterChange({});
  };

  const hasActiveFilters = filters.type || filters.category || filters.location || filters.search;

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

      <form onSubmit={handleSearchSubmit} className="space-y-2">
        <Label htmlFor="search">Rechercher</Label>
        <div className="flex gap-2">
          <Input
            id="search"
            placeholder="Titre ou description..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <Button type="submit" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </form>

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
        <Label htmlFor="category">Catégorie</Label>
        <Select
          value={filters.category || "all"}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Toutes les catégories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {POST_CATEGORIES.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
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
          onChange={(e) => handleLocationChange(e.target.value)}
        />
      </div>
    </div>
  );
}
