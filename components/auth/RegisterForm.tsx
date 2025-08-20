"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signUp } from "@/lib/auth-client";
import { checkProfessionalProfile } from "@/actions/user";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { updateCandidate } from "@/actions/candidate";
import { Eye, EyeOff } from "lucide-react";
import IccLogo from "../../public/images/icc.png";
import Image from "next/image";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";



const signupFormSchema = z.object({
  name: z.string().min(2, {
    message: "Le prénom doit contenir au moins 2 caractères."
  }),
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide.",
  }),
  password: z.string().min(6, {
    message: "Le mot de passe doit contenir au moins 6 caractères.",
  }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas.",
  path: ["confirmPassword"],
});

type Props = {
  token: any;
  emailCandidate: any;
};


export default function SignupForm({ token, emailCandidate }: Props) {
  // console.log("token register form: ", token);
  // console.log("email register form: ", emailCandidate);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      name: "",
      email: emailCandidate,
      password: "",
      confirmPassword: ""
    },
  });

  const router = useRouter();


  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(values: z.infer<typeof signupFormSchema>) {
    setIsSubmitting(true);
    try {
      await signUp.email(
        {
          email: emailCandidate,
          password: values.password,
          name: values.name,
        },
        {
          onSuccess: async () => {
            toast.success("Inscription réussie !");
            await checkProfessionalProfile(emailCandidate);
            await updateCandidate(token);
            setTimeout(() => {
              router.push("/auth/login");
              router.refresh();
            }, 2000);
          },
          onError: (error) => {
            const errorMessage = error?.error?.message || "Erreur lors de l'inscription";
            if (errorMessage.includes("Password should be at least 6 characters")) {
              form.setError("password", {
                type: "manual",
                message: "Mot de passe trop court.",
              });
            } else {
              toast.error(errorMessage);
            }
            console.log("Erreur lors de l'inscription", error?.error?.message);

            setIsSubmitting(false);
          },
        }
      );
    } catch (error) {
      toast.error("Une erreur est survenue");
      setIsSubmitting(false);
    }
  }


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">

      <Card className="w-full max-w-md shadow-lg animate-fadeIn">
        <CardHeader className="space-y-2">
          <div className="flex flex-col items-center">
            <Image src={IccLogo} alt="Logo" width={64} height={64} />
            <CardTitle className="text-2xl font-bold text-center text-primary">
              Inscription
            </CardTitle>
          </div>
          <CardDescription className="text-center text-muted-foreground">
            Créez votre compte pour rejoindre la communauté
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className=" flex flex-col gap-6"
          >
            <CardContent className="space-y-6">
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">

                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom complet</FormLabel>
                        <FormControl>
                          <Input placeholder="nom & prénom" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="" {...field} disabled />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mot de passe</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input type={showPassword ? "text" : "password"} placeholder="*******" {...field} />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                              {showPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400 cursor-pointer" onClick={() => setShowPassword(false)} />
                              ) : (
                                <Eye className="h-5 w-5 text-gray-400 cursor-pointer" onClick={() => setShowPassword(true)} />
                              )}
                            </div>
                          </div>
                        </FormControl>
                        <p className="text-sm italic text-slate-500"><span className="text-red-500">*</span> au moins 6 caractères</p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmer mot de passe</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input type={showConfirmPassword ? "text" : "password"} placeholder="*******" {...field} />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                              {showConfirmPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400 cursor-pointer" onClick={() => setShowConfirmPassword(false)} />
                              ) : (
                                <Eye className="h-5 w-5 text-gray-400 cursor-pointer" onClick={() => setShowConfirmPassword(true)} />
                              )}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
            <div className="w-full flex flex-col gap-4 pt-2">
              {/* Accordéon RGPD */}
              <div className="w-full">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="rgpd">
                    <AccordionTrigger className="bg-muted rounded-md px-4 py-2 text-sm font-semibold text-primary">Consentement loi RGPD (Réglement sur la Protection des Données)</AccordionTrigger>
                    <AccordionContent className="bg-background rounded-b-md px-4 py-3 text-xs md:text-sm text-muted-foreground">
                      Les informations personnelles figurant dans le présent formulaire sont traitées avec confidentialité par Impact Centre Chrétien et conformément au règlement 2016/679 du Parlement européen et du Conseil du 27 avril 2016 relatif à la protection des personnes physiques à l'égard du traitement des données à caractère personnel et à la libre circulation de ces données (RGPD).
                      <br /><br />
                      Ces données personnelles sont nécessaires pour vous informer et vous inscrire aux différentes activités organisées par l'Eglise et à des fins de gestion interne. Elles seront conservées pendant la durée nécessaire pour atteindre les finalités visées ci-dessus.
                      <br /><br />
                      En tant que personne concernée, vous avez le droit, à tout moment, de consulter, de mettre à jour, de rectifier vos données personnelles ou d'en demander la suppression.
                      <br /><br />
                      Si vous souhaitez exercer un ou plusieurs des droits susmentionnés ou obtenir de plus amples informations sur la protection de vos données personnelles, vous pouvez envoyer un e-mail à l'adresse contact@impactcentrechretien.be
                      <br /><br />
                      J'accepte que mes données personnelles récoltées via ce formulaire soient traitées par Impact Centre Chrétien pour les finalités d'information et d'inscriptions aux événements de l'Eglise et pour le suivi de la gestion interne;
                      <br /><br />
                      J'autorise la prise et la diffusion de photos ou de fragments d'images me concernant sur les sites web et les réseaux sociaux des églises connectées Impact Centre Chrétien.
                      <br /><br />
                      J'accepte de recevoir des informations de la part d'Impact Centre Chrétien.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
              <CardFooter className="flex flex-col space-y-4 pt-2">
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
                      <span className="opacity-0">S'inscrire</span>
                    </>
                  ) : (
                    "S'inscrire"
                  )}
                </Button>
              </CardFooter>
            </div>
          </form>
        </Form>
      </Card>
    </div>

  );
}


