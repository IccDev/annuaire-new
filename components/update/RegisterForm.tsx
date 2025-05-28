"use client";

import { useState, useEffect } from "react";
import InfosPersonnelles from "./body/InfosPersonnelles";
import InfosEglise from "./body/InfosEglise";
import InfosProfessionnels from "./body/InfosProfessionnels";
import Footer from "./body/Footer";
import { defaultRegisterFormData } from "@/types/interfaces/annuaire-register";
import type { PersonnelData, EgliseData, ProfessionnelData, RegisterFormData } from "@/types/interfaces/annuaire-register";

type Step = "personnel" | "eglise" | "professionnel" | "end";

interface RegisterFormProps {
    defaultRegisterFormData: RegisterFormData;
    action: "update";
}

export default function RegisterForm(props: RegisterFormProps) {
    const [currentStep, setCurrentStep] = useState<Step>("personnel");
    const [formData, setFormData] = useState(props.defaultRegisterFormData);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        setFormData(props.defaultRegisterFormData);
    }, [props.defaultRegisterFormData]);

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

    const handlePrevious = (step: Step) => {
        setIsAnimating(true);
        setTimeout(() => {
            if (step == "personnel") {
                setCurrentStep("personnel");
            }
            else if (step == "eglise") {
                setCurrentStep("personnel")
            }
            else if (step == "professionnel") {
                setCurrentStep("eglise")
            }
            else if (step == "end") {
                setCurrentStep("professionnel")
            }
            else {
                setCurrentStep("personnel");
            }
            setIsAnimating(false);
        }, 300);
    };

    const handleNext = (step: Step) => {
        setIsAnimating(true);
        setTimeout(() => {
            if (step == "personnel") {
                setCurrentStep("eglise");
            }
            else if (step == "eglise") {
                setCurrentStep("professionnel")
            }
            else if (step == "professionnel") {
                setCurrentStep("end")
            }
            else if (step == "end") {
                setCurrentStep("end")
            }
            else {
                setCurrentStep("personnel");
            }
            setIsAnimating(false);
        }, 300);
    };

    const handleProfessionnelSubmit = (data: ProfessionnelData) => {
        const updatedData = {
            educations: (data.educations || []).filter(edu => edu.domaine || edu.titre || edu.specialite).map(edu => ({
                domaine: edu.domaine || "",
                titre: edu.titre || "",
                specialite: edu.specialite || ""
            })),
            professions: (data.professions || []).filter(prof => prof.statut || prof.titre).map(prof => ({
                statut: prof.statut || "",
                titre: prof.titre || ""
            })),
            diplomes: (data.diplomes || []).filter(dip => dip.nom).map(dip => ({
                nom: dip.nom
            })),
            certifications: (data.certifications || []).filter(cert => cert.nom).map(cert => ({
                nom: cert.nom
            })),
            competences: (data.competences || []).filter(comp => comp.nom).map(comp => ({
                nom: comp.nom
            }))
        };

        setFormData(prev => ({ ...prev, professionnel: updatedData }));
        setCurrentStep('end');
    };

    return (
        <div className="max-w-2xl mx-auto overflow-hidden bg-white rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl">
            <div className="relative bg-slate-600 p-6 text-white">
                <h2 className="text-2xl font-bold text-center mb-4">
                    {currentStep === "personnel"
                        ? "Informations personnelles"
                        : currentStep === "eglise"
                            ? "Informations église"
                            : currentStep === "professionnel"
                                ? "Informations professionnelles"
                                : "Informations professionnelles"}
                </h2>
                <div className="flex justify-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <div
                            className={`h-3 w-3 rounded-full transition-colors duration-300 ${currentStep === 'personnel' ? "bg-white" : "bg-slate-300"}`}
                        />
                        <span className={`text-sm transition-colors duration-300 ${currentStep === 'personnel' ? "text-white" : "text-blue-300"}`}>
                            Étape 1
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div
                            className={`h-3 w-3 rounded-full transition-colors duration-300 ${currentStep === 'eglise' ? "bg-white" : "bg-blue-300"}`}
                        />
                        <span className={`text-sm transition-colors duration-300 ${currentStep === 'eglise' ? "text-white" : "text-blue-300"}`}>
                            Étape 2
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div
                            className={`h-3 w-3 rounded-full transition-colors duration-300 ${currentStep === 'professionnel' ? "bg-white" : "bg-blue-300"}`}
                        />
                        <span className={`text-sm transition-colors duration-300 ${currentStep === 'professionnel' ? "text-white" : "text-blue-300"}`}>
                            Étape 3
                        </span>
                    </div>
                </div>
            </div>

            <div className={`p-6 transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
                {currentStep === "personnel" ? (
                    <InfosPersonnelles
                        data={formData.personnel}
                        onSubmit={handlePersonnelSubmit}
                    />
                ) : currentStep === "eglise" ? (
                    <InfosEglise
                        data={formData.eglise}
                        onSubmit={handleEgliseSubmit}
                    />
                ) : currentStep === "professionnel" ? (
                    <InfosProfessionnels
                        data={formData.professionnel}
                        onSubmit={handleProfessionnelSubmit}
                    />
                ) : (<InfosProfessionnels
                    data={formData.professionnel}
                    onSubmit={handleProfessionnelSubmit}
                />)}

                <Footer
                    currentStep={currentStep}
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                    formData={formData}
                    isLastStep={currentStep === 'end'}
                    action={props.action}
                />
            </div>
        </div>
    );
}