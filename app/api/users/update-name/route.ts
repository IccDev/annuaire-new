import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-server';
import prisma from '@/lib/prisma';

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { name } = await request.json();

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Le nom est requis' }, { status: 400 });
    }

    if (name.trim().length > 100) {
      return NextResponse.json({ error: 'Le nom ne peut pas dépasser 100 caractères' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { name: name.trim() },
      select: {
        id: true,
        name: true,
        email: true,
        imageUrl: true,
        emailVerified: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      message: 'Nom mis à jour avec succès',
      user: {
        ...updatedUser,
        createdAt: updatedUser.createdAt.toISOString()
      }
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du nom:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
