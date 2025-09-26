import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Check, ChevronsUpDown } from "lucide-react";
import { ProfessionnelData, domaines, user_status } from "@/types/interfaces/annuaire-register";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";


const educationSchema = z.object({
    titre: z.string().optional(),
    domaine: z.string().optional(),
    specialite: z.string().optional(),
    periode_debut: z.string().optional().refine((val) => {
        if (!val || val === "") return true; // Champ optionnel
        return /^(0[1-9]|1[0-2])\/\d{4}$/.test(val);
    }, { message: "Format invalide. Utilisez MM/YYYY (ex: 09/2020)" }),
    periode_fin: z.string().optional().refine((val) => {
        if (!val || val === "") return true; // Champ optionnel
        return /^(0[1-9]|1[0-2])\/\d{4}$/.test(val);
    }, { message: "Format invalide. Utilisez MM/YYYY (ex: 12/2023)" }),
    competences_acquises: z.string().optional(),
});

const professionSchema = z.object({
    titre: z.string().optional(),
    domaine: z.string().optional(),
    periode_debut: z.string().optional().refine((val) => {
        if (!val || val === "") return true;
        return /^(0[1-9]|1[0-2])\/\d{4}$/.test(val);
    }, { message: "Format invalide. Utilisez MM/YYYY (ex: 01/2021)" }),
    periode_fin: z.string().optional().refine((val) => {
        if (!val || val === "") return true;
        return /^(0[1-9]|1[0-2])\/\d{4}$/.test(val);
    }, { message: "Format invalide. Utilisez MM/YYYY (ex: 06/2024)" }),
    task: z.string().optional(),
});

const diplomeSchema = z.object({
    nom: z.string().optional(),
});

const certificationSchema = z.object({
    nom: z.string().optional(),
});

const competenceSchema = z.object({
    nom: z.string().optional(),
});

const professionnelSchema = z.object({
    educations: z.array(educationSchema).optional(),
    professions: z.array(professionSchema).optional(),
    diplomes: z.array(diplomeSchema).optional(),
    certifications: z.array(certificationSchema).optional(),
    competences: z.array(competenceSchema).optional(),
});

type ProfessionnelFormValues = z.infer<typeof professionnelSchema>;

interface InfosProfessionnelsProps {
    data: ProfessionnelData;
    onSubmit: (data: ProfessionnelFormValues) => void;
}

