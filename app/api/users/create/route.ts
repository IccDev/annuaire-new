import { NextResponse } from 'next/server';


function transformPayloadForExternalAPI(payload: any) {
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
  
    const checkEmailRes = await fetch(
      `http://84.234.16.224:4042/annuaire/check/email?email=${encodeURIComponent(payload.personnel.email)}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    const emailCheckData = await checkEmailRes.json();
    
    if (emailCheckData.exists) {
      return NextResponse.json(
        { message: "Cette adresse email est déjà utilisée" },
        { status: 400 }
      );
    }
    
    const transformedPayload = transformPayloadForExternalAPI(payload);
  
    const res = await fetch(
      "http://84.234.16.224:4042/annuaire/create/user",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(transformedPayload),
      }
    );
    
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}