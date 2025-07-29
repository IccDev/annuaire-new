"use client";

import Image from "next/image";
import IccLogo from "@/public/images/icc.png";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home } from 'lucide-react';


export default function Header() {
    const router = useRouter();

    const goHome = () => {
        router.push("/home");
    }

    const goBack = () => {
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push(`/home/`);
        }
    }

    return (
        <div className="sticky top-0 z-50 w-full bg-slate-200 backdrop-blur-sm shadow-md">
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <button onClick={() => router.back()} className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Retour
                        </button>

                        <button onClick={() => router.push('/home')} className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                            <Home className="w-5 h-5 mr-2" />
                            Accueil
                        </button>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-4 py-6">
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="relative h-20 w-20">
                        <Image
                            src={IccLogo}
                            alt="ICC Logo"
                            layout="fill"
                            objectFit="contain"
                            priority
                        />
                    </div>
                    <h1 className="text-center text-2xl font-bold text-slate-800">
                        Formulaire d'inscription à l'annuaire des églises ICC
                    </h1>
                </div>
            </div>
        </div>
    );
}