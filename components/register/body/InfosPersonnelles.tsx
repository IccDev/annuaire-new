"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PersonnelData } from "@/types/interfaces/annuaire-register";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { uploadImage } from "@/services/storage";
import { toast } from "sonner";

const LANGUES = [
    "Anglais",
    "Français",
    "Italien",
    "Espagnol",
    "Néerlandais",
    "Allemand"
];

const personnelSchema = z.object({
    photo: z.string().optional(),
    genre: z.string().min(1, "Veuillez sélectionner votre genre"),
    nom: z.string().min(1, "Le nom est requis"),
    prenom: z.string().min(1, "Le prénom est requis"),
    email: z.string().email("Email invalide").min(1, "L'email est requis"),
    consentement_email: z.boolean(),
    gsm: z.string().min(1, "Le numéro de téléphone est requis"),
    consentement_gsm: z.boolean(),
    residence: z.object({
        pays: z.string().min(1, "Le pays est requis"),
        ville: z.string().min(1, "La ville est requise"),
    }),
    langues: z.array(z.string()).min(1, "Sélectionnez au moins une langue"),
});

type PersonnelFormValues = z.infer<typeof personnelSchema>;

interface InfosPersonnellesProps {
    data: PersonnelData;
    onSubmit: (data: PersonnelData) => void;
}

