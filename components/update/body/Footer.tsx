"use client";

interface FooterProps {
    onPrevious: () => void;
}

export default function Footer({ onPrevious }: FooterProps) {
    return (
        <div className="flex justify-between mt-6">
            <button
                type="button"
                onClick={onPrevious}
                className="flex items-center text-slate-600 hover:text-slate-900 transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Retour
            </button>
        </div>
    );
}