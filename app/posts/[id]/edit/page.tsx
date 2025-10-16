import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import PostForm from "@/components/posts/PostForm";
import { getSession } from "@/lib/auth-server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function getPost(id: string, userId: string, isAdmin: boolean) {
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

  if (!post) {
    return null;
  }

  // Vérifier les permissions
  if (post.authorId !== userId && !isAdmin) {
    return null;
  }

  return post;
}

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  const isAdmin = user?.role === "ADMIN";
  const { id } = await params;
  const post = await getPost(id, session.user.id, isAdmin);

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href={`/posts/${id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l'annonce
          </Link>
        </Button>
      </div>

      <PostForm mode="edit" post={post} />
    </div>
  );
}
