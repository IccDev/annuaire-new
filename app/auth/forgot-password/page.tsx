"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail } from "lucide-react";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Image from "next/image";
import IccLogo from "../../../public/images/icc.png";

const forgotPasswordSchema = z.object({
    email: z.string().email({
        message: "Veuillez entrer une adresse email valide.",
    }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const form = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    async function onSubmit(values: ForgotPasswordFormValues) {
        setIsSubmitting(true);
        try {

            const response = await fetch("/api/auth/forget-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: values.email,
                    redirectTo: "/auth/reset-password"
                }),
            });

            if (response.ok) {
                setEmailSent(true);
                toast.success("Email de réinitialisation envoyé !");
            } else {
                const data = await response.json();
                toast.error(data.error || "Erreur lors de l'envoi de l'email");
            }
        } catch (error) {
            toast.error("Une erreur est survenue");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    }

    if (emailSent) {
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
                        <CardTitle className="text-2xl font-bold text-center">Email envoyé !</CardTitle>
                        <CardDescription className="text-center">
                            Vérifiez votre boîte de réception
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-center space-y-4">
                            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <Mail className="w-8 h-8 text-green-600" />
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Nous avons envoyé un lien de réinitialisation à votre adresse email.
                                Cliquez sur le lien dans l'email pour créer un nouveau mot de passe.
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Si vous ne recevez pas l'email dans quelques minutes, vérifiez votre dossier spam.
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => router.push("/auth/login")}
                        >
                            Retour à la connexion
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
                    <CardTitle className="text-2xl font-bold text-center">Mot de passe oublié</CardTitle>
                    <CardDescription className="text-center">
                        Entrez votre adresse email pour recevoir un lien de réinitialisation
                    </CardDescription>
                </CardHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Adresse email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="votre@email.com"
                                                {...field}
                                                disabled={isSubmitting}
                                            />
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
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
                                        </div>
                                        <span className="opacity-0">Envoyer le lien</span>
                                    </>
                                ) : (
                                    "Envoyer le lien de réinitialisation"
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </div>
    );
}
