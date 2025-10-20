import { Suspense } from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import PostList from "@/components/posts/PostList";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import { getSession } from "@/lib/auth-server";

async function getInitialPosts() {
  const posts = await prisma.post.findMany({
    where: {
      isActive: true,
      OR: [
        { expiresAt: null },
        { expiresAt: { gte: new Date() } },
      ],
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          imageUrl: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 12,
  });

  const total = await prisma.post.count({
    where: {
      isActive: true,
      OR: [
        { expiresAt: null },
        { expiresAt: { gte: new Date() } },
      ],
    },
  });

  return { posts, total };
}

export default async function PostsPage() {
  const session = await getSession();
  const { posts, total } = await getInitialPosts();
  const totalPages = Math.ceil(total / 12);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/user" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au profil
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Annonces</h1>
          <p className="text-muted-foreground mt-1">
            Découvrez toutes les annonces de la communauté
          </p>
        </div>

        {session && (
          <Button asChild>
            <Link href="/posts/create">
              <Plus className="mr-2 h-4 w-4" />
              Créer une annonce
            </Link>
          </Button>
        )}
      </div>

      <Suspense fallback={<div>Chargement...</div>}>
        <PostList
          initialPosts={posts}
          totalPages={totalPages}
          currentPage={1}
        />
      </Suspense>
    </div>
  );
}
