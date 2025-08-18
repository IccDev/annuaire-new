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
    icon
}: {
    title: string;
    items: Array<{ text: string }>;
    icon?: React.ReactNode;
}) => (
    <div className="rounded-lg bg-gray-50 p-3 sm:p-4 shadow">
        <h3 className="mb-3 flex items-center text-base sm:text-lg font-medium text-gray-900">
            {icon && <span className="mr-2 text-slate-600">{icon}</span>}
            <span>{title}</span>
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

const PersonalInfoSection = ({ userData }: { userData: any }) => (
    <div className="rounded-lg bg-white p-4 sm:p-5 shadow-sm border border-gray-200">
        <h3 className="mb-4 flex items-center text-base sm:text-lg font-semibold text-gray-900">
            <svg className="w-5 h-5 mr-3 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <span>Informations personnelles</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {userData.personnel.consentement_email && userData.personnel.email && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-100 sm:col-span-2">
                    <div className="flex-shrink-0 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Email</p>
                        <p className="text-sm text-gray-900 font-medium truncate">{userData.personnel.email}</p>
                    </div>
                </div>
            )}
            {userData.personnel.consentement_gsm && userData.personnel.gsm && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-100 sm:col-span-2">
                    <div className="flex-shrink-0 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Téléphone</p>
                        <p className="text-sm text-gray-900 font-medium truncate">{userData.personnel.gsm}</p>
                    </div>
                </div>
            )}
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-100 sm:col-span-2">
                <div className="flex-shrink-0 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Langues</p>
                    <p className="text-sm text-gray-900 font-medium truncate">{userData.personnel.langues?.join(", ") || "Non spécifié"}</p>
                </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-100 sm:col-span-2">
                <div className="flex-shrink-0 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Résidence</p>
                    <p className="text-sm text-gray-900 font-medium truncate">{`${userData.personnel.residence?.pays}${userData.personnel.residence?.ville ? ` (${userData.personnel.residence.ville})` : ""}`}</p>
                </div>
            </div>
        </div>
    </div>
);

const ProfessionalItem = ({
    title,
    domain,
    period,
    type = "profession"
}: {
    title: string;
    domain: string;
    period: { debut?: string; fin?: string };
    type?: "profession" | "education";
}) => {
    const formatPeriod = () => {
        if (!period.debut && !period.fin) return null;
        const debut = period.debut || "";
        const fin = period.fin || "";

        if (debut && fin) {
            return `${debut} - ${fin}`;
        } else if (debut) {
            return `Depuis ${debut}`;
        } else if (fin) {
            return `Jusqu'à ${fin}`;
        }
        return null;
    };

    const periodText = formatPeriod();

    return (
        <div className="mb-4 last:mb-0 border-l-4 border-slate-400 pl-4 py-3 bg-white rounded-r-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            {/* Mobile: période au-dessus, Desktop: côte à côte */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                {/* Sur mobile, la période s'affiche en premier */}
                {periodText && (
                    <div className="order-1 sm:order-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 shadow-sm">
                            <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            {periodText}
                        </span>
                    </div>
                )}
                {/* Sur mobile, le titre s'affiche en second */}
                <div className="order-2 sm:order-1">
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base leading-tight">{title}</h4>
                </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mt-2">{domain}</p>
        </div>
    );
};

