import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth-server";
import PostCard from "@/components/posts/PostCard";
import PostStats from "@/components/posts/PostStats";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

async function getUserPosts(userId: string) {
  const posts = await prisma.post.findMany({
    where: { authorId: userId },
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
  });

  const activePosts = posts.filter((p) => p.isActive);
  const inactivePosts = posts.filter((p) => !p.isActive);
  const totalViews = posts.reduce((sum, p) => sum + p.views, 0);

  return {
    posts,
    activePosts,
    inactivePosts,
    totalViews,
  };
}

export default async function MyPostsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const { posts, activePosts, inactivePosts, totalViews } = await getUserPosts(
    session.user.id
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/posts">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux annonces
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Mes annonces</h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos annonces publiées
          </p>
        </div>

        <Button asChild>
          <Link href="/posts/create">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle annonce
          </Link>
        </Button>
      </div>

      <div className="mb-8">
        <PostStats
          totalPosts={posts.length}
          activePosts={activePosts.length}
          inactivePosts={inactivePosts.length}
          totalViews={totalViews}
        />
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            Vous n'avez pas encore créé d'annonce
          </p>
          <Button asChild>
            <Link href="/posts/create">
              <Plus className="mr-2 h-4 w-4" />
              Créer ma première annonce
            </Link>
          </Button>
        </div>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">
              Toutes ({posts.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Actives ({activePosts.length})
            </TabsTrigger>
            <TabsTrigger value="inactive">
              Archivées ({inactivePosts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="active">
            {activePosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Aucune annonce active
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activePosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="inactive">
            {inactivePosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Aucune annonce archivée
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inactivePosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
