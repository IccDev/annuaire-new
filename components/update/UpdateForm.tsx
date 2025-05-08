"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import InfosPersonnelles from "./body/InfosPersonnelles";
import InfosEglise from "./body/InfosEglise";
import InfosProfessionnels from "./body/InfosProfessionnels";
import Footer from "./body/Footer";
import { defaultRegisterFormData } from "@/types/interfaces/annuaire-register";
import type { PersonnelData, EgliseData, ProfessionnelData } from "@/types/interfaces/annuaire-register";
import { toast } from "sonner";

type Step = "personnel" | "eglise" | "professionnel";

export default function UpdateFormComplete() {
    const router = useRouter();
    const params = useParams();
    const eglise = params.eglise as string;
    const user_id = params.user_id as string;
    const email = params.email as string;

    const [currentStep, setCurrentStep] = useState<Step>("personnel");
    const [formData, setFormData] = useState(defaultRegisterFormData);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`/api/users/${user_id}?email=${encodeURIComponent(email)}`);
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des données');
                }
                const userData = await response.json();
                setFormData(userData);
                setIsLoading(false);
            } catch (error) {
                console.error("Erreur lors de la récupération des données utilisateur:", error);
                setIsLoading(false);
                toast.error("Erreur lors de la récupération de vos informations");
            }
        };

        if (email && user_id) {
            fetchUserData();
        } else {
            setIsLoading(false);
        }
    }, [email, user_id]);

    const handlePersonnelSubmit = (data: PersonnelData) => {
        setIsAnimating(true);
        setFormData(prev => ({ ...prev, personnel: data }));
        setTimeout(() => {
            setCurrentStep("eglise");
            setIsAnimating(false);
        }, 300);
    };

    const handleEgliseSubmit = (data: EgliseData) => {
        setIsAnimating(true);
        setFormData(prev => ({ ...prev, eglise: data }));
        setTimeout(() => {
            setCurrentStep("professionnel");
            setIsAnimating(false);
        }, 300);
    };

    const handlePrevious = () => {
        setIsAnimating(true);
        setTimeout(() => {
            if (currentStep === "eglise") {
                setCurrentStep("personnel");
            } else if (currentStep === "professionnel") {
                setCurrentStep("eglise");
            }
            setIsAnimating(false);
        }, 300);
    };

    const handleProfessionnelSubmit = async (data: ProfessionnelData) => {
        const updatedData = {
            educations: data.educations.filter(edu => edu.domaine || edu.titre || edu.specialite).map(edu => ({
                domaine: edu.domaine || "",
                titre: edu.titre || "",
                specialite: edu.specialite || ""
            })),
            professions: data.professions.filter(prof => prof.domaine || prof.titre || prof.fonction).map(prof => ({
                domaine: prof.domaine || "",
                titre: prof.titre || "",
                fonction: prof.fonction || ""
            })),
            diplomes: data.diplomes.filter(dip => dip.nom).map(dip => ({
                nom: dip.nom
            })),
            certifications: data.certifications.filter(cert => cert.nom).map(cert => ({
                nom: cert.nom
            })),
            competences: data.competences.filter(comp => comp.nom).map(comp => ({
                nom: comp.nom
            }))
        };

        setFormData(prev => ({ ...prev, professionnel: updatedData }));

        try {
            setIsLoading(true);
            const response = await fetch(`/api/users/${user_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    professionnel: updatedData
                })
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour des données');
            }

            setIsLoading(false);
            toast.success("Vos informations ont été mises à jour avec succès");
            router.push(`/update/success?eglise=${eglise}`);

        } catch (error) {
            console.error("Erreur lors de la mise à jour des données:", error);
            setIsLoading(false);
            alert("Une erreur s'est produite lors de la mise à jour de vos informations. Veuillez réessayer.");
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-2xl mx-auto overflow-hidden bg-white rounded-xl shadow-xl p-8 mt-8 text-center">
                <div className="animate-pulse">
                    <div className="h-8 bg-slate-200 rounded w-3/4 mx-auto mb-4"></div>
                    <div className="h-64 bg-slate-200 rounded mb-4"></div>
                    <div className="h-8 bg-slate-200 rounded w-1/2 mx-auto"></div>
                </div>
                <p className="mt-4 text-gray-600">Chargement de vos informations...</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto overflow-hidden bg-white rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl">
            <div className="relative bg-slate-600 p-6 text-white">
                <h2 className="text-2xl font-bold text-center mb-4">
                    {currentStep === "personnel"
                        ? "Mise à jour - Informations personnelles"
                        : currentStep === "eglise"
                            ? "Mise à jour - Informations église"
                            : "Mise à jour - Informations professionnelles"}
                </h2>
                <div className="flex justify-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <div
                            className={`h-3 w-3 rounded-full transition-colors duration-300 ${currentStep === "personnel" ? "bg-white" : "bg-slate-300"}`}
                        />
                        <span className={`text-sm transition-colors duration-300 ${currentStep === "personnel" ? "text-white" : "text-blue-300"}`}>
                            Étape 1
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div
                            className={`h-3 w-3 rounded-full transition-colors duration-300 ${currentStep === "eglise" ? "bg-white" : "bg-blue-300"}`}
                        />
                        <span className={`text-sm transition-colors duration-300 ${currentStep === "eglise" ? "text-white" : "text-blue-300"}`}>
                            Étape 2
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div
                            className={`h-3 w-3 rounded-full transition-colors duration-300 ${currentStep === "professionnel" ? "bg-white" : "bg-blue-300"}`}
                        />
                        <span className={`text-sm transition-colors duration-300 ${currentStep === "professionnel" ? "text-white" : "text-blue-300"}`}>
                            Étape 3
                        </span>
                    </div>
                </div>
            </div>

            <div className={`p-6 ${isAnimating ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
                {currentStep === "personnel" && (
                    <InfosPersonnelles
                        data={formData.personnel}
                        onSubmit={handlePersonnelSubmit}
                    />
                )}

                {currentStep === "eglise" && (
                    <InfosEglise
                        data={formData.eglise}
                        onSubmit={handleEgliseSubmit}
                    />
                )}

                {currentStep === "professionnel" && (
                    <InfosProfessionnels
                        data={formData.professionnel}
                        onSubmit={handleProfessionnelSubmit}
                    />
                )}

                {currentStep !== "personnel" && (
                    <Footer onPrevious={handlePrevious} />
                )}
            </div>
        </div>
    );
}