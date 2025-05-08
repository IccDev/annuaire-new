"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, Home } from "lucide-react";
import ButtonWithIcon from "@/components/ui/button-with-icon";
import IccLogo from "@/public/images/icc.png";

export default function LandingPage() {
  const router = useRouter();

  const onClickHandler = (_: React.MouseEvent, input: string) => {
    router.push(`/${input.toLowerCase()}`);
  };

  return (
    <main className="relative text-white flex flex-col md:flex-row gap-10 justify-center items-center h-screen md:px-2 bg-slate-600">
      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-tr from-slate-500/50 to-slate-700/50 -z-5"></div>
      <div className="px-2 absolute text-center flex flex-col items-center">
        <div className="bg-gradient-to-tr from-yellow-600/40 to-transparent p-2 rounded-full text-center z-5 w-1/5 md:w-1/6">
          <Image
            src={IccLogo}
            alt="ICC Logo"
            width={200}
            height={200}
            className="w-full h-auto"
          />
        </div>
        <h1 className="relative mb-3 font-bold max-md:flex max-md:flex-col items-start mt-4">
          <p className="text-4xl md:text-6xl text-center">
            <span>Annuaire des </span>
            <strong className="text-blue-300">Professions </strong>
            <span>{"de l'Eglise"}</span>
          </p>
        </h1>
        <div className="flex flex-col space-y-4">
          <p className="md:text-lg px-4 md:px-36 xl:px-96 flex items-center">
            <ArrowRight
              className="text-yellow-400 mr-2 flex-shrink-0"
              size={24}
            />
            Trouvez un ou plusieurs professionnels au sein de votre église
            locale et entrez directement en contact avec eux.
          </p>
          <p className="md:text-lg px-4 md:px-36 xl:px-96 flex items-center">
            <ArrowRight
              className="text-yellow-400 mr-2 flex-shrink-0"
              size={24}
            />
            Inscrivez-vous sur la plateforme afin d&apos;être visible de tous.
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <ButtonWithIcon
            handleOnClick={onClickHandler}
            onClickInput="home"
            className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            <Home className="mr-2" size={24} strokeWidth={2.5} />
            <span className="text-lg font-semibold">Découvrir l'annuaire</span>
          </ButtonWithIcon>
          <div className="flex justify-center mt-4">
            <a
              href="/infos"
              className="flex items-center text-blue-200 hover:text-white transition-colors duration-200 gap-2 group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 group-hover:animate-pulse"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Pourquoi choisir l'annuaire ?</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
