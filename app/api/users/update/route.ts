import { NextResponse } from 'next/server';

function transformPayloadForExternalAPI(payload: any): any {
  const transformedPayload = { ...payload };
  
  if (transformedPayload.professionnel?.professions) {
    transformedPayload.professionnel.professions = transformedPayload.professionnel.professions.map((prof: any) => ({
      ...prof,
      periode_debut: prof.periodeDebut,
      periode_fin: prof.periodeFin,
    }));
    
    transformedPayload.professionnel.professions.forEach((prof: any) => {
      delete prof.periodeDebut;
      delete prof.periodeFin;
    });
  }
  
  if (transformedPayload.professionnel?.educations) {
    transformedPayload.professionnel.educations = transformedPayload.professionnel.educations.map((edu: any) => ({
      ...edu,
      periode_debut: edu.periodeDebut,
      periode_fin: edu.periodeFin,
    }));
    
    transformedPayload.professionnel.educations.forEach((edu: any) => {
      delete edu.periodeDebut;
      delete edu.periodeFin;
    });
  }
  
  return transformedPayload;
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    const transformedData = transformPayloadForExternalAPI(payload.data);
    
    const res = await fetch(
      `http://84.234.16.224:4042/annuaire/update/user/${payload.user_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(transformedData),
      }
    );
    
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}