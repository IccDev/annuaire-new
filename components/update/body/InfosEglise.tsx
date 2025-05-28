"use client";

import { useEffect, useState, useCallback } from "react";
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
    const [egliseSearch, setEgliseSearch] = useState(data.eglise || "");
    const [commandInputEgliseSearch, setCommandInputEgliseSearch] = useState("");
    const [openEglise, setOpenEglise] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        getValues,
        reset, 
    } = useForm<EgliseFormValues>({
        resolver: zodResolver(egliseSchema),
        defaultValues: data,
        mode: "onChange",
    });


    useEffect(() => {
        if (data) {
            const defaultData = {
                eglise: data.eglise || "",
                star: data.star || false,
                departements: data.departements || [],
            };
            reset(defaultData);
            setSelectedDepartements(data.departements || []);
            setEgliseSearch(data.eglise || "");
        }
    }, [data, reset]);

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

    useEffect(() => {
        if (selectedEglise !== egliseSearch && !openEglise) {
            setEgliseSearch(selectedEglise || "");
        }
    }, [selectedEglise, egliseSearch, openEglise]);


    useEffect(() => {
        if (openEglise) {
            setCommandInputEgliseSearch(egliseSearch);
        }
    }, [openEglise, egliseSearch]);

    const handleMainEgliseInputChange = useCallback((inputValue: string) => {
        setEgliseSearch(inputValue);
        if (!openEglise && inputValue.length > 0) {
            setOpenEglise(true);
        }
    }, [openEglise]);


    const handleEgliseSelect = (value: string) => {
        setValue("eglise", value, { shouldValidate: true });
        setEgliseSearch(value);
        setOpenEglise(false);
    };


    const handleCommandSearchChange = useCallback((searchValue: string) => {
        setCommandInputEgliseSearch(searchValue);
    }, []);

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
            eglise.nom.toLowerCase().includes(commandInputEgliseSearch.toLowerCase())
        )
        .slice(0, 10);

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