"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { get_churches } from "@/app/api/annuaire-api";
import { Eglise } from "@/types/interfaces/annuaire";

import AnnuaireImg from "@/public/images/Annuaire.jpg";
import ConstructionImg from "@/public/images/macon.jpg";
import CuisinierImg from "@/public/images/cuisinier.jpg";
import InformatiqueImg from "@/public/images/informaticien.jpeg";

const Spinner = () => (
    <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
    </div>
);

const searchSchema = z.object({
    key: z.string().min(1, "Entrez un mot clé pour la recherche"),
    church: z.string().optional(),
});

type SearchFormValues = z.infer<typeof searchSchema>;

const Search = () => {
    const router = useRouter();
    const params = useParams();
    const eglise = params.eglise as string;
    const [isLoading, setIsLoading] = useState(false);
    const [eglises, setEglises] = useState<Eglise[]>([]);

    useEffect(() => {
        const fetchChurches = async () => {
            try {
                const churches = await get_churches();
                setEglises(churches);
            } catch (error) {
                console.error('Erreur lors de la récuperation des églises :', error);
            }
        };

        fetchChurches();
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SearchFormValues>({
        resolver: zodResolver(searchSchema),
        defaultValues: {
            key: "",
            church: "toutes",
        },
    });

    const onSubmit = (data: SearchFormValues) => {
        setIsLoading(true);
        //Pour Jason & Djedou : Nettoyage de la clé de recherche
        // Ceci va éviter de faire des recherches avec des espaces en trop
        const cleanedKey = data.key.trim().replace(/\s+/g, " ");
        if (!cleanedKey) {
            setIsLoading(false);
            return;
        }
        setTimeout(() => {
            router.push(`/annuaire/users/${cleanedKey}/${data.church}`);
            setIsLoading(false);
        }, 1000);
        console.log("Recherche effectuée avec les données :", data);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center space-y-4 w-full"
        >
            <div className="mb-4 flex w-full flex-col gap-4 sm:flex-row">
                <div className="flex w-full basis-4/5 items-center rounded-lg border-2 border-solid border-slate-300 transition-colors focus-within:border-slate-500 hover:border-slate-400">
                    <input
                        placeholder="Ex: Informatique, Santé, Commerce,…"
                        type="text"
                        className="h-12 flex-1 border-transparent px-4 text-lg focus:outline-none"
                        {...register("key")}
                    />
                    <SearchIcon className="mr-2 h-6 w-8 text-slate-500" />
                </div>
                <div className="relative flex w-full sm:w-auto sm:basis-1/5 items-center justify-center">
                    <select
                        id="church"
                        className="h-12 w-full cursor-pointer appearance-none rounded-lg border-2 border-slate-300 bg-white px-4 text-lg transition-all duration-300 ease-in-out hover:border-slate-400 focus:border-slate-500 focus:outline-none"
                        {...register("church")}
                    >
                        <option
                            className="w-24 hover:border-slate-400 focus:border-slate-500"
                            value="toutes"
                        >
                            {"Église"}
                        </option>
                        {eglises.map((eglise, index) => (
                            <option
                                className="w-24 hover:border-slate-400 focus:border-slate-500"
                                key={index + 1}
                                value={eglise.nom}
                            >
                                {eglise.nom}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute bottom-0 right-0 top-0 flex items-center px-2 text-slate-500">
                        <svg
                            className="h-5 w-5 transform fill-current transition-transform duration-300 ease-in-out group-hover:rotate-180"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                        >
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                    </div>
                </div>
            </div>
            {errors.key && (
                <p className="mb-2 text-sm font-medium text-pink-600">
                    {errors.key.message}
                </p>
            )}
            <button
                type="submit"
                className="w-full cursor-pointer rounded-full bg-slate-700 px-4 py-2 text-lg text-white hover:bg-slate-500"
                disabled={isLoading}
            >
                {isLoading ? <Spinner /> : "Rechercher"}
            </button>
        </form>
    );
};

export default function HomePage() {
    const router = useRouter();
    const params = useParams();
    const eglise = params.eglise as string;
    const [isSearching, setIsSearching] = useState(false);

    const egliseParam = eglise ? eglise.toLowerCase() : '';

    return (
        <div className="h-lvh bg-slate-200 bg-gradient-to-tr p-2 sm:p-4">
            <div className="h-1/4 w-full rounded-lg bg-white p-1">
                <div className="relative h-full w-full overflow-hidden rounded-lg bg-neutral-200">
                    <Image
                        src={AnnuaireImg}
                        alt="Annuaire"
                        className="w-full"
                        layout="fill"
                        objectFit="cover"
                    />
                </div>
            </div>
            <p className="mt-4 text-center text-2xl sm:text-4xl font-bold text-slate-600">
                {"Retrouvez les différents corps de métier dans la famille ICC"}
            </p>
            <p className="p-4 text-center text-sm sm:text-base">
                Annuaire des églises ICC visant à faciliter l'accès aux différents
                professionnels au sein de l'église.{" "}
            </p>
            <div className="w-full rounded-lg bg-white p-4 sm:p-6">
                <p className="mb-4 text-lg font-semibold">
                    {"Quelle profession cherchez-vous ?"}
                </p>
                <Search />
                {isSearching && <div className="ml-4">Recherche en cours...</div>}
                {/* <div className="mt-4 w-full flex justify-center">
                    <Link
                        href={`/recherche-intelligente`}
                        className="w-full sm:w-auto cursor-pointer rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 px-6 py-3 text-lg font-semibold text-white hover:from-sky-600 hover:to-indigo-700 text-center flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-300"
                    >
                        <Image src="/images/ai.png" alt="Recherche Intelligente" width={24} height={24} />
                        {"Recherche Intelligente"}
                    </Link>
                </div> */}
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <Link
                        href={`/scanner`}
                        className="w-full sm:w-auto cursor-pointer rounded-full bg-slate-700 px-4 py-2 text-lg text-white hover:bg-slate-500 text-center order-1 sm:order-none"
                    >
                        {"S'enregistrer"}
                    </Link>
                    <Link
                        href={`/update`}
                        className="w-full sm:w-auto cursor-pointer rounded-full border border-sky-500 px-4 py-2 text-lg text-center order-2 sm:order-none"
                    >
                        {"Mettre à jour mes données"}
                    </Link>
                </div>
            </div>
            <div className="mt-8 rounded-lg bg-white p-6 shadow-md">
                <h2 className="text-2xl mb-6 text-center font-bold text-slate-600">
                    Retrouvez les professionnels de votre choix...
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    <div className="group flex flex-col items-center transform transition-all hover:-translate-y-1 duration-200">
                        <div className="w-full h-48 md:h-40 lg:h-48 overflow-hidden rounded-lg">
                            <Image
                                src={ConstructionImg}
                                alt="Construction"
                                className="w-full h-full object-cover transform transition-transform group-hover:scale-105"
                                width={400}
                                height={300}
                            />
                        </div>
                        <p className="mt-3 text-lg font-semibold text-slate-700">Construction</p>
                    </div>
                    <div className="group flex flex-col items-center transform transition-all hover:-translate-y-1 duration-200">
                        <div className="w-full h-48 md:h-40 lg:h-48 overflow-hidden rounded-lg">
                            <Image
                                src={CuisinierImg}
                                alt="Chef de cuisine"
                                className="w-full h-full object-cover transform transition-transform group-hover:scale-105"
                                width={400}
                                height={300}
                            />
                        </div>
                        <p className="mt-3 text-lg font-semibold text-slate-700">Chef de cuisine</p>
                    </div>
                    <div className="group flex flex-col items-center transform transition-all hover:-translate-y-1 duration-200">
                        <div className="w-full h-48 md:h-40 lg:h-48 overflow-hidden rounded-lg">
                            <Image
                                src={InformatiqueImg}
                                alt="Informatique"
                                className="w-full h-full object-cover transform transition-transform group-hover:scale-105"
                                width={400}
                                height={300}
                            />
                        </div>
                        <p className="mt-3 text-lg font-semibold text-slate-700">Informatique</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
