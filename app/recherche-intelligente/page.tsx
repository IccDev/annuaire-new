"use client"

import { useRouter, useParams } from "next/navigation";

import IntelligentSearchBar from '@/components/NLP/IntelligentSearchBar';

const Navigate = ({ goHome }: { goHome: () => void }) => {
    return (
        <div className="flex justify-between">
            <button
                onClick={goHome}
                className="flex items-center text-gray-600 hover:text-gray-900"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Accueil
            </button>
        </div>
    );
};

export default function IntelligentSearchPage() {
    const router = useRouter();
    const params = useParams();
    const eglise = params.eglise as string;

    // const goBack = () => {
    //     if (window.history.length > 1) {
    //         window.history.back();
    //     } else {
    //         router.push(`/${eglise}/annuaire/home/`);
    //     }
    // };

    const goHome = () => {
        router.push(`/home/`);
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-100 via-indigo-50 to-purple-100 py-8 px-4 sm:px-6 lg:px-8 flex flex-col">
            <Navigate goHome={goHome} />
            <header className="my-12 text-center">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-600">
                    Recherche Intelligente
                </h1>
                <p className="mt-4 text-lg text-slate-700 max-w-2xl mx-auto">
                    Explorez notre annuaire avec la puissance de l'IA pour des résultats précis et pertinents.
                </p>
            </header>

            <main className="flex-grow">
                <IntelligentSearchBar />
                <div className="mt-12 text-center text-slate-600">
                    <p>Les résultats de votre recherche apparaîtront ici.</p>
                </div>
            </main>
        </div>
    );
}