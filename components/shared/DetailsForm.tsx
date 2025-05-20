"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import AvatarImg from "@/public/images/avatar.png";
import { get_user_by_id } from "@/app/api/annuaire-api";
import { RegisterFormDataResult } from '@/types/interfaces/annuaire';


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

const InfoSection = ({
    title,
    items,
}: {
    title: string;
    items: Array<{ text: string }>;
}) => (
    <div className="rounded-lg bg-gray-50 p-3 sm:p-4 shadow">
        <h3 className="mb-3 flex items-center text-base sm:text-lg font-medium text-gray-900">
            <span className="ml-2">{title}</span>
        </h3>
        {items.map((item, index) => (
            <p
                key={index}
                className="mb-2 flex items-center whitespace-pre-line text-xs sm:text-sm text-gray-500"
            >
                {item.text}
            </p>
        ))}
    </div>
);


interface LocalRegisterFormDataResult {
    personnel: {
        genre: string | undefined;
        prenom: string | undefined;
        nom: string | undefined;
        photo: string | undefined;
        consentement_email: boolean | undefined;
        consentement_gsm: boolean | undefined;
        email: string | undefined;
        gsm: string | undefined;
        langues: string[];
        residence: {
            pays: string | undefined;
            ville: string | undefined;
        };
    };
    eglise: {
        eglise: string | undefined;
        departements: string[];
        star: boolean | undefined;
    };
    professionnel: {
        educations: Array<{
            domaine: string | undefined;
            titre: string | undefined;
        }>;
        professions: Array<{
            domaine: string | undefined;
            titre: string | undefined;
        }>;
        diplomes: Array<{
            nom: string;
        }>;
        competences: Array<{
            nom: string;
        }>;
        certifications: Array<{
            nom: string;
        }>;
    };
}

const defaultRegisterFormDataResult: LocalRegisterFormDataResult = {
    personnel: {
        genre: "",
        prenom: "",
        nom: "",
        photo: "",
        consentement_email: false,
        consentement_gsm: false,
        email: "",
        gsm: "",
        langues: [],
        residence: {
            pays: "",
            ville: "",
        },
    },
    eglise: {
        eglise: "",
        departements: [],
        star: false,
    },
    professionnel: {
        educations: [],
        professions: [],
        diplomes: [],
        competences: [],
        certifications: [],
    },
};

const fetchUserData = async (id: string): Promise<LocalRegisterFormDataResult | null> => {
    try {
        const userData = await get_user_by_id(id);
        if (userData && userData.length > 0) {
            const apiData = userData[0] as RegisterFormDataResult;
            const transformedData: LocalRegisterFormDataResult = {
                personnel: {
                    genre: apiData.personnel.genre || "",
                    prenom: apiData.personnel.prenom || "",
                    nom: apiData.personnel.nom || "",
                    photo: apiData.personnel.photo || "",
                    consentement_email: apiData.personnel.consentement_email,
                    consentement_gsm: apiData.personnel.consentement_gsm,
                    email: apiData.personnel.email || "",
                    gsm: apiData.personnel.gsm || "",
                    langues: apiData.personnel.langues || [],
                    residence: {
                        pays: apiData.personnel.residence.pays,
                        ville: apiData.personnel.residence.ville,
                    },
                },
                eglise: {
                    eglise: apiData.eglise.eglise || "",
                    departements: apiData.eglise.departements || [],
                    star: apiData.eglise.star || false,
                },
                professionnel: {
                    educations: apiData.professionnel.educations.map(edu => ({
                        domaine: edu.domaine || "",
                        titre: edu.titre || "",
                    })),
                    professions: apiData.professionnel.professions.map(prof => ({
                        domaine: prof.domaine || "",
                        titre: prof.titre || "",
                    })),
                    diplomes: apiData.professionnel.diplomes.map(dip => ({
                        nom: dip.nom || "",
                    })),
                    competences: apiData.professionnel.competences.map(comp => ({
                        nom: comp.nom || "",
                    })),
                    certifications: apiData.professionnel.certifications.map(cert => ({
                        nom: cert.nom || "",
                    })),
                },
            };
            return transformedData;
        }
        return null;
    } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
        return null;
    }
};



interface UserProfileProps {
    user_id: string;
}

