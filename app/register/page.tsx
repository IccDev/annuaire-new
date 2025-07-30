import Header from "@/components/register/header/Header";
import RegisterPageClient from "@/components/register/RegisterPageClient";
import { Suspense } from 'react';

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
            <Header />
            <main className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <Suspense fallback={<div>Chargement...</div>}>
                        <RegisterPageClient />
                    </Suspense>
                </div>
            </main>
        </div>
    );
}