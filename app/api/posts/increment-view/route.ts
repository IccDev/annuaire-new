// API route: POST - Incrémenter le nombre de vues

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { postId } = await request.json();

    if (!postId) {
      return NextResponse.json({ error: "ID du post requis" }, { status: 400 });
    }

    // Incrémenter le compteur de vues
    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        views: {
          increment: 1,
        },
      },
      select: {
        id: true,
        views: true,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Erreur lors de l'incrémentation des vues:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'incrémentation des vues" },
      { status: 500 }
    );
  }
}
