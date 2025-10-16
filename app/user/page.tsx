import { getSession } from "@/lib/auth-server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import UserProfileClient from "./UserProfileClient";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  imageUrl: string | null;
  emailVerified: boolean | null;
  createdAt: Date;
}

interface PageProps {
  searchParams: Promise<{ from?: string }>;
}

export default async function UserProfilePage({ searchParams }: PageProps) {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    redirect("/auth/login");
  }

  const params = await searchParams;

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser) {
    redirect("/auth/login");
  }

  // Récupérer le nombre d'annonces de l'utilisateur
  const userPostsCount = await prisma.post.count({
    where: { authorId: dbUser.id },
  });

  const fullUser: User = {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    image: user.image || null,
    imageUrl: dbUser.imageUrl,
    emailVerified: dbUser.emailVerified,
    createdAt: dbUser.createdAt
  };

  const res = await fetch(
    `http://84.234.16.224:4042/annuaire/query/user_by_email`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email: fullUser.email })
    }
  );

  const data = await res.json();
  const hasProfile = data.data.length > 0;

  if (hasProfile && params.from === 'login') {
    redirect("/home");
  }

  const isReferent = dbUser.role === 'REFERENT';
  const isAdmin = dbUser.role === 'ADMIN';

  return (
    <UserProfileClient
      user={fullUser}
      hasProfile={hasProfile}
      isReferent={isReferent}
      isAdmin={isAdmin}
      userPostsCount={userPostsCount}
    />
  );
}