export default function UserProfile({ user_id }: UserProfileProps) {
    const router = useRouter();
    const params = useParams();
    const eglise = params.eglise as string;

    const [userData, setUserData] = useState<LocalRegisterFormDataResult>(defaultRegisterFormDataResult);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUserData = async () => {
            setIsLoading(true);

            try {

                const storedData = localStorage.getItem("userData");
                const storedUserId = localStorage.getItem("userId");

                if (storedData && storedUserId === user_id) {
                    const parsedData = JSON.parse(storedData);
                    setUserData(parsedData);
                } else {

                    const data = await fetchUserData(user_id);
                    if (data) {
                        setUserData(data);

                        localStorage.setItem("userData", JSON.stringify(data));
                        localStorage.setItem("userId", user_id);
                    } else {
                        console.error("Aucune donnée utilisateur trouvée pour l'ID:", user_id);
                    }
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des données utilisateur:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadUserData();
    }, [user_id]);

    const routeToContact = () => {
        router.push(`/${eglise}/annuaire/users/contact/${user_id}`);
    };

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

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 px-2 py-6 sm:px-6 lg:px-8">
            <Navigate goBack={goBack} goHome={goHome} />
            <div className="mx-auto max-w-7xl">
                <div className="overflow-hidden rounded-lg bg-white shadow-xl">
                    <div className="relative p-4 sm:p-8">
                        <div className="flex flex-col items-center sm:block">
                            <div className="h-[120px] w-[120px] sm:h-[150px] sm:w-[150px] overflow-hidden rounded-full border-4 border-white shadow-lg">
                                {userData.personnel.photo ? (
                                    <Image
                                        src={userData.personnel.photo}
                                        alt="User Photo"
                                        className="h-full w-full object-cover"
                                        width={150}
                                        height={150}
                                    />
                                ) : (
                                    <Image
                                        src={AvatarImg}
                                        alt="Default Avatar"
                                        className="h-full w-full object-cover"
                                        width={150}
                                        height={150}
                                    />
                                )}
                            </div>
                            <div className="mt-4 text-center sm:text-left sm:ml-44">
                                <div className="text-sm font-semibold uppercase tracking-wide text-blue-950">
                                    Profil Utilisateur
                                </div>
                                <h1 className="mt-2 sm:mt-4 text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 flex flex-col sm:flex-row items-center">
                                    {`${userData.personnel.genre} ${userData.personnel.prenom} ${userData.personnel.nom}`}
                                    {userData.eglise.star && (
                                        <span className="mt-2 sm:mt-0 sm:ml-3 inline-block rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                                            S.T.A.R
                                        </span>
                                    )}
                                </h1>
                            </div>
                        </div>
                        <div className="mt-6 sm:mt-8 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                            <InfoSection
                                title="Informations personnelles"
                                items={[
                                    {
                                        text: userData.personnel.consentement_email && userData.personnel.email
                                            ? `Email: ${userData.personnel.email}`
                                            : "",
                                    },
                                    {
                                        text: userData.personnel.consentement_gsm && userData.personnel.gsm
                                            ? `GSM: ${userData.personnel.gsm}`
                                            : "",
                                    },
                                    {
                                        text: `Langues: ${userData.personnel.langues?.join(", ") || "Non spécifié"}`,
                                    },
                                    {
                                        text: `Résidence: ${userData.personnel.residence?.pays}${userData.personnel.residence?.ville ? ` (${userData.personnel.residence.ville})` : ""}`
                                    },
                                ]}
                            />
                            <InfoSection
                                title="Église"
                                items={[
                                    { text: `Église : ${userData.eglise.eglise}` },
                                    {
                                        text: `Département: ${userData.eglise.departements
                                            .filter(Boolean)
                                            .join(", ")}`,
                                    },
                                ]}
                            />
                            <InfoSection
                                title="Education"
                                items={[
                                    {
                                        text: userData.professionnel.educations
                                            .map((education) => `• ${education.domaine} (${education.titre})`)
                                            .join("\n") || "Non spécifié",
                                    },
                                ]}
                            />
                            <InfoSection
                                title="Activités professionnelles"
                                items={[
                                    {
                                        text: userData.professionnel.professions
                                            .map((profession) => `• ${profession.domaine} (${profession.titre})`)
                                            .join("\n") || "Non spécifié",
                                    },
                                ]}
                            />
                            <InfoSection
                                title="Diplômes & Certifications"
                                items={[
                                    {
                                        text: `${userData.professionnel.diplomes
                                            .map((diplome) => `• ${diplome.nom}`)
                                            .join("\n") || "Non spécifié"
                                            }`,
                                    },
                                ]}
                            />
                            <InfoSection
                                title="Compétences"
                                items={[
                                    {
                                        text: `- Compétences: ${userData.professionnel.competences
                                            .map((competence) => competence.nom)
                                            .join(", ") || "Non spécifié"
                                            }`,
                                    },
                                    {
                                        text: `- Plus d'informations : ${userData.professionnel.certifications
                                            .map((certification) => ` ${certification.nom}`)
                                            .join(", ") || "Non spécifié"
                                            }`,
                                    },
                                ]}
                            />
                        </div>
                    </div>
                    <div className="border-t border-gray-200 bg-gray-50 px-4 sm:px-8 py-4">
                        <button
                            onClick={routeToContact}
                            className="w-full rounded bg-slate-800 px-4 py-3 font-bold text-white hover:bg-slate-500"
                        >
                            Contacter
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
