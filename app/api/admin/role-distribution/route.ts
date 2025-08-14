import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (dbUser?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const [users, referents, admins] = await Promise.all([
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.user.count({ where: { role: 'REFERENT' } }),
      prisma.user.count({ where: { role: 'ADMIN' } })
    ]);

    return NextResponse.json({
      users,
      referents,
      admins
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la répartition des rôles:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
