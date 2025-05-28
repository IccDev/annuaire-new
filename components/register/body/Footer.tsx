"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { create_annuaire_user } from "@/app/api/annuaire-api";
import { RegisterFormData } from "@/types/interfaces/annuaire-register";
import { toast } from "sonner";

type Step = "personnel" | "eglise" | "professionnel" | "end";
interface FooterProps {
  currentStep: Step;
  onNext: (value: Step) => void;
  onPrevious: (value: Step) => void;
  formData: RegisterFormData;
  isLastStep: boolean;
  action: "update" | "create";
}

export default function Footer({ currentStep, onPrevious, formData, isLastStep, onNext, action }: FooterProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!isLastStep) return;
    setIsSubmitting(true);

    try {
        if (!formData.personnel.email || !formData.personnel.nom || !formData.personnel.prenom) {
            toast.error("Veuillez compléter toutes les informations personnelles requises");
            setIsSubmitting(false);
            return;
        }

        if (!formData.eglise.eglise) {
            toast.error("Veuillez indiquer le nom de votre église");
            setIsSubmitting(false);
            return;
        }

        if (action === "create") {
            const response = await create_annuaire_user(formData);
            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.message?.includes("email")) {
                toast.error("Cette adresse email est déjà utilisée. Veuillez en utiliser une autre.");
                } else {
                toast.error("Une erreur est survenue lors de l'inscription. Veuillez réessayer.");
                }
                setIsSubmitting(false);
                return;
            }

            toast.success("Inscription réussie ! Vous allez être redirigé vers la page d'accueil.");
        }

        if (action === "update") {
            console.log("update data: ", formData);
        }
        
        setTimeout(() => {
            router.push("/home");
        }, 3000);
    } catch (error) {
        console.error("Erreur lors de l'inscription:", error);
        toast.error("Une erreur est survenue lors de l'inscription. Veuillez réessayer.");
        setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
      {currentStep !== "personnel" ? (
        <Button
          type="button"
          variant="outline"
          onClick={() => onPrevious(currentStep)}
          disabled={isSubmitting}
        >
          Précédent
        </Button>
      ) : (
        <div></div>
      )}

      <Button
        type={isLastStep ? "button" : "submit"}
        form={!isLastStep ? `${currentStep}-form` : undefined}
        disabled={isSubmitting}
        className={isLastStep ? "bg-green-600 hover:bg-green-700" : ""}
        onClick={isLastStep ? handleSubmit : undefined}
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Traitement en cours...
          </>
        ) : isLastStep ? (
          "Finaliser l'inscription"
        ) : (
          "Suivant"
        )}
      </Button>
    </div>
  );
}