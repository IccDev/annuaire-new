"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { EgliseData } from "@/types/interfaces/annuaire-register";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Eglise } from "@/types/interfaces/annuaire";
import { get_churches } from "@/app/api/annuaire-api";

const egliseSchema = z.object({
    eglise: z.string().min(1, "Le nom de l'église est requis"),
    star: z.boolean(),
    departements: z.array(z.string()),
});

type EgliseFormValues = z.infer<typeof egliseSchema>;

interface InfosEgliseProps {
    data: EgliseData;
    onSubmit: (data: EgliseData) => void;
}



export default function InfosEglise({ data, onSubmit }: InfosEgliseProps) {
    const [departementInput, setDepartementInput] = useState("");
    const [selectedDepartements, setSelectedDepartements] = useState<string[]>(data.departements);
    const [eglises, setEglises] = useState<Eglise[]>([]);
    const [egliseSearch, setEgliseSearch] = useState(data.eglise || "");

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        getValues,
    } = useForm<EgliseFormValues>({
        resolver: zodResolver(egliseSchema),
        defaultValues: {
            eglise: data.eglise || "",
            star: data.star || false,
            departements: data.departements || []
        },
        mode: "onChange",
    });

    useEffect(() => {
        const fetchEglises = async () => {
            try {
                const response = await get_churches();
                setEglises(response);
            } catch (error) {
                console.error("Erreur lors de la récupération des eglises:", error);
            }
        };
        fetchEglises();
    }, []);

    const isStarSelected = watch("star");

    const handleDepartementAdd = () => {
        const trimmedInput = departementInput.trim();
        if (trimmedInput && !selectedDepartements.includes(trimmedInput)) {
            const newDepartements = [...selectedDepartements, trimmedInput];
            setSelectedDepartements(newDepartements);
            setValue("departements", newDepartements);
            setDepartementInput("");
        }
    };

    const handleDepartementRemove = (departement: string) => {
        const newDepartements = selectedDepartements.filter(d => d !== departement);
        setSelectedDepartements(newDepartements);
        setValue("departements", newDepartements);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleDepartementAdd();
        }
    };

    return (
        <form id="eglise-form" onSubmit={handleSubmit((data) => onSubmit(data as EgliseData))} className="space-y-8">
            <div className="space-y-2">
                <Label htmlFor="eglise">Nom de l'église<span className="text-red-500">*</span></Label>
                <div className="relative w-full">
                    <Input
                        type="text"
                        placeholder="Nom de votre église ou sélectionnez dans la liste..."
                        list="eglises-list"
                        value={egliseSearch}
                        onChange={e => {
                            setEgliseSearch(e.target.value);
                            setValue("eglise", e.target.value, { shouldValidate: true });
                        }}
                        className="w-full pr-8"
                    />
                    <datalist id="eglises-list">
                        {eglises.map((eglise) => (
                            <option key={eglise.nom} value={eglise.nom} />
                        ))}
                    </datalist>
                </div>
                {errors.eglise && (
                    <p className="text-sm text-red-500">{errors.eglise.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label>Je suis STAR (Serviteur Travaillant Activement pour le Royaume)</Label>
                <RadioGroup
                    defaultValue={data.star ? "oui" : "non"}
                    onValueChange={(value) => setValue("star", value === "oui")}
                    className="flex items-center space-x-4"
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="oui" id="star-oui" />
                        <Label htmlFor="star-oui">Oui</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="non" id="star-non" />
                        <Label htmlFor="star-non">Non</Label>
                    </div>
                </RadioGroup>
            </div>

            {isStarSelected && (
                <div className="space-y-4">
                    <Label>Départements</Label>
                    
                    {/* Liste des départements ajoutés */}
                    {selectedDepartements.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                            {selectedDepartements.map((departement, index) => (
                                <Badge key={`${departement}-${index}`} variant="secondary" className="text-sm">
                                    {departement}
                                    <button
                                        type="button"
                                        onClick={() => handleDepartementRemove(departement)}
                                        className="ml-1 hover:text-red-500"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    )}

                    {/* Champ de saisie + Bouton Ajouter */}
                    <div className="flex gap-2">
                        <Input
                            type="text"
                            placeholder="Entrez un département..."
                            value={departementInput}
                            onChange={(e) => setDepartementInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="flex-1"
                        />
                        <Button
                            type="button"
                            onClick={handleDepartementAdd}
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Ajouter
                        </Button>
                    </div>
                </div>
            )}
        </form>
    );
}