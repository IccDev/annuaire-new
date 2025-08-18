import { NextResponse } from "next/server";


function transformDataFromExternalAPI(data: any): any {
  if (!data) return data;
  
  if (Array.isArray(data)) {
    return data.map((item: any) => transformDataFromExternalAPI(item));
  }
  
  const transformedData = { ...data };
  
  if (transformedData.professionnel) {
    
    if (transformedData.professionnel.professions && Array.isArray(transformedData.professionnel.professions)) {
      transformedData.professionnel.professions = transformedData.professionnel.professions.map((prof: any) => ({
        ...prof,
        periodeDebut: prof.periode_debut || "",
        periodeFin: prof.periode_fin || "",
      }));
      
      transformedData.professionnel.professions.forEach((prof: any) => {
        delete prof.periode_debut;
        delete prof.periode_fin;
      });
    }
    
    if (transformedData.professionnel.educations && Array.isArray(transformedData.professionnel.educations)) {
      transformedData.professionnel.educations = transformedData.professionnel.educations.map((edu: any) => ({
        ...edu,
        periodeDebut: edu.periode_debut || "",
        periodeFin: edu.periode_fin || "",
      }));
      
      transformedData.professionnel.educations.forEach((edu: any) => {
        delete edu.periode_debut;
        delete edu.periode_fin;
      });
    }
  }
  
  return transformedData;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const res = await fetch(
      `http://84.234.16.224:4042/annuaire/query/user/${id}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Cache-Control": "no-cache",
        },
      }
    );

    const data = await res.json();
    
    const transformedData = transformDataFromExternalAPI(data);
    
    return NextResponse.json(transformedData);
  } catch (error) {
    console.error("Erreur de recuperation du détail:", error);
    return NextResponse.json(
      { error: "Erreur de recuperation du détail:" },
      { status: 500 }
    );
  }
}
