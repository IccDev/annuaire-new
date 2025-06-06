"use client";

import RegisterForm from "@/components/update/RegisterForm";
import { useParams } from "next/navigation";
import { defaultRegisterFormData, RegisterFormData } from "@/types/interfaces/annuaire-register";
import { useEffect, useState } from "react";
import { get_user_by_id } from "@/app/api/annuaire-api";

export default function UpdatePage() {
    const [userData, setUserData] = useState<RegisterFormData>(defaultRegisterFormData);

    let {user_id} = useParams();

    useEffect(() => {}, [userData])

    useEffect(() => {
        const fetchUserById = async () => {
                try {
                    const response = await get_user_by_id(`${user_id}`);
                    setUserData({
                        eglise: response[0].eglise,
                        personnel: response[0].personnel,
                        professionnel: response[0].professionnel
                    });
                    //console.log("data response: ", response);
                } catch (error) {
                    console.error("Erreur lors de la récupération des données du membre:", error);
                }
        };
        fetchUserById();
    }, [user_id]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
            <main className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <RegisterForm defaultRegisterFormData={userData} action="update" user_id={`${user_id}`} />
                </div>
            </main>
        </div>
    );
}