"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Image from "next/image";
import IccLogo from "../../../public/images/icc.png";

const resetPasswordSchema = z.object({
    password: z.string().min(6, {
        message: "Le mot de passe doit contenir au moins 6 caractères.",
    }),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
    const form = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const router = useRouter();
    const searchParams = useSearchParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const tokenParam = searchParams.get("token");
        if (!tokenParam) {
            toast.error("Token de réinitialisation manquant");
            router.push("/auth/forgot-password");
            return;
        }
        setToken(tokenParam);
    }, [searchParams, router]);

    async function onSubmit(values: ResetPasswordFormValues) {
        if (!token) {
            toast.error("Token de réinitialisation manquant");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token,
                    newPassword: values.password
                }),
            });

            if (response.ok) {
                setIsSuccess(true);
                toast.success("Mot de passe réinitialisé avec succès !");
                setTimeout(() => {
                    router.push("/auth/login");
                }, 3000);
            } else {
                const data = await response.json();
                toast.error(data.error || "Erreur lors de la réinitialisation du mot de passe");
            }
        } catch (error) {
            toast.error("Une erreur est survenue");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md shadow-lg animate-fadeIn">
                    <CardHeader className="space-y-2 text-center">
                        <div className="flex justify-center mb-4">
                            <Image
                                src={IccLogo}
                                alt="Logo ICC"
                                width={80}
                                height={80}
                                className="rounded-lg"
                            />
                        </div>
                        <CardTitle className="text-2xl font-bold text-center">Succès !</CardTitle>
                        <CardDescription className="text-center">
                            Votre mot de passe a été réinitialisé
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-center space-y-4">
                            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Votre mot de passe a été réinitialisé avec succès.
                                Vous allez être redirigé vers la page de connexion dans quelques secondes.
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full"
                            onClick={() => router.push("/auth/login")}
                        >
                            Se connecter maintenant
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
            <Button
                variant="ghost"
                onClick={() => router.push("/auth/login")}
                className="absolute top-4 left-4 flex items-center text-muted-foreground hover:text-foreground"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la connexion
            </Button>

            <Card className="w-full max-w-md shadow-lg animate-fadeIn">
                <CardHeader className="space-y-2">
                    <div className="flex justify-center mb-4">
                        <Image
                            src={IccLogo}
                            alt="Logo ICC"
                            width={80}
                            height={80}
                            className="rounded-lg"
                        />
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">Nouveau mot de passe</CardTitle>
                    <CardDescription className="text-center">
                        Créez un nouveau mot de passe sécurisé
                    </CardDescription>
                </CardHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nouveau mot de passe</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Votre nouveau mot de passe"
                                                    {...field}
                                                    disabled={isSubmitting}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                    ) : (
                                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                                    )}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirmer le mot de passe</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    placeholder="Confirmez votre mot de passe"
                                                    {...field}
                                                    disabled={isSubmitting}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                >
                                                    {showConfirmPassword ? (
                                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                    ) : (
                                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                                    )}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                        <CardFooter>
                            <Button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary/90 relative"
                                disabled={isSubmitting || !token}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
                                        </div>
                                        <span className="opacity-0">Réinitialiser</span>
                                    </>
                                ) : (
                                    "Réinitialiser le mot de passe"
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </div>
    );
}
