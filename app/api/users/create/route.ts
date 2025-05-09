import { NextResponse } from 'next/server';

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
    
  
    const res = await fetch(
      "http://84.234.16.224:4042/annuaire/create/user",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
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