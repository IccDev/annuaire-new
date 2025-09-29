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

        if (!hasProfile) {
            redirect("/user");
        }
    } catch (error) {
        console.error("Error checking profile:", error);
        redirect("/user");
    }

    return <HomePage />;
}