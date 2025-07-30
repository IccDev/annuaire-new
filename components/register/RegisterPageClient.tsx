"use client";

import { useSearchParams } from 'next/navigation';
import RegisterForm from "@/components/register/RegisterForm";
import { defaultRegisterFormData } from "@/types/interfaces/annuaire-register";

export default function RegisterPageClient() {
    const searchParams = useSearchParams();
    const userEmail = searchParams.get('email') || undefined;

    return (
        <RegisterForm 
            defaultRegisterFormData={defaultRegisterFormData} 
            action="create" 
            userEmail={userEmail} 
        />
    );
}