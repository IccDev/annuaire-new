"use client";

import { signOut } from '@/lib/auth-client';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';


interface User {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    emailVerified: boolean | null;
    createdAt: Date;
}

interface UserProfileClientProps {
    user: User;
    hasProfile: boolean;
    isReferent: boolean;
}

const UserProfileClient = ({ user, hasProfile, isReferent }: UserProfileClientProps) => {
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await signOut();
            window.location.href = '/auth/login';
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
            window.location.href = '/auth/login';
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center">
                    <Avatar className="w-24 h-24 mx-auto mb-4">
                        <AvatarImage src={user.image || '/images/avatar.png'} alt={user.name || 'User'} />
                        <AvatarFallback>{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-2xl">{user.name}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Membre depuis le:</span>
                        <span className="font-semibold">{new Date(user.createdAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex flex-col gap-8 pt-8">
                        <Link href="/home" className="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Retour à l'accueil
                        </Link>
                        <div className="flex flex-col gap-6">
                            {hasProfile ? (
                                <Link href="/update" passHref>
                                    <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                                        Mettre à jour ma fiche professionnelle
                                    </Button>
                                </Link>
                            ) : (
                                <Link href={user.email ? `/register?email=${encodeURIComponent(user.email)}` : "/register"} passHref>
                                    <Button className="w-full bg-slate-700 hover:bg-slate-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                                        Créer ma fiche professionnelle
                                    </Button>
                                </Link>
                            )}
                            {isReferent && (
                                <Link href="/referent/dashboard" passHref>
                                    <button className="w-full border border-slate-700 text-slate-700 font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                                        Accéder au tableau de bord référent
                                    </button>
                                </Link>
                            )}
                            <Link href="/auth/parrainer" passHref>
                                <button className="w-full border border-blue-500 text-blue-500 font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                                    parrainer
                                </button>
                            </Link>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="text-red-600 hover:underline relative"
                    >
                        {isLoggingOut ? (
                            <>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-5 h-5 border-t-2 border-red-600 rounded-full animate-spin"></div>
                                </div>
                                <span className="opacity-0">Se déconnecter</span>
                            </>
                        ) : (
                            "Se déconnecter"
                        )}
                    </button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default UserProfileClient;