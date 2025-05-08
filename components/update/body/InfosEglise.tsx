"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { EgliseData } from "@/types/interfaces/annuaire-register";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { departements as DEPARTEMENTS } from "@/types/interfaces/annuaire-register";

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
    const [openDepartement, setOpenDepartement] = useState(false);
    const [customDepartement, setCustomDepartement] = useState("");
    const [selectedDepartements, setSelectedDepartements] = useState<string[]>(data.departements || []);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm<EgliseFormValues>({
        resolver: zodResolver(egliseSchema),
        defaultValues: {
            eglise: data.eglise || "",
            star: data.star || false,
            departements: data.departements || []
        },
    });

    const handleDepartementSelect = (departement: string) => {
        setSelectedDepartements((current) => {
            if (current.includes(departement)) {
                return current.filter((d) => d !== departement);
            } else {
                return [...current, departement];
            }
        });
    };

    const addCustomDepartement = () => {
        if (customDepartement.trim() && !selectedDepartements.includes(customDepartement.trim())) {
            setSelectedDepartements((current) => [...current, customDepartement.trim()]);
            setCustomDepartement("");
        }
    };

    const removeDepartement = (departement: string) => {
        setSelectedDepartements((current) => current.filter((d) => d !== departement));
    };

    const onFormSubmit = (data: EgliseFormValues) => {
        data.departements = selectedDepartements;
        onSubmit(data as EgliseData);
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="eglise">Nom de l'église<span className="text-red-500">*</span></Label>
                <Input
                    id="eglise"
                    placeholder="Nom de votre église"
                    {...register("eglise")}
                    className={errors.eglise ? "border-red-500" : ""}
                />
                {errors.eglise && (
                    <p className="text-sm text-red-500">{errors.eglise.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label>Êtes-vous un STAR?</Label>
                <RadioGroup
                    defaultValue={data.star ? "true" : "false"}
                    className="flex space-x-4"
                    onValueChange={(value) => setValue("star", value === "true")}
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="true" id="star-true" />
                        <Label htmlFor="star-true">Oui</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="false" id="star-false" />
                        <Label htmlFor="star-false">Non</Label>
                    </div>
                </RadioGroup>
            </div>

            <div className="space-y-2">
                <Label>Départements</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                    {selectedDepartements.map((departement) => (
                        <div
                            key={departement}
                            className="flex items-center bg-slate-100 rounded-full px-3 py-1"
                        >
                            <span className="text-sm">{departement}</span>
                            <button
                                type="button"
                                onClick={() => removeDepartement(departement)}
                                className="ml-2 text-slate-500 hover:text-slate-700"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex space-x-2">
                    <Popover open={openDepartement} onOpenChange={setOpenDepartement}>
                        <PopoverTrigger asChild>
                            <button
                                type="button"
                                className="flex-1 flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                            >
                                <span>Sélectionner des départements</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-50" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                            <Command>
                                <CommandInput placeholder="Rechercher un département..." />
                                <CommandEmpty>Aucun département trouvé.</CommandEmpty>
                                <CommandGroup>
                                    {DEPARTEMENTS.map((departement) => (
                                        <CommandItem
                                            key={departement}
                                            onSelect={() => handleDepartementSelect(departement)}
                                            className="flex items-center"
                                        >
                                            <div
                                                className={cn(
                                                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
                                                    selectedDepartements.includes(departement)
                                                        ? "bg-primary border-primary text-primary-foreground"
                                                        : "opacity-50 [&_svg]:invisible"
                                                )}
                                            >
                                                <Check className={cn("h-3 w-3")} />
                                            </div>
                                            <span>{departement}</span>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <div className="flex">
                        <Input
                            placeholder="Autre département"
                            value={customDepartement}
                            onChange={(e) => setCustomDepartement(e.target.value)}
                            className="rounded-r-none"
                        />
                        <Button
                            type="button"
                            onClick={addCustomDepartement}
                            className="rounded-l-none"
                            variant="secondary"
                            disabled={!customDepartement.trim()}
                        >
                            Ajouter
                        </Button>
                    </div>
                </div>
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    className="w-full bg-slate-700 text-white py-2 px-4 rounded-md hover:bg-slate-600 transition-colors"
                >
                    Continuer
                </button>
            </div>
        </form>
    );
}