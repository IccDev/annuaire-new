"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Suspense } from "react";

export default function UpdateSuccess() {
    const router = useRouter();
    return (
        <Suspense>
            <UpdateSuccessContent router={router} />
        </Suspense>
    );
}

function UpdateSuccessContent({ router }: { router: ReturnType<typeof useRouter> }) {
    const searchParams = useSearchParams();
    const eglise = searchParams.get("eglise");
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    router.push(`/home/`);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [router]);

    return (
        <div className="min-h-screen bg-blue-50 flex items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 text-center">
                <div className="mb-6">
                    <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-green-100">
                        <svg className="h-10 w-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Mise à jour réussie !</h2>
                <p className="text-gray-600 mb-6">
                    Vos informations ont été mises à jour avec succès. Merci d'avoir pris le temps de mettre à jour votre profil.
                </p>
                <p className="text-sm text-gray-500 mb-4">
                    Vous serez redirigé vers la page d'accueil dans <span className="font-bold">{countdown}</span> secondes...
                </p>
                <button
                    onClick={() => router.push(`/home/`)}
                    className="w-full rounded-md bg-slate-700 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-slate-600 focus:outline-none"
                >
                    Retourner à l'accueil
                </button>
            </div>
        </div>
    );
}