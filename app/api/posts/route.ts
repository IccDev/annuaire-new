// API routes: GET (liste), POST (créer)

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { PostType } from "@/app/generated/prisma";
import type { PostFilters, PostsResponse } from "@/types/interfaces/post";

// GET - Liste des posts avec filtres et pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Paramètres de pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    // Paramètres de filtrage
    const type = searchParams.get("type") as PostType | null;
    const category = searchParams.get("category");
    const location = searchParams.get("location");
    const search = searchParams.get("search");
    const isActive = searchParams.get("isActive");
    const authorId = searchParams.get("authorId");

    // Construction de la clause where
    const where: any = {};

    if (type) where.type = type;
    if (category) where.category = category;
    if (location) where.location = { contains: location, mode: "insensitive" };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === "true";
    }
    if (authorId) where.authorId = authorId;

    // Par défaut, afficher uniquement les annonces actives et non expirées
    if (!authorId) {
      where.isActive = true;
      where.OR = [{ expiresAt: null }, { expiresAt: { gte: new Date() } }];
    }

    // Récupération des posts
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
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
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    const response: PostsResponse = {
      posts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Erreur lors de la récupération des posts:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des posts" },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau post
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      type,
      category,
      location,
      requirements,
      contactEmail,
      contactPhone,
      expiresAt,
    } = body;

    // Validation basique
    if (!title || !description || !type || !category) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      );
    }

    // Créer le post
    const post = await prisma.post.create({
      data: {
        title,
        description,
        type,
        category,
        location,
        requirements,
        contactEmail,
        contactPhone,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
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

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création du post:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du post" },
      { status: 500 }
    );
  }
}
