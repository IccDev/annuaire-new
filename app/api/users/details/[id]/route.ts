import { NextResponse } from "next/server";


function transformDataFromExternalAPI(data: any): any {
  if (!data) return data;
  
  if (Array.isArray(data)) {
    return data.map((item: any) => transformDataFromExternalAPI(item));
  }
  
  const transformedData = { ...data };
  
  console.log("Transforming data for professionnel:", transformedData.professionnel);
  
  if (transformedData.professionnel) {
    
    if (transformedData.professionnel.professions && Array.isArray(transformedData.professionnel.professions)) {
      console.log("Original professions:", transformedData.professionnel.professions);
    }
    
    if (transformedData.professionnel.educations && Array.isArray(transformedData.professionnel.educations)) {
      console.log("Original educations:", transformedData.professionnel.educations);
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
    
    console.log("Raw data from external API:", JSON.stringify(data, null, 2));
    
    const transformedData = transformDataFromExternalAPI(data);
    
    console.log("Transformed data:", JSON.stringify(transformedData, null, 2));
    
    return NextResponse.json(transformedData);
  } catch (error) {
    console.error("Erreur de recuperation du détail:", error);
    return NextResponse.json(
      { error: "Erreur de recuperation du détail:" },
      { status: 500 }
    );
  }
}
