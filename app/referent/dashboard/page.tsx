import { getSession } from '@/lib/auth-server';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import ReferentDashboardClient from './ReferentDashboardClient';

export default async function ReferentDashboardPage() {
  const session = await getSession();
  const user = session?.user;

  if (!user || !user.email) {
    redirect('/auth/login');
  }

  const candidates = await prisma.candidate.findMany({
    where: {
      emailReferent: user.email,
    },
  });

  return <ReferentDashboardClient candidates={candidates} />;
}