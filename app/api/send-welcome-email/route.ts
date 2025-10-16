import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { to_email, user_name } = body;

    if (!to_email || !user_name) {
      return NextResponse.json(
        { error: "Email et nom d'utilisateur requis." },
        { status: 400 }
      );
    }

    const annuaireUrl =
      process.env.BETTER_AUTH_URL || "https://annuaire.impactcentrechretien.eu";

    const { data, error } = await resend.emails.send({
      from: "ICC Annuaire <no-reply@impactcentrechretien.eu>",
      to: [to_email],
      subject: "Bienvenue sur l'Annuaire ICC - Inscription réussie !",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Bienvenue sur l'Annuaire ICC</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
              .container { background-color: #f9fafb; border-radius: 8px; padding: 24px; }
              .content { background-color: white; padding: 20px; border-radius: 6px; margin: 16px 0; }
              .button { display: inline-block; background-color: #3b82f6; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; margin: 16px 0; font-weight: 500; }
              .button:hover { background-color: #2563eb; }
              .footer { margin-top: 24px; font-size: 14px; color: #666; border-top: 1px solid #e5e7eb; padding-top: 16px; }
              .highlight { background-color: #dbeafe; padding: 2px 6px; border-radius: 4px; color: #1e40af; font-weight: 500; }
              ul { margin-left: 20px; color: #475569; }
            </style>
          </head>
          <body>
            <div class="container">
              <h2 style="text-align: center; color: #1e293b; margin-bottom: 24px;">Bienvenue sur l'Annuaire ICC !</h2>
              
              <div class="content">
                <p>Bonjour <strong>${user_name}</strong>,</p>
                
                <p>
                  Félicitations ! Votre compte a été créé avec succès sur 
                  <span class="highlight">l'Annuaire des compétences d'ICC Belgique</span>.
                </p>
                
                <p>
                  Vous faites maintenant partie de notre communauté et pouvez accéder aux fonctionnalités de la plateforme :
                </p>
                
                
                <div style="text-align: center; margin: 24px 0;">
                  <a href="${annuaireUrl}" class="button">Accéder à l'annuaire</a>
                </div>
                
              </div>
              
              <div class="footer">
                <p>
                  <strong>Besoin d'aide ?</strong><br>
                  N'hésitez pas à nous contacter à <a href="mailto:iccdev@impactcentrechretien.eu">iccdev@impactcentrechretien.eu</a>
                </p>
                <p>
                  Cordialement,<br>
                  <strong>L'équipe informatique (DSI)</strong>
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Erreur Resend:", error);
      return NextResponse.json(
        { error: "Erreur lors de l'envoi de l'email." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Email de bienvenue envoyé avec succès.", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de l'envoi:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de l'envoi de l'email." },
      { status: 500 }
    );
  }
}
