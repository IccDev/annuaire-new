"use client";

import Image from 'next/image';
import { Search } from 'lucide-react';



const IntelligentSearchBar = () => {

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Recherche intelligente lancée");
    };

    return (
        <div className="w-full max-w-3xl mx-auto my-10">
            <form
                onSubmit={handleSubmit}
                className="relative bg-white/80 backdrop-blur-md rounded-xl shadow-2xl transition-all duration-300 hover:shadow-sky-400/50 focus-within:shadow-sky-500/60 border border-transparent focus-within:border-sky-500"
            >
                <div className="flex items-center p-2">
                    <input
                        type="text"
                        placeholder="Décrivez votre besoin ou posez une question à notre IA..."
                        className="w-full h-16 px-6 py-4 text-lg text-slate-800 placeholder-slate-500 bg-transparent focus:outline-none"
                    />
                    <button
                        type="submit"
                        className="ml-2 bg-gradient-to-br from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white rounded-lg p-4 transition-all duration-300 h-16 w-16 flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-105"
                        aria-label="Lancer la recherche intelligente"
                    >
                        <Image src="/images/ai.png" alt="AI Icon" width={28} height={28} className="opacity-90" />
                    </button>
                </div>
            </form>
            <p className="mt-3 text-xs text-center text-slate-500">
                Ex: "Je cherche une personne travaillant dans le secteur de la santé à Bruxelles" ou "Je cherche une personne dans le domaine de l'informatique à Nivelles ou dans les environs".<br />
            </p>
        </div>
    );
};

export default IntelligentSearchBar;