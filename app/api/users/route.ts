import { NextResponse } from "next/server";
import type { AnnuaireSearch } from "@/types/interfaces/annuaire";

function transformDataFromExternalAPI(data: any): any {
  if (!data) return data;
  
  const transformedData = { ...data };
  
  if (Array.isArray(transformedData)) {
    return transformedData.map((item: any) => transformDataFromExternalAPI(item));
  }
  
  if (transformedData.professions && Array.isArray(transformedData.professions)) {
    transformedData.professions = transformedData.professions.map((prof: any) => {
      const transformedProf = { ...prof };
      if (prof.periode_debut !== undefined) {
        transformedProf.periodeDebut = prof.periode_debut;
        delete transformedProf.periode_debut;
      }
      if (prof.periode_fin !== undefined) {
        transformedProf.periodeFin = prof.periode_fin;
        delete transformedProf.periode_fin;
      }
      return transformedProf;
    });
  }
  
  return transformedData;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const key = url.searchParams.get("key") || "";
  const church = url.searchParams.get("church") || "toutes";

  if (!key) {
    return NextResponse.json(
      { error: 'Le paramètre "key" est requis' },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(
      `http://84.234.16.224:4042/annuaire/query/users/${key}/${church}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Cache-Control": "no-cache",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Erreur HTTP: ${res.status}`);
    }

    const data = await res.json();
    
    const transformedData = transformDataFromExternalAPI(data);
    
    return NextResponse.json(transformedData);
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    return NextResponse.json(
      {
        error: "Échec de la récupération des utilisateurs",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
