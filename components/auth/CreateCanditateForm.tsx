"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { createCandidate } from "@/actions/candidate";
import Link from "next/link";




const signupFormSchema = z.object({
    email: z.string().email({
        message: "Veuillez entrer une adresse email valide.",
    }),

})


export default function CreateCandidateForm() {
    const form = useForm<z.infer<typeof signupFormSchema>>({
        resolver: zodResolver(signupFormSchema),
        defaultValues: {
            email: "",

        },
    });


    async function onSubmit(values: z.infer<typeof signupFormSchema>) {
        console.log(values);
        await createCandidate(values.email);
    }



    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md shadow-lg animate-fadeIn bg-white border-0">
                <CardHeader className="space-y-4 pb-6">
                    <Link href="/user" className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Retour au profil
                    </Link>
                    <CardTitle className="text-2xl font-bold text-center text-slate-800">
                        Parrainer un candidat
                    </CardTitle>
                    <CardDescription className="text-center text-gray-600">
                        Invitez un nouveau membre à rejoindre notre communauté
                    </CardDescription>
                </CardHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className=" flex flex-col gap-6"
                    >
                        <CardContent className="space-y-6">
                            <div className="grid gap-6 grid-cols-1">

                                <div className="space-y-3">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-700 font-medium">Email du candidat</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        type="email" 
                                                        placeholder="exemple@email.com" 
                                                        className="py-2.5 px-4 rounded-lg border-slate-300 focus:border-slate-500 focus:ring-slate-500 transition-all duration-200"
                                                        {...field} 
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-red-500 text-sm" />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4 pt-8">
                            <Button
                                type="submit"
                                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                Parrainer
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </div>

    );
}


