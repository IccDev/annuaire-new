"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import emailjs from "@emailjs/browser";
import { get_annuaire_user_by_email } from "@/app/api/annuaire-api";
import { getId } from "@/types/interfaces/annuaire";

const Navigate = ({ goBack, goHome }: { goBack: () => void, goHome: () => void }) => {
    return (
        <div className="flex justify-between mb-4">
            <button
                onClick={goBack}
                className="flex items-center text-gray-600 hover:text-gray-900"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Retour
            </button>
            <button
                onClick={goHome}
                className="flex items-center text-gray-600 hover:text-gray-900"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Accueil
            </button>
        </div>
    );
};


interface AnnuaireUserUpdate {
    email: string;
}

const defaultAnnuaireUserUpdate: AnnuaireUserUpdate = {
    email: ""
};


export default function UserUpdate() {
    const router = useRouter();
    const params = useParams();
    const user_id = params.user_id as string;

    const [showToast, setShowToast] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm<AnnuaireUserUpdate>({
        defaultValues: defaultAnnuaireUserUpdate
    });


    const sendUpdateEmail = async (email_to_update: string, user_id: string) => {
        emailjs
        .send(
            `${process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID}`,
            `${process.env.NEXT_PUBLIC_EMAIL_UPDATE_TEMPLATE_ID}`,
            {
            url_formulaire: `${process.env.NEXT_PUBLIC_BASE_URL}/annuaire/update-user/${user_id}`,
            to_email: email_to_update,
            object:
                "Annuaire des professions ICC - Modification de vos informations personnelles",
            },
            {
            publicKey: process.env.NEXT_PUBLIC_EMAIL_PUBLIC_ID,
        })
        .then(
            () => {
            setIsLoading(false);
                setShowToast(true);
                setTimeout(() => {
                    setShowToast(false);
                    goHome();
                }, 3000);
            },
            (error: any) => {
                console.error("Erreur lors de l'envoi de l'email:", error);
                setIsLoading(false);
                alert("Une erreur s'est produite lors de l'envoi de l'email. Veuillez réessayer.");
            },
        );
    };

    useEffect(() => {
        if (user_id) {
            console.log("User ID:", user_id);
        }
    }, [user_id]);

    const goBack = () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            router.push(`/home/`);
        }
    };

    const goHome = () => {
        router.push(`/home/`);
    };

    const onSubmit = async (data: AnnuaireUserUpdate) => {
        setIsLoading(true);
        const user = await get_annuaire_user_by_email(data.email)
        const userData = await user.json();
        if (userData) {
            let user_id = getId(userData.data[0].id.id);
            await sendUpdateEmail(data.email, user_id);
        }
    };

    return (
        <div className="min-h-screen bg-blue-50 flex items-center justify-center">
            <div className="w-full max-w-md">
                <Navigate goBack={goBack} goHome={goHome} />
                <div className="bg-white rounded-lg shadow-xl p-8">
                    <h2 className="text-2xl font-medium text-center text-gray-800 mb-8">Mise à jour de vos informations<br />professionnelles</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">
                                Votre adresse email<span className="text-red-500">*</span>
                            </label>
                            <div className="mt-2">
                                <div className="relative">
                                    <Controller
                                        name="email"
                                        control={control}
                                        rules={{
                                            required: "L'email est requis",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Adresse email invalide"
                                            }
                                        }}
                                        render={({ field }) => (
                                            <input
                                                type="email"
                                                placeholder="Votre email"
                                                className="block w-full rounded-md border border-gray-300 py-3 px-4 text-gray-900 shadow-sm focus:border-slate-700 focus:ring-1 focus:ring-slate-700 text-center placeholder:text-gray-500 sm:text-sm"
                                                {...field}
                                            />
                                        )}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-600" id="email-error">
                                        {errors.email.message}
                                    </p>
                                )}
                                <p className="mt-2 text-xs text-gray-500">
                                    Un lien de mise à jour sera envoyé à cette adresse email.
                                </p>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full rounded-md bg-slate-700 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-slate-600 focus:outline-none disabled:opacity-70"
                            >
                                {isLoading ? "Chargement..." : "Mettre à jour"}
                            </button>
                        </div>
                    </form>
                </div>

                {showToast && (
                    <div className="fixed bottom-4 right-4 z-50">
                        <div className="rounded-md bg-green-50 p-4 shadow-md">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-green-800">
                                        Email de mise à jour envoyé avec succès!
                                    </p>
                                    <p className="text-xs text-green-600">
                                        Veuillez vérifier votre boîte de réception pour accéder au formulaire de mise à jour.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}