export default function InfosPersonnelles({ data, onSubmit }: InfosPersonnellesProps) {
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [countries, setCountries] = useState<Array<{ name: string }>>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [openCountry, setOpenCountry] = useState(false);
    const [openCity, setOpenCity] = useState(false);
    const [countrySearch, setCountrySearch] = useState("");
    const [citySearch, setCitySearch] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        getValues,
    } = useForm<PersonnelFormValues>({
        resolver: zodResolver(personnelSchema),
        defaultValues: {
            photo: data.photo || "",
            genre: data.genre || "",
            nom: data.nom || "",
            prenom: data.prenom || "",
            email: data.email || "",
            consentement_email: data.consentement_email || false,
            gsm: data.gsm || "",
            consentement_gsm: data.consentement_gsm || false,
            residence: {
                pays: data.residence?.pays || "",
                ville: data.residence?.ville || "",
            },
            langues: data.langues || [],
        },
    });

    const selectedCountry = watch("residence.pays");

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await fetch("https://countriesnow.space/api/v0.1/countries/positions");
                const data = await response.json();
                if (data.data) {
                    setCountries(data.data);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des pays:", error);
            }
        };
        fetchCountries();
    }, []);

    useEffect(() => {
        const fetchCities = async () => {
            if (selectedCountry) {
                try {
                    const response = await fetch("https://countriesnow.space/api/v0.1/countries/cities", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ country: selectedCountry }),
                    });
                    const data = await response.json();
                    if (data.data) {
                        setCities(data.data);
                    }
                } catch (error) {
                    console.error("Erreur lors de la récupération des villes:", error);
                }
            }
        };
        fetchCities();
    }, [selectedCountry]);

    const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPhotoPreview(reader.result as string);
                };
                reader.readAsDataURL(file);

                const downloadURL = await uploadImage(file);
                setValue("photo", downloadURL);
                toast.success("Photo téléchargée avec succès");
            } catch (error) {
                console.error("Erreur lors du téléchargement de la photo:", error);
                toast.error("Erreur lors du téléchargement de la photo");
            }
        }
    };

    const filteredCountries = countries
        .filter(country =>
            country.name.toLowerCase().includes(countrySearch.toLowerCase())
        )
        .slice(0, 10);

    const filteredCities = cities
        .filter(city =>
            city.toLowerCase().includes(citySearch.toLowerCase())
        )
        .slice(0, 10);

    return (
        <form id="personnel-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">

            <div className="space-y-4">
                <Label htmlFor="photo" className="block text-lg font-medium">Photo de profil</Label>
                <div className="flex flex-col items-center space-y-4">
                    <div className="relative group">
                        <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-blue-100 transition-all duration-300 group-hover:border-blue-300">
                            <Image
                                src={photoPreview || "/images/avatar.png"}
                                alt="Photo de profil"
                                layout="fill"
                                objectFit="cover"
                                className="transition-transform duration-300 group-hover:scale-110"
                            />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <span className="text-white text-sm">Modifier la photo</span>
                        </div>
                    </div>
                    <div className="w-full max-w-sm">
                        <label
                            htmlFor="photo"
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors duration-300"
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-8 h-8 mb-4 text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                </svg>
                                <p className="mb-2 text-sm text-blue-500"><span className="font-semibold">Cliquez pour télécharger</span> ou glissez et déposez</p>
                                <p className="text-xs text-blue-500">PNG, JPG ou GIF</p>
                            </div>
                            <Input
                                id="photo"
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label>Genre</Label>
                <RadioGroup
                    onValueChange={(value) => setValue("genre", value)}
                    defaultValue={getValues("genre")}
                    className="flex space-x-4"
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Mlle" id="mlle" />
                        <Label htmlFor="mlle">Mlle</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Mme" id="mme" />
                        <Label htmlFor="mme">Mme</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Mr" id="mr" />
                        <Label htmlFor="mr">Mr</Label>
                    </div>
                </RadioGroup>
                {errors.genre && (
                    <p className="text-sm text-red-500">{errors.genre.message}</p>
                )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="nom">Nom</Label>
                    <Input id="nom" {...register("nom")} placeholder="Votre nom de famille" />
                    {errors.nom && (
                        <p className="text-sm text-red-500">{errors.nom.message}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="prenom">Prénom</Label>
                    <Input id="prenom" {...register("prenom")} placeholder="Votre prénom" />
                    {errors.prenom && (
                        <p className="text-sm text-red-500">{errors.prenom.message}</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...register("email")} placeholder="Votre adresse email" />
                    {errors.email && (
                        <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="consentement_email"
                            checked={watch("consentement_email")}
                            onCheckedChange={(checked) => setValue("consentement_email", checked === true)}
                        />
                        <Label htmlFor="consentement_email">Autoriser l'affichage de mon email</Label>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="gsm">Téléphone</Label>
                    <Input id="gsm" {...register("gsm")} placeholder="Votre numéro de téléphone" />
                    {errors.gsm && (
                        <p className="text-sm text-red-500">{errors.gsm.message}</p>
                    )}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="consentement_gsm"
                            checked={watch("consentement_gsm")}
                            onCheckedChange={(checked) => setValue("consentement_gsm", checked === true)}
                        />
                        <Label htmlFor="consentement_gsm">Autoriser l'affichage de mon numéro</Label>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label>Pays</Label>
                    <Popover open={openCountry} onOpenChange={setOpenCountry}>
                        <PopoverTrigger asChild>
                            <button
                                role="combobox"
                                aria-expanded={openCountry}
                                className="w-full justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                            >
                                {selectedCountry || "Sélectionnez un pays"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                            <Command>
                                <CommandInput
                                    placeholder="Rechercher un pays..."
                                    onValueChange={setCountrySearch}
                                />
                                <CommandEmpty>Aucun pays trouvé</CommandEmpty>
                                <CommandGroup className="max-h-60 overflow-auto">
                                    {filteredCountries.map((country) => (
                                        <CommandItem
                                            key={country.name}
                                            value={country.name}
                                            onSelect={() => {
                                                setValue("residence.pays", country.name);
                                                setValue("residence.ville", "");
                                                setOpenCountry(false);
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    selectedCountry === country.name
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                )}
                                            />
                                            {country.name}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    {errors.residence?.pays && (
                        <p className="text-sm text-red-500">{errors.residence.pays.message}</p>
                    )}
                </div>

                {selectedCountry && (
                    <div className="space-y-2">
                        <Label>Ville</Label>
                        <Popover open={openCity} onOpenChange={setOpenCity}>
                            <PopoverTrigger asChild>
                                <button
                                    role="combobox"
                                    aria-expanded={openCity}
                                    className="w-full justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                                >
                                    {getValues("residence.ville") || "Sélectionnez une ville"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput
                                        placeholder="Rechercher une ville..."
                                        onValueChange={setCitySearch}
                                    />
                                    <CommandEmpty>Aucune ville trouvée</CommandEmpty>
                                    <CommandGroup className="max-h-60 overflow-auto">
                                        {filteredCities.map((city) => (
                                            <CommandItem
                                                key={city}
                                                value={city}
                                                onSelect={() => {
                                                    setValue("residence.ville", city);
                                                    setOpenCity(false);
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        getValues("residence.ville") === city
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                                {city}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        {errors.residence?.ville && (
                            <p className="text-sm text-red-500">{errors.residence.ville.message}</p>
                        )}
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <Label>Langues</Label>
                <div className="relative">
                    <Popover>
                        <PopoverTrigger asChild>
                            <button
                                type="button"
                                role="combobox"
                                aria-expanded={true}
                                className="w-full justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 flex items-center"
                            >
                                <span>
                                    {watch("langues").length > 0
                                        ? `${watch("langues").length} langue(s) sélectionnée(s)`
                                        : "Sélectionnez vos langues"}
                                </span>
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                            <Command>
                                <CommandInput placeholder="Rechercher une langue..." />
                                <CommandEmpty>Aucune langue trouvée</CommandEmpty>
                                <CommandGroup>
                                    {LANGUES.map((langue) => (
                                        <CommandItem
                                            key={langue}
                                            value={langue}
                                            onSelect={() => {
                                                const currentLangages = getValues("langues");
                                                if (currentLangages.includes(langue)) {
                                                    setValue(
                                                        "langues",
                                                        currentLangages.filter((l) => l !== langue)
                                                    );
                                                } else {
                                                    setValue("langues", [...currentLangages, langue]);
                                                }
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    watch("langues").includes(langue)
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                )}
                                            />
                                            {langue}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {watch("langues").map((langue) => (
                            <div
                                key={langue}
                                className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-900"
                            >
                                {langue}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setValue(
                                            "langues",
                                            watch("langues").filter((l) => l !== langue)
                                        );
                                    }}
                                    className="ml-1 rounded-full hover:text-red-500"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                {errors.langues && (
                    <p className="text-sm text-red-500">{errors.langues.message}</p>
                )}
            </div>
        </form>
    );
}