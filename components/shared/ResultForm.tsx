"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Search as SearchIcon, ChevronLeft, ChevronRight, Home } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { search_users, get_churches } from "@/app/api/annuaire-api";
import { AnnuaireSearch, Eglise, getId, RecordId } from "@/types/interfaces/annuaire";
import { cn } from "@/lib/utils";
import Avatar from "@/public/images/avatar.png";

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

export default function ResultForm() {
    const router = useRouter();
    const params = useParams();
    const eglise = params.eglise as string;
    const key = params.key as string;
    const church = params.church as string;

    const [isLoading, setIsLoading] = useState(false);
    const [eglises, setEglises] = useState<Eglise[]>([]);
    const [userData, setUserData] = useState<AnnuaireSearch[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [totalPages, setTotalPages] = useState(1);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<SearchFormValues>({
        resolver: zodResolver(searchSchema),
        defaultValues: {
            key: key,
            church: church,
        },
    });

    useEffect(() => {
        const fetchChurches = async () => {
            try {
                const churches = await get_churches();
                setEglises(churches);
            } catch (error) {
                console.error('Erreur lors de la récupération des églises :', error);
            }
        };

        fetchChurches();
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            if (key) {
                setIsLoading(true);
                try {
                    const users = await search_users(key, church);
                    setUserData(users);
                    setTotalPages(Math.ceil(users.length / itemsPerPage));
                } catch (error) {
                    console.error('Erreur lors de la recherche :', error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchUsers();
        setValue("key", key);
        setValue("church", church);
    }, [key, church, setValue]);

    const onSubmit = (data: SearchFormValues) => {
        setIsLoading(true);
        const cleanedKey = data.key.trim().replace(/\s+/g, " ");
        router.push(`/annuaire/users/${cleanedKey}/${data.church}`);
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goBack = () => {
        router.back();
    };

    const goHome = () => {
        router.push(`/home`);
    };

    const routeToDetails = (id: RecordId) => {
        const userId = getId(id.id);
        router.push(`/annuaire/users/details/${userId}`);
    };


    const paginatedUsers = userData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="flex min-h-screen flex-col">
            <Navigate goBack={goBack} goHome={goHome} />
            <div className="fixed left-0 right-0 top-0 z-50 bg-white shadow-md">
                <div className="flex items-center p-4 border-b">
                    <button
                        onClick={goBack}
                        className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                        onClick={goHome}
                        className="p-2 rounded-full hover:bg-slate-100 transition-colors ml-2"
                    >
                        <Home className="h-5 w-5" />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="mx-auto max-w-3xl p-4"
                >
                    <div className="mb-4 flex flex-col gap-4 md:flex-row">
                        <div className="relative flex-grow md:flex-grow-[3]">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <SearchIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                placeholder="Ex: Informatique, Santé, Commerce,…"
                                type="text"
                                className="block w-full rounded-lg border-0 py-3 pl-10 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                                {...register("key")}
                            />
                        </div>
                        <div className="relative md:flex-grow-[1]">
                            <select
                                id="church"
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                                {...register("church")}
                            >
                                <option value="toutes">Église</option>
                                {eglises.map((eglise, index) => (
                                    <option
                                        key={index + 1}
                                        value={eglise.nom}
                                    >
                                        {eglise.nom}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {errors.key && (
                        <p className="mb-2 text-sm font-medium text-pink-600">
                            {errors.key.message}
                        </p>
                    )}
                    <button
                        type="submit"
                        className="w-full rounded-lg bg-slate-700 px-4 py-2 font-semibold text-white transition duration-300 ease-in-out hover:bg-slate-600"
                        disabled={isLoading}
                    >
                        {isLoading ? <Spinner /> : "Rechercher"}
                    </button>
                </form>
            </div>

            <div className="flex-1 px-4">
                <div className="mt-[280px] sm:mt-[220px] mb-[150px] relative z-10">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <Spinner />
                            <span className="ml-2">Chargement des résultats...</span>
                        </div>
                    ) : userData.length === 0 ? (
                        <div className="mt-8 text-center text-xl font-semibold text-gray-600">
                            Aucun professionnel trouvé.
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                                {paginatedUsers.map((user, index) => (
                                    <div key={index} className="w-full mb-4 relative z-0">
                                        <div className="flex h-full transform flex-col overflow-hidden rounded-lg bg-white transition-all duration-300 hover:scale-105 hover:shadow-xl">
                                            <div className="relative flex-grow p-6">
                                                <div className="absolute inset-0 bg-gradient-to-b from-slate-300 to-transparent opacity-60"></div>
                                                {user.photo ? (
                                                    <Image
                                                        src={user.photo}
                                                        alt={`${user.prenom} ${user.nom}`}
                                                        width={128}
                                                        height={128}
                                                        className="relative z-10 mx-auto h-32 w-32 rounded-full border-4 border-white object-cover shadow-lg"
                                                    />
                                                ) : (
                                                    <Image
                                                        src={Avatar}
                                                        alt={`${user.prenom} ${user.nom}`}
                                                        width={128}
                                                        height={128}
                                                        className="relative z-10 mx-auto h-32 w-32 rounded-full border-4 border-white object-cover shadow-lg"
                                                    />
                                                )}
                                                <div className="mt-4 text-center">
                                                    <h3 className="mb-2 text-2xl font-bold tracking-tight text-slate-800">
                                                        {`${user.prenom} ${user.nom}`}
                                                    </h3>
                                                    <p className="mb-4 inline-block rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-blue-950">
                                                        {user.professions && user.professions.length > 0
                                                            ? user.professions
                                                                .map((prof: any) => prof.titre)
                                                                .join(", ")
                                                            : "Profession non spécifiée"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-auto p-6">
                                                <button
                                                    onClick={() => routeToDetails(user.id)}
                                                    className="w-full transform rounded-md bg-slate-700 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-all duration-300 hover:-translate-y-1 hover:bg-slate-600 hover:shadow-md"
                                                >
                                                    VOIR LA FICHE
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center bg-white py-4 shadow-lg">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={goToPreviousPage}
                                            disabled={currentPage === 1}
                                            className="rounded-md bg-slate-700 px-4 py-2 text-white disabled:bg-slate-300"
                                        >
                                            Précédent
                                        </button>
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                                            (pageNum) => (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => handlePageChange(pageNum)}
                                                    className={cn(
                                                        "rounded-md px-4 py-2",
                                                        pageNum === currentPage
                                                            ? "bg-slate-700 text-white"
                                                            : "bg-slate-200 text-slate-700"
                                                    )}
                                                >
                                                    {pageNum}
                                                </button>
                                            )
                                        )}
                                        <button
                                            onClick={goToNextPage}
                                            disabled={currentPage === totalPages}
                                            className="rounded-md bg-slate-700 px-4 py-2 text-white disabled:bg-slate-300"
                                        >
                                            Suivant
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
