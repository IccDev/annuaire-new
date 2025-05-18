"use client";

import { useEffect, useState } from "react";
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
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { departements as DEPARTEMENTS } from "@/types/interfaces/annuaire-register";
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
    const [openDepartement, setOpenDepartement] = useState(false);
    const [customDepartement, setCustomDepartement] = useState("");
    const [selectedDepartements, setSelectedDepartements] = useState<string[]>(data.departements);
    const [eglises, setEglises] = useState<Eglise[]>([]);
    const [egliseSearch, setEgliseSearch] = useState("");
    const [openEglise, setOpenEglise] = useState(false);

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

    const handleDepartementSelect = (departement: string) => {
        if (!selectedDepartements.includes(departement)) {
            const newDepartements = [...selectedDepartements, departement];
            setSelectedDepartements(newDepartements);
            setValue("departements", newDepartements);
        }
        setOpenDepartement(false);
    };

    const selectedEglise = watch("eglise");

    const handleCustomDepartementAdd = () => {
        if (customDepartement && !selectedDepartements.includes(customDepartement)) {
            const newDepartements = [...selectedDepartements, customDepartement];
            setSelectedDepartements(newDepartements);
            setValue("departements", newDepartements);
            setCustomDepartement("");
        }
    };

    const handleDepartementRemove = (departement: string) => {
        const newDepartements = selectedDepartements.filter(d => d !== departement);
        setSelectedDepartements(newDepartements);
        setValue("departements", newDepartements);
    };

    const filteredEglise = eglises
        .filter(eglise =>
            eglise.nom.toLowerCase().includes(egliseSearch.toLowerCase())
        )
        .slice(0, 10);

    return (
        <form id="eglise-form" onSubmit={handleSubmit((data) => onSubmit(data as EgliseData))} className="space-y-8">
            <div className="space-y-2">
                <Label htmlFor="eglise">Nom de l'église</Label>
                <Popover open={openEglise} onOpenChange={setOpenEglise}>
                    <PopoverTrigger asChild>
                        <button
                            role="combobox"
                            aria-expanded={openEglise}
                            className="w-full justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                        >
                            {selectedEglise || "Sélectionnez un pays"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                        <Command>
                            <CommandInput
                                placeholder="Rechercher un pays..."
                                onValueChange={setEgliseSearch}
                            />
                            <CommandEmpty>Aucun pays trouvé</CommandEmpty>
                            <CommandGroup className="max-h-60 overflow-auto">
                                {filteredEglise.map((eglise) => (
                                    <CommandItem
                                        key={eglise.nom}
                                        value={eglise.nom}
                                        onSelect={() => {
                                            setValue("eglise", eglise.nom);
                                            setOpenEglise(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                selectedEglise === eglise.nom
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                        {eglise.nom}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </Command>
                    </PopoverContent>
                </Popover>
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
                    <div className="flex flex-wrap gap-2 mb-2">
                        {selectedDepartements.map((departement) => (
                            <Badge key={departement} variant="secondary" className="text-sm">
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

                    <Popover open={openDepartement} onOpenChange={setOpenDepartement}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openDepartement}
                                className="w-full justify-between"
                            >
                                Sélectionner des départements...
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                            <Command>
                                <CommandInput 
                                    placeholder="Rechercher un département..." 
                                    value={customDepartement} 
                                    onValueChange={setCustomDepartement} 
                                />
                                <CommandEmpty>
                                    {customDepartement && (
                                        <button
                                            type="button"
                                            className="w-full p-2 text-sm text-left hover:bg-slate-100 flex items-center"
                                            onClick={handleCustomDepartementAdd}
                                        >
                                            <span>Ajouter "{customDepartement}"</span>
                                        </button>
                                    )}
                                    {!customDepartement && <span className="p-2 text-sm">Aucun département trouvé</span>}
                                </CommandEmpty>
                                <CommandGroup>
                                    {DEPARTEMENTS
                                        .filter(dept => dept.toLowerCase().includes(customDepartement.toLowerCase()))
                                        .map((departement, index) => (
                                            <CommandItem
                                                key={`${departement}-${index}`}
                                                value={departement}
                                                onSelect={() => handleDepartementSelect(departement)}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        selectedDepartements.includes(departement)
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                                {departement}
                                            </CommandItem>
                                        ))}
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
            )}
        </form>
    );
}