export default function InfosProfessionnels({ data, onSubmit }: InfosProfessionnelsProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        watch,
        setValue,
        reset,
    } = useForm<ProfessionnelFormValues>({
        resolver: zodResolver(professionnelSchema),
        defaultValues: {
            educations: data.educations && data.educations.length > 0 ? data.educations : [{ titre: "", domaine: "", specialite: "", periode_debut: "", periode_fin: "", competences_acquises: "" }],
            professions: data.professions && data.professions.length > 0 ? data.professions : [{ titre: "", domaine: "", periode_debut: "", periode_fin: "", task: "" }],
            diplomes: data.diplomes && data.diplomes.length > 0 ? data.diplomes : [],
            certifications: data.certifications && data.certifications.length > 0 ? data.certifications : [],
            competences: data.competences && data.competences.length > 0 ? data.competences : [{ nom: "" }],
        }
    });


    const {
        fields: educationFields,
        append: appendEducation,
        remove: removeEducation,
    } = useFieldArray({
        control,
        name: "educations",
    });

    const {
        fields: professionFields,
        append: appendProfession,
        remove: removeProfession,
    } = useFieldArray({
        control,
        name: "professions",
    });

    const {
        fields: diplomeFields,
        append: appendDiplome,
        remove: removeDiplome,
    } = useFieldArray({
        control,
        name: "diplomes",
    });

    const {
        fields: certificationFields,
        append: appendCertification,
        remove: removeCertification,
    } = useFieldArray({
        control,
        name: "certifications",
    });

    const {
        fields: competenceFields,
        append: appendCompetence,
        remove: removeCompetence,
    } = useFieldArray({
        control,
        name: "competences",
    });

    return (
        <form id="professionnel-form" onSubmit={handleSubmit((data) => onSubmit(data))} className="space-y-8">

            <div className="space-y-4 pb-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <Label className="text-lg font-medium">Activités professionnelles</Label>
                </div>
                {professionFields.map((field, index) => (
                    <div key={field.id} className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4>Profession {index + 1}</h4>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeProfession(index)}
                            >
                                <Trash2 className="h-4 w-4 text-red-700" />
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Fonction</Label>
                                <Input
                                    {...register(`professions.${index}.titre`)}
                                    placeholder="Développeur web, Juriste, Comptable…
"
                                />
                                {errors.professions?.[index]?.titre && (
                                    <p className="text-sm text-red-500">
                                        {errors.professions[index]?.titre?.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>Statut professionnel</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className="w-full justify-between"
                                        >
                                            {watch(`professions.${index}.domaine`) || "Sélectionner un statut"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput placeholder="Rechercher un statut..." />
                                            <CommandEmpty>Aucun statut trouvé.</CommandEmpty>
                                            <CommandGroup>
                                                {user_status.map((statusItem) => (
                                                    <CommandItem
                                                        key={statusItem}
                                                        value={statusItem}
                                                        onSelect={() => {
                                                            setValue(`professions.${index}.domaine`, statusItem);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                watch(`professions.${index}.domaine`) === statusItem
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                        {statusItem}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                {errors.professions?.[index]?.domaine && (
                                    <p className="text-sm text-red-500">
                                        {errors.professions[index]?.domaine?.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>Période de début</Label>
                                <Input
                                    {...register(`professions.${index}.periode_debut`)}
                                    placeholder="MM/YYYY"
                                    maxLength={7}
                                />
                                {errors.professions?.[index]?.periode_debut && (
                                    <p className="text-sm text-red-500">
                                        {errors.professions[index]?.periode_debut?.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>Période de fin</Label>
                                <Input
                                    {...register(`professions.${index}.periode_fin`)}
                                    placeholder="MM/YYYY"
                                    maxLength={7}
                                />
                                {errors.professions?.[index]?.periode_fin && (
                                    <p className="text-sm text-red-500">
                                        {errors.professions[index]?.periode_fin?.message}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Tâches effectuées</Label>
                            <Textarea
                                {...register(`professions.${index}.task`)}
                                placeholder="Décrivez les principales tâches et responsabilités de cette profession..."
                                className="min-h-[100px]"
                            />
                            {errors.professions?.[index]?.task && (
                                <p className="text-sm text-red-500">
                                    {errors.professions[index]?.task?.message}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendProfession({ titre: "", domaine: "", periode_debut: "", periode_fin: "", task: "" })}
                    className="w-full bg-slate-600 hover:bg-slate-400 text-white mt-4"
                >
                    Ajouter une profession
                </Button>
            </div>

            <div className="space-y-4 pb-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <Label className="text-lg font-medium">Éducation</Label>
                </div>
                {educationFields.map((field, index) => (
                    <div key={field.id} className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4>Éducation {index + 1}</h4>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeEducation(index)}
                            >
                                <Trash2 className="h-4 w-4 text-red-700" />
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label>École</Label>
                                <Input
                                    {...register(`educations.${index}.titre`)}
                                    placeholder="Ex: Université libre de Bruxelles..."
                                />
                                {errors.educations?.[index]?.titre && (
                                    <p className="text-sm text-red-500">
                                        {errors.educations[index]?.titre?.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`educations.${index}.domaine`}>Domaine</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <div className="relative w-full">
                                            <Input
                                                {...register(`educations.${index}.domaine`)}
                                                placeholder="Sélectionner ou saisir un domaine"
                                                className="w-full pr-10"
                                                id={`educations.${index}.domaine`}
                                                autoComplete="off"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-0 top-1/2 transform -translate-y-1/2 h-full px-3 text-muted-foreground hover:text-foreground"
                                                tabIndex={-1}
                                            >
                                                <ChevronsUpDown className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                        <Command>
                                            <CommandInput
                                                placeholder="Rechercher ou saisir un domaine..."
                                                value={watch(`educations.${index}.domaine`)}
                                                onValueChange={(search) => setValue(`educations.${index}.domaine`, search, { shouldValidate: true, shouldDirty: true })}
                                            />
                                            <CommandEmpty>Aucun domaine trouvé. Vous pouvez saisir le vôtre.</CommandEmpty>
                                            <CommandGroup>
                                                {domaines
                                                    .filter(d => d.toLowerCase().includes((watch(`educations.${index}.domaine`) || '').toLowerCase()))
                                                    .map((domaineItem) => (
                                                        <CommandItem
                                                            key={domaineItem}
                                                            value={domaineItem}
                                                            onSelect={(currentValue) => {
                                                                setValue(`educations.${index}.domaine`, currentValue === watch(`educations.${index}.domaine`) ? "" : currentValue, { shouldValidate: true });
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    watch(`educations.${index}.domaine`) === domaineItem
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                            {domaineItem}
                                                        </CommandItem>
                                                    ))}
                                            </CommandGroup>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                {errors.educations?.[index]?.domaine && (
                                    <p className="text-sm text-red-500">
                                        {errors.educations[index]?.domaine?.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>Période de début</Label>
                                <Input
                                    {...register(`educations.${index}.periode_debut`)}
                                    placeholder="MM/YYYY"
                                    maxLength={7}
                                />
                                {errors.educations?.[index]?.periode_debut && (
                                    <p className="text-sm text-red-500">
                                        {errors.educations[index]?.periode_debut?.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>Période de fin</Label>
                                <Input
                                    {...register(`educations.${index}.periode_fin`)}
                                    placeholder="MM/YYYY"
                                    maxLength={7}
                                />
                                {errors.educations?.[index]?.periode_fin && (
                                    <p className="text-sm text-red-500">
                                        {errors.educations[index]?.periode_fin?.message}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Compétences acquises</Label>
                            <Textarea
                                {...register(`educations.${index}.competences_acquises`)}
                                placeholder="Décrivez les compétences et connaissances acquises lors de cette formation..."
                                className="min-h-[100px]"
                            />
                            {errors.educations?.[index]?.competences_acquises && (
                                <p className="text-sm text-red-500">
                                    {errors.educations[index]?.competences_acquises?.message}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendEducation({ titre: "", domaine: "", specialite: "", periode_debut: "", periode_fin: "", competences_acquises: "" })}
                    className="w-full bg-slate-600 hover:bg-slate-400 text-white mt-4"
                >
                    Ajouter une éducation
                </Button>
            </div>




            <div className="space-y-4 pb-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <Label className="text-lg font-medium">Diplômes & Certifications
                    </Label>
                </div>
                {diplomeFields.map((field, index) => (
                    <div key={field.id} className="flex items-center space-x-4">
                        <div className="flex-grow space-y-2">
                            <Input
                                {...register(`diplomes.${index}.nom`)}
                                placeholder="Nom du diplôme"
                            />
                            {errors.diplomes?.[index]?.nom && (
                                <p className="text-sm text-red-500">
                                    {errors.diplomes[index]?.nom?.message}
                                </p>
                            )}
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeDiplome(index)}
                        >
                            <Trash2 className="h-4 w-4 text-red-700" />
                        </Button>
                    </div>
                ))}
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendDiplome({ nom: "" })}
                    className="w-full bg-slate-600 hover:bg-slate-400 text-white mt-4"
                >
                    Ajouter un diplôme
                </Button>
            </div>

            <div className="space-y-4 pb-6">
                <div className="flex items-center justify-between">
                    <Label className="text-lg font-medium">Compétences</Label>
                </div>
                {competenceFields.map((field, index) => (
                    <div key={field.id} className="flex items-center space-x-4">
                        <div className="flex-grow space-y-2">
                            <Input
                                {...register(`competences.${index}.nom`)}
                                placeholder=""
                            />
                            {errors.competences?.[index]?.nom && (
                                <p className="text-sm text-red-500">
                                    {errors.competences[index]?.nom?.message}
                                </p>
                            )}
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeCompetence(index)}
                        >
                            <Trash2 className="h-4 w-4 text-red-700" />
                        </Button>
                    </div>
                ))}
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendCompetence({ nom: "" })}
                    className="w-full bg-slate-600 hover:bg-slate-400 text-white mt-4"
                >
                    Ajouter une compétence
                </Button>
            </div>

            <div className="space-y-4 pb-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <Label className="text-lg font-medium">Plus d’informations</Label>
                </div>
                {certificationFields.map((field, index) => (
                    <div key={field.id} className="flex items-center space-x-4">
                        <div className="flex-grow space-y-2">
                            <Input
                                {...register(`certifications.${index}.nom`)}
                                placeholder=""
                            />
                            {errors.certifications?.[index]?.nom && (
                                <p className="text-sm text-red-500">
                                    {errors.certifications[index]?.nom?.message}
                                </p>
                            )}
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeCertification(index)}
                        >
                            <Trash2 className="h-4 w-4 text-red-700" />
                        </Button>
                    </div>
                ))}
            </div>
        </form>
    );
}
