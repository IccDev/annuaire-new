"use client";

import RegisterForm from "@/components/register/RegisterForm";
import Header from "@/components/register/header/Header";
import { defaultRegisterFormData } from "@/types/interfaces/annuaire-register";

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
            <Header />
            <main className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <RegisterForm defaultRegisterFormData={defaultRegisterFormData} action="create" />
                </div>
            </main>
        </div>
    );
}