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
import { signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const signupFormSchema = z.object({
  name: z.string(),
  email: z.string().email("Email invalide"),
  password: z.string(),
});

export default function SignupForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signupFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    await signUp.email(
      {
        email: values.email,
        password: values.password,
        name: values.name,
      },
      {
        onSuccess: () => {
          router.push("/auth/login");
          router.refresh();
        },
        onError: (error) => {
          console.log(error?.error?.message);
          toast.error(error?.error?.message);
        },
      }
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" flex flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
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
}

// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useRouter } from "next/navigation";
// import { ArrowLeft } from "lucide-react";

// const registerSchema = z.object({
//   firstName: z.string().min(2, {
//     message: "Le prénom doit contenir au moins 2 caractères.",
//   }),
//   lastName: z.string().min(2, {
//     message: "Le nom doit contenir au moins 2 caractères.",
//   }),
//   email: z.string().email({
//     message: "Veuillez entrer une adresse email valide.",
//   }),
//   password: z.string().min(8, {
//     message: "Le mot de passe doit contenir au moins 8 caractères.",
//   }),
//   confirmPassword: z.string()
// }).refine((data) => data.password === data.confirmPassword, {
//   message: "Les mots de passe ne correspondent pas.",
//   path: ["confirmPassword"],
// });

// type RegisterFormValues = z.infer<typeof registerSchema>;

// export default function RegisterForm() {
//   const router = useRouter();
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<RegisterFormValues>({
//     resolver: zodResolver(registerSchema),
//   });

//   const onSubmit = async (data: RegisterFormValues) => {
//     console.log(data);
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
//       {/* <Button
//         variant="ghost"
//         onClick={() => router.push("/home")}
//         className="absolute top-4 left-4 flex items-center text-muted-foreground hover:text-foreground"
//       >
//         <ArrowLeft className="mr-2 h-4 w-4" />
//         Retour
//       </Button> */}

//       <Card className="w-full max-w-md shadow-lg animate-fadeIn">
//         <CardHeader className="space-y-2">
//           <CardTitle className="text-2xl font-bold text-center text-primary">
//             Inscription
//           </CardTitle>
//           <CardDescription className="text-center text-muted-foreground">
//             Créez votre compte pour rejoindre la communauté
//           </CardDescription>
//         </CardHeader>
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <CardContent className="space-y-6">
//             <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
//               <div className="space-y-2">
//                 <Label htmlFor="firstName">Prénom</Label>
//                 <Input
//                   id="firstName"
//                   {...register("firstName")}
//                   className="w-full"
//                 />
//                 {errors.firstName && (
//                   <p className="text-sm text-destructive">{errors.firstName.message}</p>
//                 )}
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="lastName">Nom</Label>
//                 <Input
//                   id="lastName"
//                   {...register("lastName")}
//                   className="w-full"
//                 />
//                 {errors.lastName && (
//                   <p className="text-sm text-destructive">{errors.lastName.message}</p>
//                 )}
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="email">Adresse email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="exemple@email.com"
//                 {...register("email")}
//                 className="w-full"
//               />
//               {errors.email && (
//                 <p className="text-sm text-destructive">{errors.email.message}</p>
//               )}
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="password">Mot de passe</Label>
//               <Input
//                 id="password"
//                 type="password"
//                 {...register("password")}
//                 className="w-full"
//               />
//               {errors.password && (
//                 <p className="text-sm text-destructive">{errors.password.message}</p>
//               )}
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
//               <Input
//                 id="confirmPassword"
//                 type="password"
//                 {...register("confirmPassword")}
//                 className="w-full"
//               />
//               {errors.confirmPassword && (
//                 <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
//               )}
//             </div>
//           </CardContent>
//           <CardFooter className="flex flex-col space-y-4 pt-6">
//             <Button
//               type="submit"
//               className="w-full bg-primary hover:bg-primary/90"
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? "Inscription en cours..." : "S'inscrire"}
//             </Button>
//           </CardFooter>
//         </form>
//       </Card>
//     </div>
//   );
// }