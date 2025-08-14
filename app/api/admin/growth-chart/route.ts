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

    const monthsData = [];
    const now = new Date();
    
    for (let i = 7; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      const count = await prisma.user.count({
        where: {
          createdAt: {
            gte: date,
            lt: nextMonth
          }
        }
      });

      const monthName = date.toLocaleDateString('fr-FR', { month: 'short' });
      monthsData.push({
        month: monthName,
        users: count
      });
    }

    return NextResponse.json(monthsData);
  } catch (error) {
    console.error('Erreur lors de la récupération des données de croissance:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
