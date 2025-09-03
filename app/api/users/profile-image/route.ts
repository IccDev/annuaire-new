import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import prisma from "@/lib/prisma";
import { uploadProfileImage, deleteProfileImage } from "@/services/storage";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier fourni" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Le fichier doit être une image" },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "L'image ne doit pas dépasser 5MB" },
        { status: 400 }
      );
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { imageUrl: true },
    });

    const imageUrl = await uploadProfileImage(file, session.user.id);

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { imageUrl },
      select: {
        id: true,
        name: true,
        email: true,
        imageUrl: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    if (currentUser?.imageUrl) {
      try {
        await deleteProfileImage(currentUser.imageUrl);
      } catch (error) {
        console.error(
          "Erreur lors de la suppression de l'ancienne image:",
          error
        );
      }
    }

    return NextResponse.json({
      message: "Photo de profil mise à jour avec succès",
      user: updatedUser,
    });
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour de la photo de profil:",
      error
    );
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { imageUrl: true },
    });

    if (!currentUser?.imageUrl) {
      return NextResponse.json(
        { error: "Aucune photo de profil à supprimer" },
        { status: 400 }
      );
    }

    try {
      await deleteProfileImage(currentUser.imageUrl);
    } catch (error) {
      console.error(
        "Erreur lors de la suppression de l'image de Firebase:",
        error
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { imageUrl: null },
      select: {
        id: true,
        name: true,
        email: true,
        imageUrl: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      message: "Photo de profil supprimée avec succès",
      user: updatedUser,
    });
  } catch (error) {
    console.error(
      "Erreur lors de la suppression de la photo de profil:",
      error
    );
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