const ProfessionalSection = ({
    title,
    items,
    type = "profession"
}: {
    title: string;
    items: Array<{ title: string; domain: string; period: { debut?: string; fin?: string } }>;
    type?: "profession" | "education";
}) => {
    const getIcon = () => {
        if (type === "education") {
            return (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
            );
        }
        return (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
            </svg>
        );
    };

    return (
        <div className="rounded-lg bg-white p-4 sm:p-5 shadow-sm border border-gray-200">
            <h3 className="mb-4 flex items-center text-base sm:text-lg font-semibold text-gray-900">
                <span className="mr-3 text-slate-500">{getIcon()}</span>
                <span>{title}</span>
            </h3>
            {items.length > 0 ? (
                <div className="space-y-3">
                    {items.map((item, index) => (
                        <ProfessionalItem
                            key={index}
                            title={item.title}
                            domain={item.domain}
                            period={item.period}
                            type={type}
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <p className="text-gray-500 text-sm text-center">Non spécifié</p>
                </div>
            )}
        </div>
    );
};


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
            periodeDebut: string | undefined;
            periodeFin: string | undefined;
        }>;
        professions: Array<{
            domaine: string | undefined;
            titre: string | undefined;
            periodeDebut: string | undefined;
            periodeFin: string | undefined;
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
                        periodeDebut: (edu as any).periode_debut || "",
                        periodeFin: (edu as any).periode_fin || ""
                    })),
                    professions: apiData.professionnel.professions.map(prof => ({
                        domaine: prof.domaine || "",
                        titre: prof.titre || "",
                        periodeDebut: (prof as any).periode_debut || "",
                        periodeFin: (prof as any).periode_fin || ""
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
        router.push(`/annuaire/users/contact/${user_id}`);
    };

    const goBack = () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            router.push(`/annuaire/home/`);
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
                <div className="overflow-hidden rounded-xl bg-white shadow-lg">
                    <div className="relative p-4 sm:p-8 bg-gray-50">
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
                                <div className="text-sm font-bold uppercase tracking-wide text-slate-600 bg-slate-100 px-3 py-1 rounded-full inline-block">
                                    Profil Utilisateur
                                </div>
                                <h1 className="mt-3 sm:mt-4 text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 flex flex-col sm:flex-row items-center">
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
                            <PersonalInfoSection userData={userData} />
                            <InfoSection
                                title="Église"
                                icon={
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                    </svg>
                                }
                                items={[
                                    { text: `Église : ${userData.eglise.eglise}` },
                                    {
                                        text: `Département: ${userData.eglise.departements
                                            .filter(Boolean)
                                            .join(", ")}`,
                                    },
                                ]}
                            />
                            <ProfessionalSection
                                title="Éducation"
                                type="education"
                                items={userData.professionnel.educations.map((education) => ({
                                    period: {
                                        debut: education.periodeDebut || "",
                                        fin: education.periodeFin || ""
                                    },
                                    title: education.titre || "Non spécifié",
                                    domain: education.domaine || "Non spécifié"

                                }))}
                            />
                            <ProfessionalSection
                                title="Activités professionnelles"
                                type="profession"
                                items={userData.professionnel.professions.map((profession) => ({
                                    title: profession.titre || "Non spécifié",
                                    domain: profession.domaine || "Non spécifié",
                                    period: {
                                        debut: profession.periodeDebut || "",
                                        fin: profession.periodeFin || ""
                                    }
                                }))}
                            />
                            <InfoSection
                                title="Diplômes & Certifications"
                                icon={
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                                    </svg>
                                }
                                items={userData.professionnel.diplomes.length > 0
                                    ? userData.professionnel.diplomes.map((diplome) => ({ text: diplome.nom }))
                                    : [{ text: "Non spécifié" }]
                                }
                            />
                            <InfoSection
                                title="Compétences"
                                icon={
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                                    </svg>
                                }
                                items={userData.professionnel.competences.length > 0
                                    ? userData.professionnel.competences.map((competence) => ({ text: competence.nom }))
                                    : [{ text: "Non spécifié" }]
                                }
                            />
                            {userData.professionnel.certifications.length > 0 && (
                                <InfoSection
                                    title="Plus d'informations"
                                    icon={
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                    }
                                    items={userData.professionnel.certifications.map((certification) => ({ text: certification.nom }))}
                                />
                            )}
                        </div>
                    </div>
                    <div className="border-t border-gray-200 bg-gray-50 px-4 sm:px-8 py-6">
                        <button
                            onClick={routeToContact}
                            className="w-full rounded-lg bg-slate-600 px-6 py-4 font-semibold text-white shadow-lg hover:bg-slate-700 transition-all duration-200 flex items-center justify-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                            <span>Contacter</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
