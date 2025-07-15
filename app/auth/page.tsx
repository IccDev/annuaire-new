import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Pour ya Berry, cette page ne sert plus à rien parce que le lien d'inscription ne doit pas etre exposé.

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg animate-fadeIn">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold text-center text-primary">
            Annuaire des Professions de l'Eglise
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Connectez-vous ou inscrivez-vous pour accéder à l'annuaire
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            asChild
            className="w-full bg-primary hover:bg-primary/90"
          >
            <Link href="/auth/login">
              Se connecter
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full"
          >
            <Link href="/auth/register">
              S'inscrire
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}