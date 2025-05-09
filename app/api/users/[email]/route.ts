import { NextResponse } from 'next/server';
import { defaultRegisterFormData } from '@/types/interfaces/annuaire-register';

export async function GET(request: Request, { params }: { params: { email: string } }) {
  try {
    const email = params.email;
    
    if (!email) {
      return NextResponse.json(
        { error: "L'adresse email est requise" },
        { status: 400 }
      );
    }

  
    const res = await fetch(
      `http://84.234.16.224:4042/annuaire/query/user/email/${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Cache-Control": "no-cache",
        },
      }
    );
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error(`Erreur API (${res.status}):`, errorData);
      return NextResponse.json(
        { error: `Erreur lors de la récupération des données utilisateur (${res.status})` },
        { status: res.status }
      );
    }

    const userData = await res.json();
    console.log(`Données utilisateur récupérées pour ${email}`);

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Erreur lors de la récupération des données utilisateur:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des données utilisateur" },
      { status: 500 }
    );
  }
}