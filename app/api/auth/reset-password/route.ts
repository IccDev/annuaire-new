import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, newPassword } = body;

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "Token et nouveau mot de passe sont requis." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 6 caractères." },
        { status: 400 }
      );
    }

    // Vérifier le token
    const verification = await prisma.verification.findFirst({
      where: {
        value: token,
        expiresAt: {
          gt: new Date()
        }
      }
    });

    if (!verification) {
      return NextResponse.json(
        { error: "Token invalide ou expiré." },
        { status: 400 }
      );
    }

    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: verification.identifier }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé." },
        { status: 404 }
      );
    }

    // Créer une session temporaire pour l'utilisateur pour pouvoir utiliser setPassword
    const session = await prisma.session.create({
      data: {
        id: crypto.randomUUID(),
        userId: user.id,
        token: crypto.randomBytes(32).toString('hex'),
        expiresAt: new Date(Date.now() + 60000), // 1 minute seulement
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    // Utiliser l'API Better-Auth setPassword
    try {
      await auth.api.setPassword({
        body: { newPassword },
        headers: {
          authorization: `Bearer ${session.token}`,
          cookie: `better-auth.session_token=${session.token}`
        }
      });

      // Supprimer la session temporaire
      await prisma.session.delete({
        where: { id: session.id }
      });

      // Supprimer le token utilisé
      await prisma.verification.delete({
        where: { id: verification.id }
      });

      return NextResponse.json({ 
        success: true, 
        message: "Mot de passe réinitialisé avec succès." 
      });

    } catch (authError) {
      console.error("Erreur Better-Auth setPassword:", authError);
      
      // Fallback: supprimer la session temporaire en cas d'erreur
      await prisma.session.delete({
        where: { id: session.id }
      }).catch(() => {});

      return NextResponse.json(
        { error: "Erreur lors de la réinitialisation du mot de passe." },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Erreur lors de la réinitialisation du mot de passe:", error);
    return NextResponse.json(
      { error: "Erreur lors de la réinitialisation du mot de passe." },
      { status: 500 }
    );
  }
}
