"use client";

import { signOut } from '@/lib/auth-client';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowLeft, Edit3, User, Settings, Shield, UserPlus, LogOut, Calendar, FileText, Briefcase, PlusCircle } from 'lucide-react';


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
    userPostsCount: number;
}

const UserProfileClient = ({ user, hasProfile, isReferent, isAdmin, userPostsCount }: UserProfileClientProps) => {
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await signOut({
                fetchOptions: {
                    onSuccess: () => {
                        window.location.replace('/auth/login');
                    },
                    onError: (err) => {
                        console.error('Erreur lors de la déconnexion:', err.error);
                        window.location.replace('/auth/login');
                    }
                }
            });
        } catch (error) {
            console.error('Erreur de déconnexion:', error);
            setIsLoggingOut(false);
            setTimeout(() => {
                window.location.replace('/auth/login');
            }, 1000);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-8">
            <div className="max-w-4xl mx-auto mb-6">
                {hasProfile ? (
                    <Link href="/home" className="inline-flex items-center text-slate-600 hover:text-slate-800 transition-colors duration-200">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        <span className="font-medium">Aller vers l'accueil</span>
                    </Link>
                ) : (
                    <div className="inline-flex items-center text-slate-400 cursor-not-allowed">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        <span className="font-medium">Accueil(Disponible après la création de votre fiche professionnelle)</span>
                    </div>
                )}
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
                                        <Link href="/update-direct" className="block">
                                            <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                                <Edit3 className="w-5 h-5 mr-2" />
                                                Ouvrir ma fiche professionnelle
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

                                {!hasProfile && (
                                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                                        <div className="flex items-start space-x-3">
                                            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-amber-400 to-red-500 rounded-full flex items-center justify-center">
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-red-600 text-sm uppercase tracking-wide mb-2">
                                                    Information importante
                                                </h4>
                                                <p className="text-slate-700 italic leading-relaxed text-sm">
                                                    Pour accéder à l'annuaire des professions et découvrir les profils des autres membres de l'église,
                                                    vous devez d'abord <span className="font-semibold text-blue-600">créer votre propre fiche professionnelle</span>.
                                                </p>
                                                <div className="mt-3 flex items-center space-x-2">
                                                    {/* <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse"></div> */}
                                                    <p className="text-xs text-red-500 font-medium">
                                                        Créez votre fiche dès maintenant en cliquant sur le bouton au dessus !
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                                    <h3 className="font-semibold text-slate-800 mb-4 flex items-center">
                                        <FileText className="w-5 h-5 mr-2 text-blue-600" />
                                        Annonces
                                    </h3>

                                    <div className="flex justify-around gap-4">
                                        <Link href="/posts" className="flex flex-col items-center group">
                                            <div className="w-14 h-14 bg-white hover:bg-blue-50 rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-blue-200">
                                                <FileText className="w-6 h-6 text-blue-600 group-hover:text-blue-700" />
                                            </div>
                                            <span className="text-xs text-slate-700 font-medium mt-2 text-center">
                                                Voir les annonces
                                            </span>
                                        </Link>

                                        <Link href="/posts/create" className="flex flex-col items-center group">
                                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                                                <PlusCircle className="w-6 h-6 text-white" />
                                            </div>
                                            <span className="text-xs text-slate-700 font-medium mt-2 text-center">
                                                Créer une annonce
                                            </span>
                                        </Link>

                                        <Link href="/posts/my-posts" className="flex flex-col items-center group relative">
                                            {userPostsCount > 0 && (
                                                <div className="absolute -top-2 -right-2 z-10">
                                                    <span className="flex items-center justify-center w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
                                                        {userPostsCount}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="w-14 h-14 bg-white hover:bg-blue-50 rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-blue-200">
                                                <Briefcase className="w-6 h-6 text-blue-600 group-hover:text-blue-700" />
                                            </div>
                                            <span className="text-xs text-slate-700 font-medium mt-2 text-center">
                                                Mes annonces
                                            </span>
                                        </Link>
                                    </div>

                                    <p className="text-xs text-slate-600 mt-4 italic text-center">
                                        Publiez vos offres d'emploi, recherches de profils ou annonces diverses
                                    </p>
                                </div>

                                {(isReferent || isAdmin) && (
                                    <div className="rounded-xl p-6">
                                        <div className="flex flex-col gap-3">
                                            {(isReferent || isAdmin) && (
                                                <Link href="/referent/dashboard" className="block">
                                                    <Button variant="outline" className="w-full font-semibold py-4 px-6 border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                                        <Shield className="w-5 h-5 mr-2" />
                                                        Dashboard référent
                                                    </Button>
                                                </Link>
                                            )}

                                            {isAdmin && (
                                                <Link href="/admin" className="block">
                                                    <Button className="w-full font-semibold py-4 px-6 bg-slate-700 hover:bg-slate-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                                        <Settings className="w-5 h-5 mr-2" />
                                                        Administration
                                                    </Button>
                                                </Link>
                                            )}

                                            {(isReferent || isAdmin) && (
                                                <Link href="/auth/parrainer" className="block">
                                                    <Button variant="outline" className="w-full font-semibold py-4 px-6 border-2 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
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