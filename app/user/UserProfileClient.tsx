"use client";

import { signOut } from '@/lib/auth-client';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft, Edit3, User, Settings, Shield, UserPlus, LogOut, Calendar } from 'lucide-react';


interface User {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    imageUrl: string | null;
    emailVerified: boolean | null;
    createdAt: Date;
}

interface UserProfileClientProps {
    user: User;
    hasProfile: boolean;
    isReferent: boolean;
    isAdmin: boolean;
}

const UserProfileClient = ({ user, hasProfile, isReferent, isAdmin }: UserProfileClientProps) => {
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            const result = await signOut();
            console.log('Déconnexion réussie:', result);
            localStorage.clear();
            sessionStorage.clear();

            window.location.replace('/auth/login');

        } catch (error) {
            console.error('Erreur détaillée lors de la déconnexion:', error);
            setIsLoggingOut(false);

            localStorage.clear();
            sessionStorage.clear();

            setTimeout(() => {
                window.location.replace('/auth/login');
            }, 1000);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-8">
            <div className="max-w-4xl mx-auto mb-6">
                <Link href="/home" className="inline-flex items-center text-slate-600 hover:text-slate-800 transition-colors duration-200">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    <span className="font-medium">Retour à l'accueil</span>
                </Link>
            </div>

            <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                            <CardHeader className="text-center pb-2">
                                <div className="relative inline-block mb-4">
                                    <Link href="/profile" className="group cursor-pointer">
                                        <Avatar className="w-32 h-32 mx-auto transition-transform duration-300 group-hover:scale-105 ring-4 ring-white shadow-2xl">
                                            <AvatarImage src={user.imageUrl || user.image || undefined} alt={user.name || 'User'} />
                                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl font-bold">
                                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2 shadow-lg group-hover:bg-blue-600 transition-colors duration-200">
                                            <Edit3 className="w-4 h-4 text-white" />
                                        </div>
                                    </Link>
                                </div>
                                <CardTitle className="text-2xl font-bold text-slate-800 mb-1">{user.name}</CardTitle>
                                <CardDescription className="text-slate-600 text-base">{user.email}</CardDescription>
                            </CardHeader>

                            <CardContent className="pt-4">
                                <div className="bg-slate-50 rounded-lg p-4 mb-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center text-slate-600">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            <span className="text-sm font-medium">Membre depuis</span>
                                        </div>
                                        <span className="font-semibold text-slate-800">
                                            {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-2">
                        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm h-full">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
                                    <User className="w-5 h-5 mr-2 text-blue-600" />
                                    Actions
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                                    <h3 className="font-semibold text-slate-800 mb-3 flex items-center">
                                        <Settings className="w-5 h-5 mr-2 text-blue-600" />
                                        Gestion du profil
                                    </h3>
                                    {hasProfile ? (
                                        <Link href="/update" className="block">
                                            <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                                <Edit3 className="w-5 h-5 mr-2" />
                                                Mettre à jour ma fiche professionnelle
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Link href={user.email ? `/register?email=${encodeURIComponent(user.email)}` : "/register"} className="block">
                                            <Button className="w-full bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-black text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                                <User className="w-5 h-5 mr-2" />
                                                Créer ma fiche professionnelle
                                            </Button>
                                        </Link>
                                    )}
                                </div>

                                {(isReferent || isAdmin) && (
                                    <div className="rounded-xl p-6">
                                        {/* <h3 className="font-semibold text-slate-800 mb-4 flex items-center">
                                            <Shield className="w-5 h-5 mr-2 text-slate-600" />
                                            Outils d'administration
                                        </h3> */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {(isReferent || isAdmin) && (
                                                <Link href="/referent/dashboard" className="block">
                                                    <Button variant="outline" className="w-full h-auto py-3 px-4 border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 rounded-lg">
                                                        <Shield className="w-5 h-5 mr-2" />
                                                        <span className="text-sm font-medium">Dashboard Référent</span>
                                                    </Button>
                                                </Link>
                                            )}

                                            {isAdmin && (
                                                <Link href="/admin" className="block">
                                                    <Button className="w-full h-auto py-3 px-4 bg-slate-700 hover:bg-slate-800 text-white transition-all duration-200 rounded-lg">
                                                        <Settings className="w-5 h-5 mr-2" />
                                                        <span className="text-sm font-medium">Administration</span>
                                                    </Button>
                                                </Link>
                                            )}

                                            {(isReferent || isAdmin) && (
                                                <Link href="/auth/parrainer" className="block sm:col-span-2">
                                                    <Button variant="outline" className="w-full py-3 px-4 border-2 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 rounded-lg">
                                                        <UserPlus className="w-5 h-5 mr-2" />
                                                        Parrainer un nouveau membre
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </CardContent>

                            <CardFooter className="flex justify-center pt-6 border-t border-slate-200">
                                <button
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    className="inline-flex items-center px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium group"
                                >
                                    {isLoggingOut ? (
                                        <>
                                            <div className="w-5 h-5 border-t-2 border-red-600 rounded-full animate-spin mr-2"></div>
                                            Déconnexion...
                                        </>
                                    ) : (
                                        <>
                                            <LogOut className="w-4 h-4 mr-2 group-hover:transform group-hover:-translate-x-1 transition-transform duration-200" />
                                            Se déconnecter
                                        </>
                                    )}
                                </button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfileClient;