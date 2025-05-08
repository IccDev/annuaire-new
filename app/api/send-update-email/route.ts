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

    // Encoder l'email pour l'URL
    const encodedEmail = encodeURIComponent(email);
    
    // Construire l'URL de mise à jour
    const updateUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/update/${encodedEmail}`;

    // Ici, vous devriez implémenter l'envoi d'email réel
    // Exemple avec un service d'email comme SendGrid, Mailjet, etc.
    // const emailSent = await sendEmail({
    //   to: email,
    //   subject: "Mise à jour de vos informations - Jeunes Bâtisseurs",
    //   html: `
    //     <h1>Mise à jour de vos informations</h1>
    //     <p>Bonjour,</p>
    //     <p>Vous avez demandé à mettre à jour vos informations dans l'annuaire des Jeunes Bâtisseurs.</p>
    //     <p>Veuillez cliquer sur le lien ci-dessous pour accéder au formulaire de mise à jour :</p>
    //     <a href="${updateUrl}" style="display:inline-block;padding:10px 20px;background-color:#475569;color:white;text-decoration:none;border-radius:4px;">
    //       Mettre à jour mes informations
    //     </a>
    //     <p>Ce lien est valable pendant 24 heures.</p>
    //     <p>Si vous n'avez pas demandé cette mise à jour, veuillez ignorer cet email.</p>
    //     <p>Cordialement,<br>L'équipe des Jeunes Bâtisseurs</p>
    //   `
    // });

    // Pour la démonstration, nous simulons un envoi réussi
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