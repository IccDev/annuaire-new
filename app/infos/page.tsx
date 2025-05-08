"use client";

import { useRouter } from "next/navigation";

const ReasonCard = ({ number, title, description }: { number: number, title: string, description: string }) => (
    <div className="bg-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:scale-105">
        <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-slate-700 text-white rounded-lg flex items-center justify-center text-2xl font-bold">
                    {number}
                </div>
            </div>
            <div className="flex-1">
                <h3 className="text-xl font-semibold text-slate-800 mb-2">{title}</h3>
                <p className="text-slate-600">{description}</p>
            </div>
        </div>
    </div>
);

export default function InfosPage() {
    const router = useRouter();

    const goBack = () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            router.push('/home');
        }
    };

    const reasons = [
        {
            title: "Solidarité communautaire",
            description: "Renforcez les liens au sein de notre communauté en privilégiant les compétences de nos membres. Ensemble, nous créons un réseau professionnel solide et bienveillant."
        },
        {
            title: "Expertise garantie",
            description: "Accédez à des professionnels qualifiés et de confiance, partageant vos valeurs. Leur engagement spirituel reflète leur intégrité professionnelle."
        },
        {
            title: "Soutien mutuel",
            description: "Contribuez à la prospérité de notre communauté en choisissant les services de nos membres. Chaque collaboration renforce notre tissu social et économique."
        },
        {
            title: "Facilité d'accès",
            description: "Trouvez rapidement le professionnel dont vous avez besoin grâce à notre annuaire intuitif. Plus besoin de longues recherches, la solution est dans votre église."
        },
        {
            title: "Confiance partagée",
            description: "Bénéficiez d'un service basé sur des valeurs communes et une confiance mutuelle. La relation client-prestataire prend une dimension plus humaine et fraternelle."
        }
    ];

    return (
        <div className="min-h-screen bg-slate-100 p-6">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={goBack}
                    className="flex items-center text-slate-600 hover:text-slate-900 mb-8"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Retour
                </button>

                <h1 className="text-4xl font-bold text-slate-800 text-center mb-4">
                    Pourquoi choisir notre annuaire ?
                </h1>
                <p className="text-slate-600 text-center mb-12">
                    Découvrez les avantages uniques de notre annuaire professionnel au service de notre communauté
                </p>

                <div className="space-y-6">
                    {reasons.map((reason, index) => (
                        <ReasonCard
                            key={index}
                            number={index + 1}
                            title={reason.title}
                            description={reason.description}
                        />
                    ))}

                    <div className="bg-gradient-to-r from-slate-700 to-slate-600 rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:scale-105">
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-white text-slate-700 rounded-lg flex items-center justify-center text-2xl font-bold">
                                    +
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-white mb-2">
                                    Respect des tarifs professionnels
                                </h3>
                                <p className="text-slate-200">
                                    Valorisons le travail de nos professionnels en respectant leurs tarifs. Un service de qualité mérite une rémunération juste, permettant à chacun de prospérer dans son activité tout en servant notre communauté.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}