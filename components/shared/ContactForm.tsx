"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { get_user_to_contact } from "@/app/api/annuaire-api";
import emailjs from "@emailjs/browser";

const Navigate = ({ goBack, goHome }: { goBack: () => void, goHome: () => void }) => {
    return (
        <div className="flex justify-between">
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


const contactSchema = z.object({
    nom: z.string().min(1, "Votre nom est obligatoire."),
    prenom: z.string().min(1, "Votre prénom est obligatoire."),
    gsm: z.string().optional(),
    email: z.string().min(1, "Votre email est obligatoire").email("Ceci n'est pas une adresse email valide !"),
    msg: z.string().min(1, "Votre message est obligatoire"),
});

type ContactFormValues = z.infer<typeof contactSchema>;


const defaultAnnuaireUserContact: ContactFormValues = {
    nom: "",
    prenom: "",
    gsm: "",
    email: "",
    msg: "",
};

export default function ContactPage() {
    const router = useRouter();
    const params = useParams();
    const eglise = params.eglise as string;
    const user_id = params.id as string;

    const [isLoading, setIsLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [errorToast, setErrorToast] = useState(false);
    const [userData, setUserData] = useState({ nom: "", prenom: "", email: "" });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
        defaultValues: defaultAnnuaireUserContact,
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (user_id) {
                    const contactData = await get_user_to_contact(user_id);
                    if (contactData) {
                        setUserData({
                            nom: contactData.nom,
                            prenom: contactData.prenom,
                            email: contactData.email,
                        });
                    }
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des données de contact:", error);
            }
        };

        fetchUserData();
    }, [user_id]);

    const goBack = () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            router.push(`/${eglise}/annuaire/home/`);
        }
    };

    const goHome = () => {
        router.push(`/home/`);
    };

    const onSubmit = async (data: ContactFormValues) => {
        setIsLoading(true);

        try {
            if (!process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID ||
                !process.env.NEXT_PUBLIC_EMAIL_CONTACT_TEMPLATE_ID ||
                !process.env.NEXT_PUBLIC_EMAIL_PUBLIC_ID) {
                throw new Error("Configuration EmailJS manquante");
            }

            const emailResult = await emailjs.send(
                process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID,
                process.env.NEXT_PUBLIC_EMAIL_CONTACT_TEMPLATE_ID,
                {
                    message: data.msg,
                    to_email: userData.email,
                    from_email: data.email,
                    nom: data.nom,
                    prenom: data.prenom,
                    from_gsm: data.gsm,
                },
                {
                    publicKey: process.env.NEXT_PUBLIC_EMAIL_PUBLIC_ID,
                }
            );

            if (emailResult.status !== 200) {
                throw new Error("Échec de l'envoi du message");
            }

            setShowToast(true);
            await new Promise((resolve) => setTimeout(resolve, 3000));
            goBack();
        } catch (error: any) {
            console.log("ECHEC D'ENVOI...", error.text || error.message);

            setShowToast(false);
            setErrorToast(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
            <header className="sticky top-0 z-10 bg-white/80 p-4 backdrop-blur-sm">
                <div className="mx-auto flex max-w-7xl justify-end">
                    <Navigate goBack={goBack} goHome={goHome} />
                </div>
            </header>
            <main className="mx-auto max-w-7xl px-4 pb-8">
                <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg md:p-8"
                    >
                        <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">
                            Contacter {userData.prenom} {userData.nom}
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="nom" className="text-sm font-medium text-gray-700">
                                    Votre nom
                                    <sup>
                                        <span className="ml-1 font-bold text-red-500">*</span>
                                    </sup>
                                </label>
                                <input
                                    id="nom"
                                    {...register("nom")}
                                    className="w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Votre nom"
                                />
                                {errors.nom && (
                                    <p className="text-xs text-red-600">{errors.nom.message}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="prenom" className="text-sm font-medium text-gray-700">
                                    Votre prénom
                                    <sup>
                                        <span className="ml-1 font-bold text-red-500">*</span>
                                    </sup>
                                </label>
                                <input
                                    id="prenom"
                                    {...register("prenom")}
                                    className="w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Votre prénom"
                                />
                                {errors.prenom && (
                                    <p className="text-xs text-red-600">{errors.prenom.message}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="gsm" className="text-sm font-medium text-gray-700">
                                    Votre numéro de téléphone
                                </label>
                                <input
                                    id="gsm"
                                    type="tel"
                                    {...register("gsm")}
                                    className="w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="+32 xxx xx xx xx"
                                />
                                {errors.gsm && (
                                    <p className="text-xs text-red-600">{errors.gsm.message}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                                    Votre adresse email
                                    <sup>
                                        <span className="ml-1 font-bold text-red-500">*</span>
                                    </sup>
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    {...register("email")}
                                    className="w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Votre email"
                                />
                                {errors.email && (
                                    <p className="text-xs text-red-600">{errors.email.message}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="msg" className="text-sm font-medium text-gray-700">
                                    Votre message
                                    <sup>
                                        <span className="ml-1 font-bold text-red-500">*</span>
                                    </sup>
                                </label>
                                <textarea
                                    id="msg"
                                    {...register("msg")}
                                    className="h-28 w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Écrivez votre message ici..."
                                />
                                {errors.msg && (
                                    <p className="text-xs text-red-600">{errors.msg.message}</p>
                                )}
                            </div>

                            <div className="mt-8 rounded-lg border border-slate-200 bg-white p-8">
                                <details className="group">
                                    <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-slate-800">
                                        <span>
                                            Consentement loi RGPD (Réglement sur la Protection des Données)
                                        </span>
                                        <span className="transition group-open:rotate-180">
                                            <svg
                                                fill="none"
                                                height="24"
                                                shapeRendering="geometricPrecision"
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="1.5"
                                                viewBox="0 0 24 24"
                                                width="24"
                                            >
                                                <path d="M6 9l6 6 6-6"></path>
                                            </svg>
                                        </span>
                                    </summary>
                                    <div className="mt-4 space-y-4 text-slate-600">
                                        <p>
                                            Les informations personnelles figurant dans le présent
                                            formulaire sont traitées avec confidentialité par Impact
                                            Centre Chrétien et conformément au règlement 2016/679 du
                                            Parlement européen et du Conseil du 27 avril 2016 relatif à
                                            la protection des personnes physiques à légard du traitement
                                            des données à caractère personnel et à la libre circulation
                                            de ces données (RGPD).
                                        </p>
                                        <p>
                                            Ces données personnelles sont nécessaires pour vous informer
                                            et vous inscrire aux différentes activités organisées par
                                            l'Eglise et à des fins de gestion interne. Elles seront
                                            conservées pendant la durée nécessaire pour atteindre les
                                            finalités visées ci-dessus.
                                        </p>
                                        <p>
                                            En tant que personne concernée, vous avez le droit, à tout
                                            moment, de consulter, de mettre à jour, de rectifier vos
                                            données personnelles ou d'en demander la suppression.
                                        </p>
                                        <p>
                                            Si vous souhaitez exercer un ou plusieurs des droits
                                            susmentionnés ou obtenir de plus amples informations sur la
                                            protection de vos données personnelles, vous pouvez envoyer
                                            un e-mail à l'adresse contact@impactcentrechretien.be.
                                        </p>
                                        <p>
                                            J'accepte que mes données personnelles récoltées via ce
                                            formulaire soient traitées par Impact Centre Chrétien pour
                                            les finalités d'information et d'inscriptions aux événements
                                            de l'Eglise et pour le suivi de la gestion interne;
                                        </p>
                                        <p>
                                            J'autorise la prise et la diffusion de photos ou de
                                            fragments d'images me concernant sur les sites web et les
                                            réseaux sociaux des églises connectées Impact Centre
                                            Chrétien.
                                        </p>
                                        <p>
                                            J'accepte de recevoir des informations de la part d'Impact
                                            Centre Chrétien.
                                        </p>
                                    </div>
                                </details>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full rounded-md bg-slate-700 px-4 py-2 font-semibold text-white transition duration-300 ease-in-out hover:bg-slate-400 disabled:opacity-70"
                                >
                                    Envoyer
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </main>

            {isLoading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="flex items-center space-x-3 rounded-lg bg-white p-4">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-600 border-t-transparent"></div>
                        <span className="text-gray-700">Envoie du message en cours...</span>
                    </div>
                </div>
            )}

            {showToast && (
                <div className="fixed bottom-4 right-4 transform transition-all duration-500 ease-in-out">
                    <div className="flex items-center space-x-2 rounded-lg bg-green-500 px-4 py-3 text-white shadow-lg">
                        <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="font-medium">Message envoyé avec succès !</span>
                    </div>
                </div>
            )}

            {errorToast && (
                <div className="fixed bottom-4 right-4 transform transition-all duration-500 ease-in-out">
                    <div className="flex items-center space-x-2 rounded-lg bg-red-500 px-4 py-3 text-white shadow-lg">
                        <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                        <span className="font-medium">Échec de l'envoi du message. Veuillez réessayer.</span>
                    </div>
                </div>
            )}
        </div>
    );
}
