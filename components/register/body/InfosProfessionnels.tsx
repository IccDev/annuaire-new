import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Check, ChevronsUpDown } from "lucide-react";
import { ProfessionnelData, domaines, user_status } from "@/types/interfaces/annuaire-register";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const educationSchema = z.object({
    titre: z.string().min(1, "Le titre est requis"),
    domaine: z.string().min(1, "Le domaine est requis"),
    specialite: z.string().min(0, ""),
});

const professionSchema = z.object({
    titre: z.string().min(1, "Le titre est requis"),
    domaine: z.string().min(1, "Le domaine est requis")
});

const diplomeSchema = z.object({
    nom: z.string().min(1, "Le nom du diplôme est requis"),
});

const certificationSchema = z.object({
    nom: z.string().min(1, "Le nom de la certification est requis"),
});

const competenceSchema = z.object({
    nom: z.string().min(1, "Le nom de la compétence est requis"),
});

const professionnelSchema = z.object({
    educations: z.array(educationSchema).min(1, "Au moins une éducation est requise"),
    professions: z.array(professionSchema).min(1, "Au moins une profession est requise"),
    diplomes: z.array(diplomeSchema),
    certifications: z.array(certificationSchema),
    competences: z.array(competenceSchema).min(1, "Au moins une compétence est requise"),
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
    } = useForm<ProfessionnelFormValues>({
        resolver: zodResolver(professionnelSchema),
        defaultValues: {
            educations: data.educations || [{ titre: "", domaine: "", specialite: "" }],
            professions: data.professions || [{ titre: "", domaine: "", fonction: "" }],
            diplomes: data.diplomes || [],
            certifications: data.certifications || [],
            competences: data.competences || [{ nom: "" }],
        },
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
                    <Label className="text-lg font-medium">Éducation</Label>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendEducation({ titre: "", domaine: "", specialite: "" })}
                    >
                        Ajouter une éducation
                    </Button>
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
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Titre</Label>
                                <Input
                                    {...register(`educations.${index}.titre`)}
                                    placeholder="Ex: Licence, Master..."
                                />
                                {errors.educations?.[index]?.titre && (
                                    <p className="text-sm text-red-500">
                                        {errors.educations[index]?.titre?.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>Domaine</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className="w-full justify-between"
                                        >
                                            {watch(`educations.${index}.domaine`) || "Sélectionner un domaine"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput placeholder="Rechercher un domaine..." />
                                            <CommandEmpty>Aucun domaine trouvé</CommandEmpty>
                                            <CommandGroup>
                                                {domaines.map((domaine) => (
                                                    <CommandItem
                                                        key={domaine}
                                                        value={domaine}
                                                        onSelect={() => {
                                                            setValue(`educations.${index}.domaine`, domaine);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                watch(`educations.${index}.domaine`) === domaine
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                        {domaine}
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
                                <Label>Spécialité</Label>
                                <Input
                                    {...register(`educations.${index}.specialite`)}
                                    placeholder="Ex: Développement web, Finance..."
                                />
                                {errors.educations?.[index]?.specialite && (
                                    <p className="text-sm text-red-500">
                                        {errors.educations[index]?.specialite?.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>


            <div className="space-y-4 pb-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <Label className="text-lg font-medium">Activités professionnelles</Label>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendProfession({ titre: "", domaine: ""})}
                    >
                        Ajouter une profession
                    </Button>
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
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Titre</Label>
                                <Input
                                    {...register(`professions.${index}.titre`)}
                                    placeholder="Ex: Développeur, Manager..."
                                />
                                {errors.professions?.[index]?.titre && (
                                    <p className="text-sm text-red-500">
                                        {errors.professions[index]?.titre?.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>Domaine</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className="w-full justify-between"
                                        >
                                            {watch(`professions.${index}.domaine`) || "Sélectionner un domaine"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput placeholder="Rechercher un domaine..." />
                                            <CommandEmpty>Aucun domaine trouvé</CommandEmpty>
                                            <CommandGroup>
                                                {domaines.map((domaine) => (
                                                    <CommandItem
                                                        key={domaine}
                                                        value={domaine}
                                                        onSelect={() => {
                                                            setValue(`professions.${index}.domaine`, domaine);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                watch(`professions.${index}.domaine`) === domaine
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                        {domaine}
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
                        </div>
                    </div>
                ))}
            </div>

          
            <div className="space-y-4 pb-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <Label className="text-lg font-medium">Diplômes</Label>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendDiplome({ nom: "" })}
                    >
                        Ajouter un diplôme
                    </Button>
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
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>

            <div className="space-y-4 pb-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <Label className="text-lg font-medium">Certifications</Label>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendCertification({ nom: "" })}
                    >
                        Ajouter une certification
                    </Button>
                </div>
                {certificationFields.map((field, index) => (
                    <div key={field.id} className="flex items-center space-x-4">
                        <div className="flex-grow space-y-2">
                            <Input
                                {...register(`certifications.${index}.nom`)}
                                placeholder="Nom de la certification"
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
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>

            <div className="space-y-4 pb-6">
                <div className="flex items-center justify-between">
                    <Label className="text-lg font-medium">Compétences</Label>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendCompetence({ nom: "" })}
                    >
                        Ajouter une compétence
                    </Button>
                </div>
                {competenceFields.map((field, index) => (
                    <div key={field.id} className="flex items-center space-x-4">
                        <div className="flex-grow space-y-2">
                            <Input
                                {...register(`competences.${index}.nom`)}
                                placeholder="Nom de la compétence"
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
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </form>
    );
}