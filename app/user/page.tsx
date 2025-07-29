import { getSession } from "@/lib/auth-server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import UserProfileClient from "./UserProfileClient";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  emailVerified: boolean | null;
  createdAt: Date;
}

export default async function UserProfilePage() {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    redirect("/auth/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser) {
    redirect("/auth/login");
  }

  const fullUser: User = {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    image: user.image || null,
    emailVerified: dbUser.emailVerified,
    createdAt: dbUser.createdAt
  };

  // Nous utilisons l'email comme identifiant pour vérifier l'existence du profil
  const res = await fetch(
    `http://84.234.16.224:4042/annuaire/query/get_user_email/${fullUser.email}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );

  const hasProfile = res.ok;

  let isReferent = null;
  if (fullUser.email) {
    isReferent = await prisma.candidate.findFirst({
      where: {
        emailReferent: fullUser.email,
      },
    });
  }

  return (
    <UserProfileClient
      user={fullUser}
      hasProfile={hasProfile}
      isReferent={!!isReferent}
    />
  );
}


