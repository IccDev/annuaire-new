import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-server";
import prisma from "@/lib/prisma";
import ProfilesContent from "@/components/admin/ProfilesContent";

export default async function ProfilesPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!dbUser || dbUser.role !== "ADMIN") {
    redirect("/");
  }

  return <ProfilesContent />;
}
