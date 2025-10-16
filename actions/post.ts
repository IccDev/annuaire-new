// Server actions pour les annonces

"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth-server";
import { revalidatePath } from "next/cache";
import type { CreatePostInput, UpdatePostInput } from "@/types/interfaces/post";

// Créer un post
export async function createPost(data: CreatePostInput) {
  try {
    const session = await getSession();

    if (!session) {
      return { error: "Non authentifié" };
    }

    const post = await prisma.post.create({
      data: {
        ...data,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        authorId: session.user.id,
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
    });

    revalidatePath("/posts");
    revalidatePath("/posts/my-posts");

    return { success: true, post };
  } catch (error) {
    console.error("Erreur lors de la création du post:", error);
    return { error: "Erreur lors de la création du post" };
  }
}

// Mettre à jour un post
export async function updatePost(id: string, data: UpdatePostInput) {
  try {
    const session = await getSession();

    if (!session) {
      return { error: "Non authentifié" };
    }

    // Vérifier que le post existe
    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return { error: "Post non trouvé" };
    }

    // Récupérer l'utilisateur pour vérifier le rôle
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    // Vérifier les permissions
    if (existingPost.authorId !== session.user.id && user?.role !== "ADMIN") {
      return { error: "Non autorisé" };
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        ...data,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
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
    });

    revalidatePath("/posts");
    revalidatePath(`/posts/${id}`);
    revalidatePath("/posts/my-posts");

    return { success: true, post: updatedPost };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du post:", error);
    return { error: "Erreur lors de la mise à jour du post" };
  }
}

// Supprimer un post
export async function deletePost(id: string) {
  try {
    const session = await getSession();

    if (!session) {
      return { error: "Non authentifié" };
    }

    // Vérifier que le post existe
    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return { error: "Post non trouvé" };
    }

    // Récupérer l'utilisateur pour vérifier le rôle
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    // Vérifier les permissions
    if (existingPost.authorId !== session.user.id && user?.role !== "ADMIN") {
      return { error: "Non autorisé" };
    }

    await prisma.post.delete({
      where: { id },
    });

    revalidatePath("/posts");
    revalidatePath("/posts/my-posts");

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression du post:", error);
    return { error: "Erreur lors de la suppression du post" };
  }
}

// Basculer le statut actif/inactif d'un post (archiver)
export async function togglePostActive(id: string) {
  try {
    const session = await getSession();

    if (!session) {
      return { error: "Non authentifié" };
    }

    // Vérifier que le post existe
    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return { error: "Post non trouvé" };
    }

    // Vérifier les permissions
    if (existingPost.authorId !== session.user.id) {
      return { error: "Non autorisé" };
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        isActive: !existingPost.isActive,
      },
    });

    revalidatePath("/posts");
    revalidatePath(`/posts/${id}`);
    revalidatePath("/posts/my-posts");

    return { success: true, post: updatedPost };
  } catch (error) {
    console.error("Erreur lors du basculement du statut:", error);
    return { error: "Erreur lors du basculement du statut" };
  }
}

// Incrémenter le nombre de vues
export async function incrementPostViews(id: string) {
  try {
    await prisma.post.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de l'incrémentation des vues:", error);
    return { error: "Erreur lors de l'incrémentation des vues" };
  }
}

// Récupérer les posts d'un utilisateur
export async function getUserPosts(userId?: string) {
  try {
    const session = await getSession();

    if (!session && !userId) {
      return { error: "Non authentifié" };
    }

    const targetUserId = userId || session?.user.id;

    const posts = await prisma.post.findMany({
      where: {
        authorId: targetUserId,
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, posts };
  } catch (error) {
    console.error("Erreur lors de la récupération des posts:", error);
    return { error: "Erreur lors de la récupération des posts" };
  }
}
