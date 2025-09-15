"use client";

import RegisterForm from "@/components/update/RegisterForm";
import { defaultRegisterFormData, RegisterFormData } from "@/types/interfaces/annuaire-register";
import { useEffect, useState } from "react";
import { get_user_by_id, get_annuaire_user_by_email } from "@/app/api/annuaire-api";
import { getId } from "@/types/interfaces/annuaire";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function UpdateDirectPage() {
    const [userData, setUserData] = useState<RegisterFormData>(defaultRegisterFormData);
    const [userId, setUserId] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>("");

    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            console.log("Session data:", session);
            console.log("User email:", session?.user?.email);

            if (session === null) {
                console.log("Session still loading...");
                return;
            }

            if (!session || !session.user?.email) {
                setError("Utilisateur non connecté");
                setIsLoading(false);
                return;
            }

            try {
                const response = await get_annuaire_user_by_email(session.user.email);
                const userData = await response.json();

                if (!userData || !userData.data || userData.data.length === 0) {
                    setError("Aucun profil trouvé pour cet utilisateur");
                    setIsLoading(false);
                    return;
                }

                const user_id = getId(userData.data[0].id.id);
                setUserId(user_id);

                const userDetails = await get_user_by_id(user_id);

                if (userDetails && userDetails.length > 0) {
                    setUserData({
                        eglise: userDetails[0].eglise,
                        personnel: userDetails[0].personnel,
                        professionnel: userDetails[0].professionnel
                    });
                } else {
                    setError("Impossible de récupérer les détails du profil");
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des données:", error);
                setError("Une erreur s'est produite lors du chargement des données");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [session]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600">Chargement de votre profil...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
                        <h2 className="text-lg font-semibold mb-2">Erreur</h2>
                        <p>{error}</p>
                        <button
                            onClick={() => router.push('/user')}
                            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                        >
                            Retour au profil
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
            <main className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Bouton de retour */}
                    <div className="mb-6">
                        <button
                            onClick={() => router.push('/user')}
                            className="inline-flex items-center text-slate-600 hover:text-slate-800 transition-colors duration-200 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium">Retour au profil</span>
                        </button>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            Modification de votre fiche professionnelle
                        </h1>
                        <p className="text-gray-600">
                            Modifiez vos informations directement ci-dessous
                        </p>
                    </div>
                    <RegisterForm
                        defaultRegisterFormData={userData}
                        action="update"
                        user_id={userId}
                    />
                </div>
            </main>
        </div>
    );
}