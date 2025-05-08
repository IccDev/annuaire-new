"use client";

import QRCodeImage from "@/public/images/qrscanner.jpg";

import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import QRCode from "./code";
import { Text } from "@/components/Text";
import { Center } from "@/components/Center";


export default function Scanner() {
    const router = useRouter();
    const params = useParams();
    const eglise = params.eglise as string;

    const registerPath = `/register`;

    const goBack = () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            router.push(`/home/`);
        }
    };

    const goHome = () => {
        router.push(`/home/`);
    };

    const Navigate = ({ goBack, goHome }: { goBack: () => void, goHome: () => void }) => {
        return (
            <div className="flex justify-between mb-4">
                <button
                    onClick={goBack}
                    className="flex items-center text-gray-600 hover:text-gray-900"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Retour
                </button>
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

    return (
        <div className="absolute top-0 right-0 w-full h-full p-2 bg-gradient-to-tr bg-slate-300">
            <Navigate goBack={goBack} goHome={goHome} />
            <div className="w-full h-1/3 p-1 bg-white rounded-lg">
                <div className="w-full h-full bg-neutral-200 rounded-lg overflow-hidden">
                    <Image
                        src={QRCodeImage}
                        alt="backgroundImage"
                        width={800}
                        height={400}
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
            <div className="my-4">
                <Text
                    font_size="2xl"
                    color="slate-600"
                    font_weight="bold"
                    text_align="center"
                >
                    SCANNER <br /> POUR VOUS ENREGISTRER
                </Text>
            </div>
            <Center>
                <QRCode registerPath={registerPath} />
            </Center>
        </div>
    );
}
