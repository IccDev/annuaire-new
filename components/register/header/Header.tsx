"use client";

import Image from "next/image";
import IccLogo from "@/public/images/icc.png";

export default function Header() {
    return (
        <div className="sticky top-0 z-50 w-full bg-slate-200 backdrop-blur-sm shadow-md">
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