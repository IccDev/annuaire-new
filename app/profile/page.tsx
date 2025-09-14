"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { ArrowLeft, User, Mail, Calendar, Save } from 'lucide-react';
import ProfileImageUploader from '@/components/ui/ProfileImageUploader';
import { toast } from 'sonner';

interface User {
    id: string;
    name: string | null;
    email: string | null;
    imageUrl: string | null;
    emailVerified: boolean | null;
    createdAt: string;
}

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [name, setName] = useState('');
    const [isUpdatingName, setIsUpdatingName] = useState(false);
    const [hasNameChanged, setHasNameChanged] = useState(false);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await fetch('/api/users/profile');
            if (!response.ok) {
                throw new Error('Erreur lors du chargement du profil');
            }
            const data = await response.json();
            setUser(data.user);
            setName(data.user.name || '');
        } catch (error) {
            console.error('Erreur:', error);
            toast.error('Erreur lors du chargement du profil');
        } finally {
            setIsLoading(false);
        }
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setName(newName);
        setHasNameChanged(newName !== (user?.name || ''));
    };

    const handleSaveName = async () => {
        if (!hasNameChanged || !name.trim()) return;

        setIsUpdatingName(true);
        try {
            const response = await fetch('/api/users/update-name', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: name.trim() }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erreur lors de la mise à jour');
            }

            setUser(prev => prev ? { ...prev, name: data.user.name } : null);
            setHasNameChanged(false);
            toast.success('Nom mis à jour avec succès !');
        } catch (error) {
            console.error('Erreur:', error);
            toast.error(error instanceof Error ? error.message : 'Erreur lors de la mise à jour');
        } finally {
            setIsUpdatingName(false);
        }
    };

    const handleImageUpdate = (newImageUrl: string | null) => {
        if (user) {
            setUser({ ...user, imageUrl: newImageUrl });
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-t-2 border-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement du profil...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="p-6 text-center">
                        <p className="text-red-600 mb-4">Impossible de charger le profil</p>
                        <Link href="/user">
                            <Button variant="outline">Retour au profil</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-2xl mx-auto">

                <div className="mb-6">
                    <Link href="/user" className="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200 mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Retour au profil
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Modifier mon profil</h1>
                    <p className="text-gray-600 mt-2">Personnalisez votre profil et vos informations</p>
                </div>


                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <User className="w-5 h-5 mr-2" />
                            Photo de profil
                        </CardTitle>
                        <CardDescription>
                            Ajoutez ou modifiez votre photo de profil
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <ProfileImageUploader
                            currentImageUrl={user.imageUrl}
                            userName={user.name}
                            onImageUpdate={handleImageUpdate}
                        />
                    </CardContent>
                </Card>

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Mail className="w-5 h-5 mr-2" />
                            Informations personnelles
                        </CardTitle>
                        <CardDescription>
                            Vos informations de base
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nom complet
                                </label>
                                <div className="flex gap-2">
                                    <Input
                                        value={name}
                                        onChange={handleNameChange}
                                        placeholder="Entrez votre nom complet"
                                        className="flex-1"
                                    />
                                    {hasNameChanged && (
                                        <Button
                                            onClick={handleSaveName}
                                            disabled={isUpdatingName || !name.trim()}
                                            size="sm"
                                            className="px-3"
                                        >
                                            {isUpdatingName ? (
                                                <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin"></div>
                                            ) : (
                                                <Save className="w-4 h-4" />
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <Input
                                    value={user.email || ''}
                                    disabled
                                    className="bg-gray-100 cursor-not-allowed"
                                />
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>Membre depuis le {new Date(user.createdAt).toLocaleDateString('fr-FR')}</span>
                        </div>
                    </CardContent>
                </Card>


                <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/user" className="flex-1">
                        <Button variant="outline" className="w-full">
                            Retour au profil
                        </Button>
                    </Link>
                    <Link href="/update" className="flex-1">
                        <Button className="w-full bg-slate-900 hover:bg-slate-500">
                            Modifier ma fiche professionnelle
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}