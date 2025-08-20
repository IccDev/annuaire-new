import { NextResponse } from 'next/server';


function transformPayloadForExternalAPI(payload: any) {
  const transformedPayload = { ...payload };
  
  console.log("Payload received for create:", JSON.stringify(transformedPayload, null, 2));
  
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