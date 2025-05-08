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
    domaine: z.string().min(1, "Le domaine est requis"),
    fonction: z.string().min(0, ""),
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
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<ProfessionnelFormValues>({
        resolver: zodResolver(professionnelSchema),
        defaultValues: {
            educations: data.educations.length > 0 ? data.educations : [{ domaine: "", titre: "", specialite: "" }],
            professions: data.professions.length > 0 ? data.professions : [{ domaine: "", titre: "", fonction: "" }],
            diplomes: data.diplomes.length > 0 ? data.diplomes : [{ nom: "" }],
            certifications: data.certifications.length > 0 ? data.certifications : [{ nom: "" }],
            competences: data.competences.length > 0 ? data.competences : [{ nom: "" }],
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

    const onFormSubmit = (data: ProfessionnelFormValues) => {
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
        
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <Label className="text-lg font-medium">Éducation<span className="text-red-500">*</span></Label>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendEducation({ domaine: "", titre: "", specialite: "" })}
                    >
                        Ajouter
                    </Button>
                </div>
                {educationFields.map((field, index) => (
                    <div key={field.id} className="space-y-4 p-4 border rounded-md relative">
                        <button
                            type="button"
                            onClick={() => removeEducation(index)}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            disabled={educationFields.length === 1}
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                        <div className="space-y-2">
                            <Label htmlFor={`educations.${index}.domaine`}>Domaine<span className="text-red-500">*</span></Label>
                            <Select
                                onValueChange={(value) => setValue(`educations.${index}.domaine`, value)}
                                defaultValue={field.domaine}
                            >
                                <SelectTrigger className={errors.educations?.[index]?.domaine ? "border-red-500" : ""}>
                                    <SelectValue placeholder="Sélectionner un domaine" />
                                </SelectTrigger>
                                <SelectContent>
                                    {domaines.map((domaine) => (
                                        <SelectItem key={domaine} value={domaine}>
                                            {domaine}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.educations?.[index]?.domaine && (
                                <p className="text-sm text-red-500">{errors.educations[index]?.domaine?.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={`educations.${index}.titre`}>Titre<span className="text-red-500">*</span></Label>
                            <Input
                                id={`educations.${index}.titre`}
                                placeholder="Titre de l'éducation"
                                {...register(`educations.${index}.titre`)}
                                className={errors.educations?.[index]?.titre ? "border-red-500" : ""}
                            />
                            {errors.educations?.[index]?.titre && (
                                <p className="text-sm text-red-500">{errors.educations[index]?.titre?.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={`educations.${index}.specialite`}>Spécialité</Label>
                            <Input
                                id={`educations.${index}.specialite`}
                                placeholder="Spécialité (optionnel)"
                                {...register(`educations.${index}.specialite`)}
                            />
                        </div>
                    </div>
                ))}
                {errors.educations && !Array.isArray(errors.educations) && (
                    <p className="text-sm text-red-500">{errors.educations.message}</p>
                )}
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <Label className="text-lg font-medium">Profession<span className="text-red-500">*</span></Label>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendProfession({ domaine: "", titre: "", fonction: "" })}
                    >
                        Ajouter
                    </Button>
                </div>
                {professionFields.map((field, index) => (
                    <div key={field.id} className="space-y-4 p-4 border rounded-md relative">
                        <button
                            type="button"
                            onClick={() => removeProfession(index)}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            disabled={professionFields.length === 1}
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                        <div className="space-y-2">
                            <Label htmlFor={`professions.${index}.domaine`}>Domaine<span className="text-red-500">*</span></Label>
                            <Select
                                onValueChange={(value) => setValue(`professions.${index}.domaine`, value)}
                                defaultValue={field.domaine}
                            >
                                <SelectTrigger className={errors.professions?.[index]?.domaine ? "border-red-500" : ""}>
                                    <SelectValue placeholder="Sélectionner un domaine" />
                                </SelectTrigger>
                                <SelectContent>
                                    {domaines.map((domaine) => (
                                        <SelectItem key={domaine} value={domaine}>
                                            {domaine}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.professions?.[index]?.domaine && (
                                <p className="text-sm text-red-500">{errors.professions[index]?.domaine?.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={`professions.${index}.titre`}>Titre<span className="text-red-500">*</span></Label>
                            <Input
                                id={`professions.${index}.titre`}
                                placeholder="Titre de la profession"
                                {...register(`professions.${index}.titre`)}
                                className={errors.professions?.[index]?.titre ? "border-red-500" : ""}
                            />
                            {errors.professions?.[index]?.titre && (
                                <p className="text-sm text-red-500">{errors.professions[index]?.titre?.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={`professions.${index}.fonction`}>Fonction</Label>
                            <Input
                                id={`professions.${index}.fonction`}
                                placeholder="Fonction (optionnel)"
                                {...register(`professions.${index}.fonction`)}
                            />
                        </div>
                    </div>
                ))}
                {errors.professions && !Array.isArray(errors.professions) && (
                    <p className="text-sm text-red-500">{errors.professions.message}</p>
                )}
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <Label className="text-lg font-medium">Diplômes</Label>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendDiplome({ nom: "" })}
                    >
                        Ajouter
                    </Button>
                </div>
                {diplomeFields.map((field, index) => (
                    <div key={field.id} className="space-y-4 p-4 border rounded-md relative">
                        <button
                            type="button"
                            onClick={() => removeDiplome(index)}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                        <div className="space-y-2">
                            <Label htmlFor={`diplomes.${index}.nom`}>Nom du diplôme</Label>
                            <Input
                                id={`diplomes.${index}.nom`}
                                placeholder="Nom du diplôme"
                                {...register(`diplomes.${index}.nom`)}
                                className={errors.diplomes?.[index]?.nom ? "border-red-500" : ""}
                            />
                            {errors.diplomes?.[index]?.nom && (
                                <p className="text-sm text-red-500">{errors.diplomes[index]?.nom?.message}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <Label className="text-lg font-medium">Certifications</Label>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendCertification({ nom: "" })}
                    >
                        Ajouter
                    </Button>
                </div>
                {certificationFields.map((field, index) => (
                    <div key={field.id} className="space-y-4 p-4 border rounded-md relative">
                        <button
                            type="button"
                            onClick={() => removeCertification(index)}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                        <div className="space-y-2">
                            <Label htmlFor={`certifications.${index}.nom`}>Nom de la certification</Label>
                            <Input
                                id={`certifications.${index}.nom`}
                                placeholder="Nom de la certification"
                                {...register(`certifications.${index}.nom`)}
                                className={errors.certifications?.[index]?.nom ? "border-red-500" : ""}
                            />
                            {errors.certifications?.[index]?.nom && (
                                <p className="text-sm text-red-500">{errors.certifications[index]?.nom?.message}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <Label className="text-lg font-medium">Compétences<span className="text-red-500">*</span></Label>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendCompetence({ nom: "" })}
                    >
                        Ajouter
                    </Button>
                </div>
                {competenceFields.map((field, index) => (
                    <div key={field.id} className="space-y-4 p-4 border rounded-md relative">
                        <button
                            type="button"
                            onClick={() => removeCompetence(index)}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            disabled={competenceFields.length === 1}
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                        <div className="space-y-2">
                            <Label htmlFor={`competences.${index}.nom`}>Nom de la compétence<span className="text-red-500">*</span></Label>
                            <Input
                                id={`competences.${index}.nom`}
                                placeholder="Nom de la compétence"
                                {...register(`competences.${index}.nom`)}
                                className={errors.competences?.[index]?.nom ? "border-red-500" : ""}
                            />
                            {errors.competences?.[index]?.nom && (
                                <p className="text-sm text-red-500">{errors.competences[index]?.nom?.message}</p>
                            )}
                        </div>
                    </div>
                ))}
                {errors.competences && !Array.isArray(errors.competences) && (
                    <p className="text-sm text-red-500">{errors.competences.message}</p>
                )}
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    className="w-full bg-slate-700 text-white py-2 px-4 rounded-md hover:bg-slate-600 transition-colors"
                >
                    Mettre à jour mes informations
                </button>
            </div>
        </form>
    );
}