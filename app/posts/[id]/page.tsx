import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import PostDetail from "@/components/posts/PostDetail";
import { getSession } from "@/lib/auth-server";
import { incrementPostViews } from "@/actions/post";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function getPost(id: string) {
  const post = await prisma.post.findUnique({
    where: { id },
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
  });

  return post;
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    notFound();
  }

  const session = await getSession();
  const isAuthor = session?.user?.id === post.authorId;
  const isAdmin = session?.user ? 
    (await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    }))?.role === "ADMIN" : false;

  // Incrémenter les vues (sauf pour l'auteur)
  if (!isAuthor) {
    await incrementPostViews(id);
  }

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

      <PostDetail post={post} isAuthor={isAuthor} isAdmin={isAdmin} />
    </div>
  );
}
