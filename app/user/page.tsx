"use client";

import { useSession, signOut } from '@/lib/auth-client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface User {
    id: string;
    name: string | null;
    email: string | null;
    image?: string | null;
    emailVerified: boolean | null;
    createdAt: Date;
}

const UserProfilePage = () => {
    const { data, isPending, error } = useSession();
    const user = data?.user as User | null;
    const loading = isPending;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <p className="text-2xl mb-4">Vous n'êtes pas connecté.</p>
                <Link href="/auth/login">
                    <Button>Se connecter</Button>
                </Link>
            </div>
        );
    }

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
                    {/* <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Email vérifié:</span>
                        <span className={`font-semibold ${user.emailVerified ? 'text-green-500' : 'text-red-500'}`}>
                            {user.emailVerified ? 'Oui' : 'Non'}
                        </span>
                    </div> */}
                    <div className="flex flex-col gap-8 pt-8">
                        <Link href="/home" className="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Retour à l'accueil
                        </Link>
                        <div className="flex flex-col gap-6">
                            <Link href="/register" passHref>
                                <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">Créer ma fiche Pro</Button>
                            </Link>
                            <Link href={`/update-user/${user.id}`} passHref>
                                <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">Modifier ma fiche Pro</Button>
                            </Link>
                            <Link href="/auth/parrainer" passHref>
                                <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">Parrainer</Button>
                            </Link>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button variant="destructive" onClick={() => signOut({ query: { callbackUrl: '/' } })}>Se déconnecter</Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default UserProfilePage;