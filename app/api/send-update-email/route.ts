import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, user_id } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "L'adresse email est requise" },
        { status: 400 }
      );
    }
  
    const updateUrl = `${process.env.NEXT_PUBLIC_APP_URL}/update/${user_id}`;

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