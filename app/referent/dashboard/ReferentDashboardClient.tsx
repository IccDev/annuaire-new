"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Candidate } from '@/app/generated/prisma/client';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Home } from 'lucide-react';

interface ReferentDashboardClientProps {
  candidates: Candidate[];
}

const ReferentDashboardClient = ({ candidates }: ReferentDashboardClientProps) => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button onClick={() => router.back()} className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour
            </button>

            <button onClick={() => router.push('/home')} className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              <Home className="w-5 h-5 mr-2" />
              Accueil
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-xl font-semibold text-gray-800">Tableau de bord référent</h1>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email du Candidat</TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code Validé</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white divide-y divide-gray-200">
              {candidates.map((candidate) => (
                <TableRow key={candidate.id} className="hover:bg-gray-50">
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{candidate.emailCandidate}</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{candidate.codeValidation ? 'Oui' : 'Non'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
};

export default ReferentDashboardClient;