import { getSession } from "@/lib/auth-server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import HomePage from "@/components/shared/HomePage";

export default async function Home() {
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

    // Vérifier si l'utilisateur a un profil professionnel
    try {
        const res = await fetch(
            `http://84.234.16.224:4042/annuaire/query/user_by_email`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ email: dbUser.email })
            }
        );

        const data = await res.json();
        const hasProfile = data.data.length > 0;

        // Si l'utilisateur n'a pas de profil, le rediriger vers /user
        if (!hasProfile) {
            redirect("/user");
        }
    } catch (error) {
        console.error("Error checking profile:", error);
        // En cas d'erreur, rediriger vers /user par sécurité
        redirect("/user");
    }

    return <HomePage />;
}