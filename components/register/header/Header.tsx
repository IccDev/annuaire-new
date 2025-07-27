"use client";

import Image from "next/image";
import IccLogo from "@/public/images/icc.png";
import { useRouter } from "next/navigation";

const Navigate = ({ goBack, goHome }: { goBack: () => void, goHome: () => void }) => {
    return (
        <div className="flex justify-between">
            <button onClick={goBack} className="flex items-center text-gray-600 hover:text-gray-900">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Retour
            </button>
            <button onClick={goHome} className="flex items-center text-gray-600 hover:text-gray-900">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Accueil
            </button>
        </div>
    )
}

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
            <header className="sticky top-0 z-10 bg-white/80 p-4 backdrop-blur-sm">
                <div className="mx-auto flex max-w-7xl justify-end">
                    <Navigate goBack={goBack} goHome={goHome} />
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