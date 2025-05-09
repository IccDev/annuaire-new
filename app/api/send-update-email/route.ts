import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, eglise } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "L'adresse email est requise" },
        { status: 400 }
      );
    }


    const encodedEmail = encodeURIComponent(email);
    
  
    const updateUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/update/${encodedEmail}`;

    console.log(`Email de mise à jour envoyé à ${email} avec le lien: ${updateUrl}`);

    return NextResponse.json({ success: true, message: "Email envoyé avec succès" });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi de l'email" },
      { status: 500 }
    );
  }
}