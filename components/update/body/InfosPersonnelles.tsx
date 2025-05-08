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
    const [openLangues, setOpenLangues] = useState(false);
    const [selectedLangues, setSelectedLangues] = useState<string[]>(data.langues || []);
    const [photoPreview, setPhotoPreview] = useState<string | null>(data.photo || null);
    const [isUploading, setIsUploading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
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

    useEffect(() => {
        setValue("langues", selectedLangues);
    }, [selectedLangues, setValue]);

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            const downloadURL = await uploadImage(file);
            setValue("photo", downloadURL);
            setIsUploading(false);
            toast.success("Photo téléchargée avec succès");
        } catch (error) {
            console.error("Erreur lors du téléchargement de l'image:", error);
            toast.error("Erreur lors du téléchargement de l'image");
            setIsUploading(false);
        }
    };

    const handleLangueSelect = (langue: string) => {
        setSelectedLangues((current) => {
            if (current.includes(langue)) {
                return current.filter((l) => l !== langue);
            } else {
                return [...current, langue];
            }
        });
    };

    const removeLangue = (langue: string) => {
        setSelectedLangues((current) => current.filter((l) => l !== langue));
    };

    const onFormSubmit = (data: PersonnelFormValues) => {
        onSubmit(data as PersonnelData);
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative h-32 w-32 rounded-full overflow-hidden border-2 border-slate-300">
                    {photoPreview ? (
                        <Image
                            src={photoPreview}
                            alt="Photo de profil"
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="h-full w-full bg-slate-200 flex items-center justify-center">
                            <span className="text-slate-500 text-4xl">?</span>
                        </div>
                    )}
                    {isUploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                        </div>
                    )}
                </div>
                <div>
                    <Label htmlFor="photo" className="cursor-pointer px-4 py-2 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors">
                        {photoPreview ? "Changer la photo" : "Ajouter une photo"}
                    </Label>
                    <input
                        id="photo"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoChange}
                        disabled={isUploading}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Genre<span className="text-red-500">*</span></Label>
                <RadioGroup
                    defaultValue={data.genre}
                    className="flex space-x-4"
                    {...register("genre")}
                    onValueChange={(value) => setValue("genre", value)}
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="homme" id="homme" />
                        <Label htmlFor="homme">Homme</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="femme" id="femme" />
                        <Label htmlFor="femme">Femme</Label>
                    </div>
                </RadioGroup>
                {errors.genre && (
                    <p className="text-sm text-red-500">{errors.genre.message}</p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="nom">Nom<span className="text-red-500">*</span></Label>
                    <Input
                        id="nom"
                        placeholder="Votre nom"
                        {...register("nom")}
                        className={errors.nom ? "border-red-500" : ""}
                    />
                    {errors.nom && (
                        <p className="text-sm text-red-500">{errors.nom.message}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="prenom">Prénom<span className="text-red-500">*</span></Label>
                    <Input
                        id="prenom"
                        placeholder="Votre prénom"
                        {...register("prenom")}
                        className={errors.prenom ? "border-red-500" : ""}
                    />
                    {errors.prenom && (
                        <p className="text-sm text-red-500">{errors.prenom.message}</p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email<span className="text-red-500">*</span></Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="votre.email@exemple.com"
                    {...register("email")}
                    className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
                <div className="flex items-center space-x-2 mt-2">
                    <Checkbox
                        id="consentement_email"
                        {...register("consentement_email")}
                        defaultChecked={data.consentement_email}
                    />
                    <Label htmlFor="consentement_email" className="text-sm text-gray-600">
                        J'accepte de recevoir des emails
                    </Label>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="gsm">Téléphone mobile<span className="text-red-500">*</span></Label>
                <Input
                    id="gsm"
                    placeholder="+32 123 456 789"
                    {...register("gsm")}
                    className={errors.gsm ? "border-red-500" : ""}
                />
                {errors.gsm && (
                    <p className="text-sm text-red-500">{errors.gsm.message}</p>
                )}
                <div className="flex items-center space-x-2 mt-2">
                    <Checkbox
                        id="consentement_gsm"
                        {...register("consentement_gsm")}
                        defaultChecked={data.consentement_gsm}
                    />
                    <Label htmlFor="consentement_gsm" className="text-sm text-gray-600">
                        J'accepte de recevoir des SMS
                    </Label>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="pays">Pays<span className="text-red-500">*</span></Label>
                    <Input
                        id="pays"
                        placeholder="Votre pays"
                        {...register("residence.pays")}
                        className={errors.residence?.pays ? "border-red-500" : ""}
                    />
                    {errors.residence?.pays && (
                        <p className="text-sm text-red-500">{errors.residence.pays.message}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="ville">Ville<span className="text-red-500">*</span></Label>
                    <Input
                        id="ville"
                        placeholder="Votre ville"
                        {...register("residence.ville")}
                        className={errors.residence?.ville ? "border-red-500" : ""}
                    />
                    {errors.residence?.ville && (
                        <p className="text-sm text-red-500">{errors.residence.ville.message}</p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label>Langues<span className="text-red-500">*</span></Label>
                <div className="flex flex-wrap gap-2 mb-2">
                    {selectedLangues.map((langue) => (
                        <div
                            key={langue}
                            className="flex items-center bg-slate-100 rounded-full px-3 py-1"
                        >
                            <span className="text-sm">{langue}</span>
                            <button
                                type="button"
                                onClick={() => removeLangue(langue)}
                                className="ml-2 text-slate-500 hover:text-slate-700"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>
                <Popover open={openLangues} onOpenChange={setOpenLangues}>
                    <PopoverTrigger asChild>
                        <button
                            type="button"
                            className={cn(
                                "w-full flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                                errors.langues ? "border-red-500" : ""
                            )}
                        >
                            <span>Sélectionner des langues</span>
                            <ChevronsUpDown className="h-4 w-4 opacity-50" />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                        <Command>
                            <CommandInput placeholder="Rechercher une langue..." />
                            <CommandEmpty>Aucune langue trouvée.</CommandEmpty>
                            <CommandGroup>
                                {LANGUES.map((langue) => (
                                    <CommandItem
                                        key={langue}
                                        onSelect={() => handleLangueSelect(langue)}
                                        className="flex items-center"
                                    >
                                        <div
                                            className={cn(
                                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
                                                selectedLangues.includes(langue)
                                                    ? "bg-primary border-primary text-primary-foreground"
                                                    : "opacity-50 [&_svg]:invisible"
                                            )}
                                        >
                                            <Check className={cn("h-3 w-3")} />
                                        </div>
                                        <span>{langue}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </Command>
                    </PopoverContent>
                </Popover>
                {errors.langues && (
                    <p className="text-sm text-red-500">{errors.langues.message}</p>
                )}
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