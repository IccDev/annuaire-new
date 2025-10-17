import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 403 }
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!dbUser || dbUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 403 }
      );
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    const checkProfilePromises = users.map(async (user) => {
      try {
        const res = await fetch(
          `http://84.234.16.224:4042/annuaire/query/user_by_email`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ email: user.email }),
            signal: AbortSignal.timeout(5000),
          }
        );

        const data = await res.json();
        const hasProfile = data.data.length > 0;
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
          hasProfile,
        };
      } catch (error) {
        console.error(`Erreur vérification profil pour ${user.email}:`, error);
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
          hasProfile: false,
        };
      }
    });

    const results = await Promise.all(checkProfilePromises);
    const usersWithProfiles = results.filter((user) => user.hasProfile);
    const profilesCount = usersWithProfiles.length;

    return NextResponse.json({
      totalUsers: users.length,
      profilesCompleted: profilesCount,
      usersWithProfiles: results, // TOUS les utilisateurs avec leur statut
    });
  } catch (error) {
    console.error("Erreur lors du calcul des statistiques de profils:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
