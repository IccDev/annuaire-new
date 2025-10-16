"use client";

import { useState } from "react";
import PostCard from "./PostCard";
import PostFilters from "./PostFilters";
import { Button } from "@/components/ui/button";
import { PostWithAuthor, PostFilters as PostFiltersType } from "@/types/interfaces/post";
import { Loader2 } from "lucide-react";

interface PostListProps {
  initialPosts: PostWithAuthor[];
  totalPages: number;
  currentPage: number;
}

export default function PostList({
  initialPosts,
  totalPages,
  currentPage,
}: PostListProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [filters, setFilters] = useState<PostFiltersType>({});
  const [page, setPage] = useState(currentPage);
  const [loading, setLoading] = useState(false);

  const handleFilterChange = async (newFilters: PostFiltersType) => {
    setLoading(true);
    setFilters(newFilters);
    setPage(1);

    try {
      const params = new URLSearchParams();
      params.set("page", "1");
      params.set("limit", "12");

      if (newFilters.type) params.set("type", newFilters.type);
      if (newFilters.category) params.set("category", newFilters.category);
      if (newFilters.location) params.set("location", newFilters.location);
      if (newFilters.search) params.set("search", newFilters.search);

      const response = await fetch(`/api/posts?${params.toString()}`);
      const data = await response.json();

      setPosts(data.posts);
    } catch (error) {
      console.error("Erreur lors du filtrage:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    setLoading(true);
    const nextPage = page + 1;

    try {
      const params = new URLSearchParams();
      params.set("page", nextPage.toString());
      params.set("limit", "12");

      if (filters.type) params.set("type", filters.type);
      if (filters.category) params.set("category", filters.category);
      if (filters.location) params.set("location", filters.location);
      if (filters.search) params.set("search", filters.search);

      const response = await fetch(`/api/posts?${params.toString()}`);
      const data = await response.json();

      setPosts([...posts, ...data.posts]);
      setPage(nextPage);
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <aside className="lg:col-span-1">
        <PostFilters filters={filters} onFilterChange={handleFilterChange} />
      </aside>

      <main className="lg:col-span-3">
        {loading && posts.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Aucune annonce trouvée
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {page < totalPages && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={handleLoadMore}
                  disabled={loading}
                  variant="outline"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Charger plus
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
