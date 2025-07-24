"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import * as BetterAuth from "better-auth";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const signinFormSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string(),
});

// console.log(BetterAuth);


const loginSchema = z.object({
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide.",
  }),
  password: z.string().min(6, {
    message: "Le mot de passe doit contenir au moins 6 caractères.",
  }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const form = useForm<z.infer<typeof signinFormSchema>>({
    resolver: zodResolver(signinFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values: z.infer<typeof signinFormSchema>) {
    await signIn.email({
      email: values.email,
      password: values.password,
    },
      {
        onSuccess: () => {
          router.push("/home");
          router.refresh();
        },
        onError: (error) => {
          toast.error(error?.error?.message);
        },
      }
    )
  };



  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" flex flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
  // return (
  //   <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
  //     <Button
  //       variant="ghost"
  //       onClick={() => router.push("/")}
  //       className="absolute top-4 left-4 flex items-center text-muted-foreground hover:text-foreground"
  //     >
  //       <ArrowLeft className="mr-2 h-4 w-4" />
  //       Retour
  //     </Button>

  //     <Card className="w-full max-w-md shadow-lg animate-fadeIn">
  //       <CardHeader className="space-y-2">
  //         <CardTitle className="text-2xl font-bold text-center text-primary">
  //           Connexion
  //         </CardTitle>
  //         <CardDescription className="text-center text-muted-foreground">
  //           Connectez-vous à votre compte pour accéder à votre espace
  //         </CardDescription>
  //       </CardHeader>
  //       <form onSubmit={handleSubmit(onSubmit)}>
  //         <CardContent className="space-y-6">
  //           <div className="space-y-2">
  //             <Label htmlFor="email">Adresse email</Label>
  //             <Input
  //               id="email"
  //               type="email"
  //               placeholder="john.doe@email.com"
  //               {...register("email")}
  //               className="w-full"
  //             />
  //             {errors.email && (
  //               <p className="text-sm text-destructive">{errors.email.message}</p>
  //             )}
  //           </div>
  //           <div className="space-y-2">
  //             <Label htmlFor="password">Mot de passe</Label>
  //             <Input
  //               id="password"
  //               type="password"
  //               value={password}
  //               {...register("password")}
  //               className="w-full"
  //               onChange={e => setPassword(e.target.value)}
  //             />
  //             {errors.password && (
  //               <p className="text-sm text-destructive">{errors.password.message}</p>
  //             )}
  //           </div>
  //         </CardContent>
  //         <CardFooter className="flex flex-col space-y-4 pt-6">
  //           <Button
  //             onClick={handleLogin}
  //             type="submit"
  //             className="w-full bg-primary hover:bg-primary/90"
  //             disabled={isSubmitting}
  //           >
  //             {isSubmitting ? "Connexion en cours..." : "Se connecter"}
  //           </Button>
  //         </CardFooter>
  //       </form>
  //     </Card>
  //   </div>
  // );
}