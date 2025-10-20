"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PostType } from "@/app/generated/prisma";
import { POST_CATEGORIES, POST_TYPES, EXPIRATION_OPTIONS } from "@/lib/constants/post-categories";
import { createPost, updatePost } from "@/actions/post";
import { toast } from "sonner";
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PostWithAuthor } from "@/types/interfaces/post";

const CITIES = [
    "Alost",
    "Anvers",
    "Berlin",
    "Bremen",
    "Bruxelles",
    "Charleroi",
    "Hambourg",
    "La Haye",
    "La Louvière",
    "Liège",
    "Luxembourg",
    "Mons",
    "Munich",
    "Namur",
    "Nivelles",
].sort();

const postFormSchema = z.object({
    title: z.string().min(5, "Le titre doit contenir au moins 5 caractères"),
    description: z.string().min(20, "La description doit contenir au moins 20 caractères"),
    type: z.nativeEnum(PostType, {
        required_error: "Veuillez sélectionner un type d'annonce",
    }),
    category: z.string().min(1, "Veuillez sélectionner ou entrer une catégorie"),
    locations: z.array(z.string()).min(1, "Veuillez sélectionner au moins une ville"),
    requirements: z.string().optional(),
    contactEmail: z.string().email("Email invalide").optional().or(z.literal("")),
    contactPhone: z.string().optional(),
    expiresIn: z.string().optional(),
});

type PostFormValues = z.infer<typeof postFormSchema>;

interface PostFormProps {
    post?: PostWithAuthor;
    mode: "create" | "edit";
}

export default function PostForm({ post, mode }: PostFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<PostFormValues>({
        resolver: zodResolver(postFormSchema),
        defaultValues: {
            title: post?.title || "",
            description: post?.description || "",
            type: post?.type || undefined,
            category: post?.category || "",
            locations: post?.location ? post.location.split(", ") : [],
            requirements: post?.requirements || "",
            contactEmail: post?.contactEmail || "",
            contactPhone: post?.contactPhone || "",
            expiresIn: "30",
        },
    });

    const onSubmit = async (values: PostFormValues) => {
        setIsSubmitting(true);

        try {
            let expiresAt: Date | undefined;
            if (values.expiresIn && values.expiresIn !== "never") {
                const days = parseInt(values.expiresIn);
                expiresAt = new Date();
                expiresAt.setDate(expiresAt.getDate() + days);
            }

            const postData = {
                title: values.title,
                description: values.description,
                type: values.type,
                category: values.category,
                location: values.locations.join(", "),
                requirements: values.requirements || undefined,
                contactEmail: values.contactEmail || undefined,
                contactPhone: values.contactPhone || undefined,
                expiresAt,
            };

            let result;
            if (mode === "create") {
                result = await createPost(postData);
            } else if (post) {
                result = await updatePost(post.id, postData);
            }

            if (result?.error) {
                toast.error(result.error);
            } else if (result?.success) {
                toast.success(
                    mode === "create"
                        ? "Annonce créée avec succès"
                        : "Annonce mise à jour avec succès"
                );
                router.push(mode === "create" ? "/posts/my-posts" : `/posts/${post?.id}`);
                router.refresh();
            }
        } catch (error) {
            toast.error("Une erreur est survenue");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>
                    {mode === "create" ? "Créer une annonce" : "Modifier l'annonce"}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type d'annonce</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner un type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {POST_TYPES.map((type) => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    <div>
                                                        <div className="font-medium">{type.label}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {type.description}
                                                        </div>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Titre</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: Recherche plombier expérimenté" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Catégorie</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "justify-between",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value
                                                        ? POST_CATEGORIES.find(
                                                            (category) => category.value === field.value
                                                        )?.label || field.value
                                                        : "Sélectionner ou écrire une catégorie"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[400px] p-0">
                                            <Command>
                                                <CommandInput
                                                    placeholder="Rechercher ou écrire une catégorie..."
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                />
                                                <CommandList>
                                                    <CommandEmpty>
                                                        Appuyez sur Entrée pour utiliser &quot;{field.value}&quot;
                                                    </CommandEmpty>
                                                    <CommandGroup>
                                                        {POST_CATEGORIES.map((category) => (
                                                            <CommandItem
                                                                key={category.value}
                                                                value={category.value}
                                                                onSelect={() => {
                                                                    field.onChange(category.value);
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        category.value === field.value
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    )}
                                                                />
                                                                {category.label}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormDescription>
                                        Sélectionnez dans la liste ou tapez votre propre catégorie
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="locations"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Localisation</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "justify-between",
                                                        field.value.length === 0 && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value.length > 0
                                                        ? `${field.value.length} ville(s) sélectionnée(s)`
                                                        : "Sélectionner une ou plusieurs villes"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[400px] p-0">
                                            <Command>
                                                <CommandInput placeholder="Rechercher une ville..." />
                                                <CommandList>
                                                    <CommandEmpty>Aucune ville trouvée.</CommandEmpty>
                                                    <CommandGroup>
                                                        {CITIES.map((city) => (
                                                            <CommandItem
                                                                key={city}
                                                                value={city}
                                                                onSelect={() => {
                                                                    const newValue = field.value.includes(city)
                                                                        ? field.value.filter((v) => v !== city)
                                                                        : [...field.value, city];
                                                                    field.onChange(newValue);
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        field.value.includes(city)
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    )}
                                                                />
                                                                {city}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    {field.value.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {field.value.map((city) => (
                                                <Badge key={city} variant="secondary" className="gap-1">
                                                    {city}
                                                    <button
                                                        type="button"
                                                        className="ml-1 hover:bg-muted rounded-sm"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            field.onChange(
                                                                field.value.filter((v) => v !== city)
                                                            );
                                                        }}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                    <FormDescription>
                                        Vous pouvez sélectionner plusieurs villes
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Décrivez votre annonce en détail..."
                                            rows={6}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="requirements"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Critères recherchés (optionnel)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Ex: Minimum 5 ans d'expérience, diplôme requis..."
                                            rows={4}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="contactEmail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email de contact (optionnel)</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="contact@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="contactPhone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Téléphone (optionnel)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="+32 123 45 67 89" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {mode === "create" && (
                            <FormField
                                control={form.control}
                                name="expiresIn"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Durée de publication</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Sélectionner une durée" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {EXPIRATION_OPTIONS.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            L'annonce sera automatiquement marquée comme expirée
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <div className="flex gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                disabled={isSubmitting}
                            >
                                Annuler
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {mode === "create" ? "Publier" : "Mettre à jour"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
